"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@repo/ui/dialog";
import { Button } from "@repo/ui/button";

import { useQueryClient } from "@tanstack/react-query";
import { useChangeUserRole, useUpdateleadStatus } from "@repo/query-hook";
import { LeadDetailType, LeadStatus } from "@repo/validators";
import { RefreshCw } from "lucide-react";

interface UpdateStatusProps {
    status: string;
    remarks?: string;
    followUpAt?: Date;
}

interface FormProps {
    status: string;
    remarks: string;
    followUpAt: Date | null;
}

const generateConfirmationText = () => {
    const words = ["verify", "confirm", "proceed", "continue", "accept", "approve"];
    const randomWord = words[Math.floor(Math.random() * words.length)];
    return `Type "${randomWord}" to verify`;
};

export default function LeadStatusUpdate({ lead }: { lead: LeadDetailType }) {
    const [open, setOpen] = useState(false);
    const [confirmationText, setConfirmationText] = useState("");
    const [error, setError] = useState<any>({});
    const [form, setForm] = useState<FormProps>({
        status: lead.status,
        followUpAt: null,
        remarks: ""
    })

    const [userInput, setUserInput] = useState("");
    const { mutate, isPending } = useUpdateleadStatus(lead.id);
    const queryClient = useQueryClient();

    const handleOpenDialog = () => {
        setOpen(true);
        setConfirmationText(generateConfirmationText());
        setUserInput("");
        setForm({
            status: lead.status,
            remarks: "",
            followUpAt: null
        })
        setError({})
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        if (name === "followUpAt") {

            setForm(prev => ({
                ...prev,
                [name]: value ? new Date(value) : null
            }))
            return;
        }

        if (name === "status") {
            setError((prev: any) => ({
                ...prev,
                [name]: ""
            }))
            setForm({
                status: value,
                remarks: "",
                followUpAt: null
            });
            return;
        }

        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleVerify = (e: React.FormEvent) => {
        e.preventDefault();
        const expectedText = confirmationText.replace('Type "', '').replace('" to verify', '');

        if (userInput.trim().toLowerCase() !== expectedText.toLowerCase()) {
            toast.error("Confirmation text doesn't match. Please try again.");
            return;
        }

        if (form.status === lead.status) {
            setError((prev: any) => ({
                ...prev,
                status: "You haven't changed to new status!!!"
            }))
            return;
        }

        const payload = Object.fromEntries(
            Object.entries(form).filter(([key, value]) => {
                if (key === "remarks") return value !== "";
                if (key === "followUpAt") return value !== null;
                return true;
            })
        );


        mutate(payload, {
            onSuccess: (data) => {
                toast.success(data.message || "Operation Successful!!!");
                queryClient.invalidateQueries({
                    queryKey: ["lead-detail", lead.id]
                });
                queryClient.invalidateQueries({
                    queryKey: ["leads"]
                });
                queryClient.invalidateQueries({
                    queryKey: ["user-leads"]
                })
                queryClient.invalidateQueries({
                    queryKey: ["followups-today"]
                })

                setOpen(false);
            }
        })

    };

    const isConfirmButtonDisabled = isPending || userInput.trim() === "";

    const toDateTimeLocal = (date: Date | null) => {
        if (!date) return "";

        const pad = (n: number) => String(n).padStart(2, "0");

        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
    };

    // Available roles to loop through in our dropdown
    const availableStatus: { value: LeadStatus; label: string }[] = [
        { value: "CONTACTED", label: "CONTACTED" },
        { value: "INTERESTED", label: "INTERESTED" },
        { value: "NOT_INTERESTED", label: "NOT INTERESTED" },
        { value: "FOLLOW_UP", label: "FOLLOW UP" },
        { value: "IN_PROGRESS", label: "IN PROGRESS" },
        { value: "IN_NEGOTIATION", label: "IN NEGOTIATION" },
        { value: "WON", label: "WON" },
        { value: "LOST", label: "LOST" },
    ];

    const disabledCondition = lead.status === "WON" || lead.status === "LOST";

    return (
        <>
            <button type="button" onClick={handleOpenDialog} className={`inline-flex items-center gap-1.5 px-3 py-2 border border-secondary-200 dark:border-secondary-800 hover:bg-secondary-50 dark:hover:bg-secondary-800 rounded-xl text-xs font-semibold text-secondary-700 dark:text-secondary-300 transition-colors ${disabledCondition ? "cursor-not-allowed" : "cursor-pointer"}`} disabled={disabledCondition}>
                <RefreshCw className="w-3.5 h-3.5 text-secondary-400" />
                <span>Update Status</span>
            </button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent onClose={() => setOpen(false)} className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Change Lead Status</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-5">
                        <p className="text-secondary-600 dark:text-secondary-300 text-sm break-words whitespace-normal">
                            Select the new status you want to assign to this lead. This action requires safety confirmation.
                        </p>

                        {/* Dropdown Section */}
                        <form onSubmit={handleVerify} className="flex flex-col space-y-2">
                            <label htmlFor="status-select" className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                                Select New Status
                            </label>
                            <select
                                id="status-select"
                                value={form.status}
                                name="status"
                                onChange={handleChange}
                                disabled={isPending}
                                className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100"
                            >
                                <option value="">All status</option>
                                {availableStatus.map((statusOpt) => (
                                    <option key={statusOpt.value} value={statusOpt.value}>
                                        {statusOpt.label}
                                    </option>
                                ))}
                            </select>
                            {error.status && <DisplayErrorMessage text={error.status} />}
                            {
                                (form.status === "WON" || form.status === "LOST") && (
                                    <div className="flex flex-col space-y-2">
                                        <label htmlFor="remarks" className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                                            Remarks <span className="text-red-500">*</span>
                                        </label>
                                        <textarea name="remarks" required className="w-full px-3 py-2  border  border-secondary-300 dark:border-secondary-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100" placeholder="This closes our lead, so give remarks" onChange={handleChange} />
                                        {error.remarks && <DisplayErrorMessage text={error.remarks} />}

                                    </div>
                                )
                            }
                            {(form.status !== "WON" && form.status !== "LOST") &&
                                <div className="flex flex-col space-y-2">
                                    <label htmlFor="followUpAt" className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                                        Follow Up Date & Time <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="datetime-local"
                                        name="followUpAt"
                                        value={toDateTimeLocal(form.followUpAt)}
                                        min={toDateTimeLocal(new Date())}
                                        required
                                        className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100"
                                        onChange={handleChange}
                                    />
                                    {error.followUpAt && <DisplayErrorMessage text={error.followUpAt} />}
                                </div>

                            }
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
                                    className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100"
                                    autoComplete="off"
                                />
                            </div>
                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setForm({
                                            remarks: "",
                                            followUpAt: null,
                                            status: lead.status
                                        });
                                        setOpen(false);
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
                                    {isPending ? "Confirming......." : "Confirm"}
                                </Button>
                            </DialogFooter>

                        </form>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}


function DisplayErrorMessage({ text }: { text: string }) {
    return (
        <span className="text-xs text-red-500 text-center">**{text}**</span>
    )
}