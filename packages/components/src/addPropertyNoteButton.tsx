"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@repo/ui/dialog";
import { Button } from "@repo/ui/button";

import { useQueryClient } from "@tanstack/react-query";
import { useAddPropertyOwnerInfo } from "@repo/query-hook";

interface Props {
   propertyId: string;
   leadNotes: Record<string, any> | null | any;
}

// Representing each row of dynamic user input
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

export default function AddPropertyNoteButton({ propertyId, leadNotes }: Props) {
    const [open, setOpen] = useState(false);
    const [confirmationText, setConfirmationText] = useState("");
    const [userInput, setUserInput] = useState("");
    
    // Manage fields as an array of rows for easy adding/removing in UI
    const [rows, setRows] = useState<KeyValueRow[]>([
        { id: "1", key: "", value: "" }
    ]);
    
    const { mutate: addPropertyOwnerInfo, isPending } = useAddPropertyOwnerInfo();
    const queryClient = useQueryClient();

    const handleOpenDialog = () => {
        setOpen(true);
        setConfirmationText(generateConfirmationText());
        setUserInput("");
        setRows([{ id: Math.random().toString(), key: "", value: "" }]);
    };

    // UI Row Operations
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

    const handleVerify = () => {
        // 1. Filter out empty fields and construct raw JSON object
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

        if (Object.keys(finalNoteObject).length === 0) {
            toast.error("Please add at least one dynamic info note.");
            return;
        }

        // 2. Validate Security Captcha Text
        const expectedText = confirmationText.replace('Type "', '').replace('" to verify', '');
        if (userInput.trim().toLowerCase() !== expectedText.toLowerCase()) {
            toast.error("Confirmation text doesn't match. Please try again.");
            return;
        }

        // 3. Trigger Mutation with constructed object payload
        addPropertyOwnerInfo({ propertyId, note: finalNoteObject }, {
            onSuccess: () => {
                toast.success("Lead notes added successfully!");
                setOpen(false);
                setUserInput("");
                setRows([{ id: "1", key: "", value: "" }]);
                queryClient.invalidateQueries({
                    queryKey: ["property-detail", propertyId]
                });
            },
        });
    };

    const isConfirmButtonDisabled = isPending || userInput.trim() === "";

    return (
        <>
            <button
                onClick={handleOpenDialog}
                className="w-full flex items-center gap-3 p-3 text-left hover:bg-emerald-50 dark:hover:bg-emerald-900/10 rounded-lg transition-colors group text-emerald-600 dark:text-emerald-400"
            >
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                    />
                </svg>
                <div>
                    <div className="font-medium">Add Property Lead Info</div>
                    <div className="text-sm text-secondary-500">Record off-market owner parameters</div>
                </div>
            </button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent onClose={() => setOpen(false)} className="max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Add Property Owner Lead Info</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-1">
                        <p className="text-secondary-600 dark:text-secondary-300 text-sm">
                            Capture unstructured physical acquisition data collected by agents on the field.
                        </p>

                        {/* Dynamic Field Row Array Maker */}
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

                            <div className="space-y-2.5">
                                {rows.map((row) => (
                                    <div key={row.id} className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={row.key}
                                            onChange={(e) => handleFieldChange(row.id, "key", e.target.value)}
                                            placeholder="Label (e.g., Owner Name)"
                                            className="w-2/5 px-3 py-1.5 text-sm border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100 focus:outline-none focus:ring-1 focus:ring-primary-500"
                                        />
                                        <input
                                            type="text"
                                            value={row.value}
                                            onChange={(e) => handleFieldChange(row.id, "value", e.target.value)}
                                            placeholder="Value (e.g., Hari Prasad)"
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
                                ))}
                            </div>
                        </div>

                        <hr className="border-secondary-100 dark:border-secondary-800" />

                        {/* Confirmation Challenge Container */}
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
                            onClick={handleVerify}
                            disabled={isConfirmButtonDisabled}
                            className="bg-primary-600 hover:bg-primary-700 text-white"
                        >
                            {isPending ? "Confirming..." : "Confirm Info"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}