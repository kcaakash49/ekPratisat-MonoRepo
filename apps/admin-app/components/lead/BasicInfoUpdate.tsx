"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Edit3, Plus, Trash2 } from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@repo/ui/dialog";
import { Button } from "@repo/ui/button";

import { useQueryClient } from "@tanstack/react-query";
import { useLeadBasicInfo } from "@repo/query-hook";



interface LeadProps {
    leadId: string;
    name: string | null;
    email: string | null;
    coordinates: string | null;
    notes: Record<string, any> | null | any;
    status: string;

}

interface PayloadType {
    name?: string;
    email?: string;
    coordinates?: string;
    notes?: Record<string, any> | null | any;

}

interface KeyValueRow {
    id: string;
    key: string;
    value: string;
}

const generateConfirmationText = () => {
    const words = ["verify", "confirm", "proceed", "continue", "accept", "approve"];
    const randomWord = words[Math.floor(Math.random() * words.length)];
    return `Type "${randomWord}" to verify`;
};

export default function BasicInfoUpdate({ leadId, name, email, coordinates, notes, status }: LeadProps) {
    const [open, setOpen] = useState(false);
    const [confirmationText, setConfirmationText] = useState("");
    const [form, setForm] = useState({
        name: name ? name : "",
        email: email ? email : "",
        coordinates: coordinates ? coordinates : ""
    });
    const [userInput, setUserInput] = useState("");

    // Default fallback state
    const [rows, setRows] = useState<KeyValueRow[]>([
        { id: "1", key: "", value: "" }
    ]);

    const { mutate, isPending } = useLeadBasicInfo(leadId);
    const queryClient = useQueryClient();


    const handleOpenDialog = () => {
        setOpen(true);
        setConfirmationText(generateConfirmationText());
        setUserInput("");
        setForm({
            name: name ? name : "",
            email: email ? email : "",
            coordinates: coordinates ? coordinates : ""
        })

        if (notes) {
            const populatedRows = Object.entries(notes).map(([key, value]) => ({
                id: Math.random().toString(),
                key: key,
                value: typeof value === "string" ? value : JSON.stringify(value)
            }));
            setRows(populatedRows);
        }

    };

    const handleAddRow = () => {
        setRows([...rows, { id: Math.random().toString(), key: "", value: "" }]);
    };

    const handleRemoveRow = (id: string) => {
        if (rows.length === 1) {
            setRows([{ id: Math.random().toString(), key: "", value: "" }]);
            return;
        }
        setRows(rows.filter(row => row.id !== id));
    };

    const handleFieldChange = (id: string, field: "key" | "value", newValue: string) => {
        setRows(rows.map(row => row.id === id ? { ...row, [field]: newValue } : row));
    };

    const handleChange = (e:React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleVerify = (e:React.FormEvent) => {
        e.preventDefault();
        const finalNoteObject: Record<string, string> = {};
        let emptyKeyFound = false;

        rows.forEach(row => {
            const trimmedKey = row.key.trim();
            const trimmedValue = row.value.trim();

            if (trimmedKey === "" && trimmedValue !== "") {
                emptyKeyFound = true;
            } else if (trimmedKey !== "") {
                finalNoteObject[trimmedKey] = trimmedValue;
            }
        });

        if (emptyKeyFound) {
            toast.error("A value is missing its Label/Key name.");
            return;
        }

        const expectedText = confirmationText.replace('Type "', '').replace('" to verify', '');
        if (userInput.trim().toLowerCase() !== expectedText.toLowerCase()) {
            toast.error("Confirmation text doesn't match. Please try again.");
            return;
        }

        const payload = Object.fromEntries(
            Object.entries(form).filter(([key, value]) => {
                return value !== "";
            })
        );

        if (Object.keys(finalNoteObject).length > 0){
            payload.notes = JSON.stringify(finalNoteObject);
        }

        mutate(payload, {
            onSuccess: (data) => {
                toast.success(data.message || "Operation Success!!!")
                queryClient.invalidateQueries({
                    queryKey: ["lead-detail", leadId]
                })
                queryClient.invalidateQueries({
                    queryKey:["leads"]
                });
                queryClient.invalidateQueries({
                    queryKey:["user-leads"]
                });
                setOpen(false);
            }
        })

    };

    const isConfirmButtonDisabled = isPending || userInput.trim() === "";
    const disabledCondition = status === "WON" || status === "LOST";

    return (
        <>
            <button onClick={handleOpenDialog} className={`inline-flex items-center gap-1.5 px-3 py-2 border border-secondary-200 dark:border-secondary-800 hover:bg-secondary-50 dark:hover:bg-secondary-800 rounded-xl text-xs font-semibold text-secondary-700 dark:text-secondary-300 transition-colors ${disabledCondition ? "cursor-not-allowed" : "cursor-pointer"}`} disabled={disabledCondition}>
                <Edit3 className="w-3.5 h-3.5 text-secondary-400" />
                <span>Edit Basic Info</span>
            </button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent onClose={() => setOpen(false)} className="max-w-xl">
                    <DialogHeader>
                        <DialogTitle>
                            Edit Basic Info and Update Notes
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleVerify} className="space-y-6 max-h-[60vh] overflow-y-auto pr-1">
                        <p className="text-secondary-600 dark:text-secondary-300 text-sm">
                            Update basic information and notes
                        </p>

                        <div className="flex flex-col space-y-2">
                            <label htmlFor="name" className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                                Name <span className="text-red-500">*</span>
                            </label>
                            <input value={form.name} required={!!name} name="name" className="w-full px-3 py-2  border  border-secondary-300 dark:border-secondary-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100" placeholder="eg: Balen Shah" onChange={handleChange} />
                        </div>

                        <div className="flex flex-col space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input value={form.email} required={!!email} type="email" name="email" className="w-full px-3 py-2  border  border-secondary-300 dark:border-secondary-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100" placeholder="eg. balenshah@gmail.com" onChange={handleChange} />
                        </div>

                        <div className="flex flex-col space-y-2">
                            <label htmlFor="coordinates" className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                                Coordinates <span className="text-red-500">*</span>
                            </label>
                            <input value={form.coordinates} name = "coordinates" className="w-full px-3 py-2  border  border-secondary-300 dark:border-secondary-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100" placeholder="eg. 25.1023, 15.1231" onChange={handleChange} />
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-semibold text-secondary-700 dark:text-secondary-300">
                                    Custom Lead Attributes
                                </label>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={handleAddRow}
                                    className="flex items-center gap-1.5 h-8 text-xs border-dashed"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    Add Attribute Row
                                </Button>
                            </div>
                            <div className="space-y-4 sm:space-y-2.5">
                                {rows.map((row) => (
                                    <div
                                        key={row.id}
                                        className="grid grid-cols-1 sm:flex sm:items-center gap-2 p-3 sm:p-0 bg-secondary-50/50 dark:bg-secondary-800/20 sm:bg-transparent rounded-xl border border-secondary-200 dark:border-secondary-700 sm:border-none"
                                    >
                                        {/* Key Input: Stacks on mobile, takes 35% space on desktop */}
                                        <input
                                            type="text"
                                            value={row.key}
                                            onChange={(e) => handleFieldChange(row.id, "key", e.target.value)}
                                            placeholder="Label (e.g., Nearby Location)"
                                            className="w-full sm:w-[35%] px-3 py-1.5 text-sm border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100 focus:outline-none focus:ring-1 focus:ring-primary-500"
                                        />

                                        {/* Value Input and Delete Button container */}
                                        <div className="flex items-center gap-2 w-full sm:flex-1">
                                            <input
                                                type="text"
                                                value={row.value}
                                                onChange={(e) => handleFieldChange(row.id, "value", e.target.value)}
                                                placeholder="Value (e.g., Hanuman Mandir, 500m away)"
                                                className="flex-1 px-3 py-1.5 text-sm border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100 focus:outline-none focus:ring-1 focus:ring-primary-500"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveRow(row.id)}
                                                className="p-2 text-secondary-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <hr className="border-secondary-100 dark:border-secondary-800" />

                        <div className="flex flex-col space-y-2">
                            <label htmlFor="confirmation-input" className="text-sm font-medium text-secondary-700 dark:text-secondary-300 block">
                                {confirmationText}
                            </label>
                            <input
                                id="confirmation-input"
                                type="text"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                placeholder="Enter the text above"
                                className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100"
                                autoComplete="off"
                            />
                        </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setOpen(false);
                                setUserInput("");
                            }}
                            disabled={isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isConfirmButtonDisabled}
                            className="bg-primary-600 hover:bg-primary-700 text-white"
                        >
                            {isPending ? "Confirming..." : "Confirm"}
                        </Button>
                    </DialogFooter>
                    </form>

                </DialogContent>
            </Dialog>
        </>
    );
}