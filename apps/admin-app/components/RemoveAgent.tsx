"use client";

import { useState } from "react";
import { Undo } from "lucide-react";
import { toast } from "sonner";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@repo/ui/dialog";
import { Button } from "@repo/ui/button";
import { useDeactivateAgent } from "@repo/query-hook";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

interface Props {
    agentId: string;
}

const generateConfirmationText = () => {
    const words = ["verify", "confirm", "proceed", "continue", "accept", "approve"];
    const randomWord = words[Math.floor(Math.random() * words.length)];
    return `Type "${randomWord}" to verify`;
};

export default function RemoveUser({ agentId }: Props) {
    const [open, setOpen] = useState(false);
    const [confirmationText, setConfirmationText] = useState("");
    const [userInput, setUserInput] = useState("");
    const { mutate: deActivateAgent, isPending } = useDeactivateAgent();
    const queryClient = useQueryClient();
    const router = useRouter();

    const handleOpenDialog = () => {
        setOpen(true);
        setConfirmationText(generateConfirmationText());
        setUserInput("");
    };

    const handleVerify = () => {
        const expectedText = confirmationText.replace('Type "', '').replace('" to verify', '');

        if (userInput.trim().toLowerCase() !== expectedText.toLowerCase()) {
            toast.error("Confirmation text doesn't match. Please try again.");
            return;
        }

        deActivateAgent({ agentId }, {
            onSuccess: () => {
                toast.success("Operation Successful!!!!");
                setOpen(false);
                setUserInput("");
                queryClient.invalidateQueries({
                    queryKey: ["all-users"]
                });
                queryClient.invalidateQueries({
                    queryKey: ["agent-detail", agentId]
                })
                router.replace("/admin/users");
            },
            onError: () => {
                setUserInput("");
            }
        });
    };

    const isConfirmButtonDisabled = isPending || userInput.trim() === "";

    return (
        <>
            <button
                onClick={handleOpenDialog}
                className="w-full flex items-center gap-3 p-3 text-left hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors group text-red-600 dark:text-red-400"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <div>
                    <div className="font-medium">Remove User</div>
                    <div className="text-sm">Permanently delete user account</div>
                </div>
            </button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent onClose={() => setOpen(false)} className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Deactivate Account</DialogTitle>
                    </DialogHeader>

                    {/* FIX: Use proper grid/flex layout */}
                    <div className="space-y-4">
                        <p className="text-secondary-600 dark:text-secondary-300 text-sm break-words whitespace-normal">
                            Are you sure you want to deactivate this account? This action cannot be undone.
                        </p>

                        {/* Confirmation Challenge - Stack vertically */}
                        <div className="flex flex-col space-y-3">
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