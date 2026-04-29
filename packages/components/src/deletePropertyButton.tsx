"use client";

import { useDeleteProperty } from "@repo/query-hook";
import { Button } from "@repo/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@repo/ui/dialog";
import { useQueryClient } from "@tanstack/react-query";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
    id: string;
    isActive: boolean;
}

const generateConfirmationText = () => {
    const words = ["verify", "confirm", "proceed", "continue", "accept", "approve"];
    const randomWord = words[Math.floor(Math.random() * words.length)];
    return `Type "${randomWord}" to verify`;
};


export default function DeletePropertyButton({ id, isActive }: Props) {
    const [open, setOpen] = useState(false);
    const [confirmationText, setConfirmationText] = useState("");
    const [userInput, setUserInput] = useState("");
    const { mutate, isPending } = useDeleteProperty();
    const queryClient = useQueryClient();
    const router = useRouter();

    const handleDeleteDialog = () => {
        setOpen(true);
        setConfirmationText(generateConfirmationText());
        setUserInput("");
    }

    const handleDelete = () => {
        const expectedText = confirmationText.replace('Type "', '').replace('" to verify', '');

        if (userInput.trim().toLowerCase() !== expectedText.toLowerCase()) {
            toast.error("Confirmation text doesn't match. Please try again.");
            return;
        }

        if(isActive){
            toast.error("Property is still active, please deactivate before deleting!!!");
            setOpen(false);
            setUserInput("");
            return;
        }

        mutate({id}, {
            onSuccess: (data) => {
                toast.success(data.message || "Operation Successful!!!");
                queryClient.invalidateQueries({
                    queryKey: ["property-detail", id]
                })
                queryClient.invalidateQueries({
                    queryKey: ["all-properties"]
                });
                setOpen(false);
                setUserInput("");
                router.replace("/admin/properties");
            },
            onError: () => {
                setUserInput("");
            }
        })


    }

    const isConfirmButtonDisabled = isPending || userInput.trim() === "";
    return (
        <>
            <button className="p-2 text-secondary-600 hover:bg-secondary-100 dark:hover:bg-secondary-800 rounded-lg transition-colors" onClick={handleDeleteDialog}>
                <Trash size={20} />
            </button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent onClose={() => setOpen(false)} className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Delete Property?</DialogTitle>
                    </DialogHeader>

                    {/* FIX: Use proper grid/flex layout */}
                    <div className="space-y-4">
                        <p className="text-secondary-600 dark:text-secondary-300 text-sm break-words whitespace-normal">
                            Are you sure you want to delete this property? This action cannot be undone.
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
                            onClick={handleDelete}
                            disabled={isConfirmButtonDisabled}
                            className="bg-primary-600 hover:bg-primary-700 text-white"
                        >
                            {isPending ? "Deleting........" : "Delete"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>


    )
}