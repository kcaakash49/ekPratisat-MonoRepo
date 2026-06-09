
"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@repo/ui/dialog";
import { Button } from "@repo/ui/button";

import { useQueryClient } from "@tanstack/react-query";
import { useUpdateFollowUpTime } from "@repo/query-hook";
import { Calendar } from "lucide-react";

interface Props {
    followUpAt: string | null;
    id: string;
    status:string;
}


const generateConfirmationText = () => {
    const words = ["verify", "confirm", "proceed", "continue", "accept", "approve"];
    const randomWord = words[Math.floor(Math.random() * words.length)];
    return `Type "${randomWord}" to verify`;
};

export default function UpdateFollowUpTime({ followUpAt, id, status }: Props) {
    console.log("Follow-up",followUpAt)
    const [open, setOpen] = useState(false);
    const [confirmationText, setConfirmationText] = useState("");
    const [followUp, setFollowUp] = useState<Date | null>(
        followUpAt ? new Date(followUpAt) : null
    );
    const [userInput, setUserInput] = useState("");
    const { mutate, isPending } = useUpdateFollowUpTime(id);
    const queryClient = useQueryClient();

    const handleOpenDialog = () => {
        setOpen(true);
        setConfirmationText(generateConfirmationText());
        setUserInput("");
        setFollowUp(followUpAt ? new Date(followUpAt) : null);
    };

    const handleVerify = () => {

        const expectedText = confirmationText.replace('Type "', '').replace('" to verify', '');

        if (userInput.trim().toLowerCase() !== expectedText.toLowerCase()) {
            toast.error("Confirmation text doesn't match. Please try again.");
            return;
        }

        if (!followUp) {
            toast.error("Please update follow-up time!!!");
            return;
        }

        mutate({ followUpAt: followUp }, {
            onSuccess: (data) => {
                toast.success(data.message || "Operation Successful!!!");
                queryClient.invalidateQueries({
                    queryKey: ["lead-detail", id]
                });
                queryClient.invalidateQueries({
                    queryKey: ["leads"]
                });
                setOpen(false);
            }
        })
    };

    const isConfirmButtonDisabled = isPending || userInput.trim() === "";
    const disabledCondition = status === "WON" || status === "LOST";


    return (
        <>
            <button onClick={handleOpenDialog} className={`inline-flex items-center gap-1.5 px-3 py-2 border border-secondary-200 dark:border-secondary-800 hover:bg-secondary-50 dark:hover:bg-secondary-800 rounded-xl text-xs font-semibold text-secondary-700 dark:text-secondary-300 transition-colors ${disabledCondition ? "cursor-not-allowed":"cursor-pointer"}`} disabled={disabledCondition}>
                <Calendar className="w-3.5 h-3.5 text-secondary-400" />
                <span>Follow-up Timer</span>
            </button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent onClose={() => setOpen(false)} className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Change Follow-up Time</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-5">
                        <p className="text-secondary-600 dark:text-secondary-300 text-sm break-words whitespace-normal">
                            Use this to update follow-up date and time. This action requires safety confirmation.
                        </p>

                        {/* Dropdown Section */}
                        <div className="flex flex-col space-y-2">
                            <label htmlFor="followUpAt" className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                                Follow Up Date & Time <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="datetime-local"
                                id="followUp"
                                min={new Date().toISOString().slice(0, 16)}
                                className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100"
                                // Convert the string from the picker into a valid JS Date object for your state
                                onChange={(e) => setFollowUp(e.target.value ? new Date(e.target.value) : null)}
                            />

                        </div>

                        {/* Confirmation Challenge - Stacked vertically */}
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
                            {isPending ? "Confirming......." : "Confirm"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}