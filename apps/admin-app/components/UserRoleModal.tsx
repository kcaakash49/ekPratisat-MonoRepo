"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@repo/ui/dialog";
import { Button } from "@repo/ui/button";

import { useQueryClient } from "@tanstack/react-query";
import { useChangeUserRole } from "@repo/query-hook";

interface Props {
    agentId: string;
    role: string;
}

type UserRole = "client" | "partner" | "staff";

const generateConfirmationText = () => {
    const words = ["verify", "confirm", "proceed", "continue", "accept", "approve"];
    const randomWord = words[Math.floor(Math.random() * words.length)];
    return `Type "${randomWord}" to verify`;
};

export default function UserRoleModal({ agentId, role }: Props) {
    const [open, setOpen] = useState(false);
    const [confirmationText, setConfirmationText] = useState("");
    const [newRole, setNewRole] = useState<UserRole>(role as UserRole);
    const [userInput, setUserInput] = useState("");
    const { mutate: changeUserRole, isPending } = useChangeUserRole();
    const queryClient = useQueryClient();

    const handleOpenDialog = () => {
        setOpen(true);
        setConfirmationText(generateConfirmationText());
        setUserInput("");
        setNewRole(role as UserRole); // Reset dropdown to the user's current role on open
    };

    const handleVerify = () => {
        
        const expectedText = confirmationText.replace('Type "', '').replace('" to verify', '');

        if (userInput.trim().toLowerCase() !== expectedText.toLowerCase()) {
            toast.error("Confirmation text doesn't match. Please try again.");
            return;
        }

        if (newRole === role) {
            toast.error("Selected role is the same as the current role. Please choose a different role.");
            return;
        }

        changeUserRole({ userId: agentId, role: newRole }, {
            onSuccess: () => {
                toast.success("Operation Successful!!!!");
                setOpen(false);
                setUserInput("");
                queryClient.invalidateQueries({
                    queryKey: ["all-users"]
                });
                queryClient.invalidateQueries({
                    queryKey: ["agent-detail", agentId]
                });
            },
        });
    };

    const isConfirmButtonDisabled = isPending || userInput.trim() === "";

    // Available roles to loop through in our dropdown
    const availableRoles: { value: UserRole; label: string }[] = [
        { value: "client", label: "Client" },
        { value: "partner", label: "Partner" },
        { value: "staff", label: "Staff" },
    ];

    return (
        <>
            <button
                onClick={handleOpenDialog}
                className="w-full flex items-center gap-3 p-3 text-left hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors group text-green-600 dark:text-green-400"
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
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.586-9.414a2 2 0 112.828 2.828L12 14l-4 1 1-4 8.414-8.414z"
                    />
                </svg>
                <div>
                    <div className="font-medium">Change User Role</div>
                    <div className="text-sm">Update the user's role and permissions</div>
                </div>
            </button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent onClose={() => setOpen(false)} className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Change User Role</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-5">
                        <p className="text-secondary-600 dark:text-secondary-300 text-sm break-words whitespace-normal">
                            Select the new role you want to assign to this user. This action requires safety confirmation.
                        </p>

                        {/* Dropdown Section */}
                        <div className="flex flex-col space-y-2">
                            <label htmlFor="role-select" className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                                Select New Role
                            </label>
                            <select
                                id="role-select"
                                value={newRole}
                                onChange={(e) => setNewRole(e.target.value as UserRole)}
                                disabled={isPending}
                                className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100"
                            >
                                {availableRoles.map((roleOpt) => (
                                    <option key={roleOpt.value} value={roleOpt.value}>
                                        {roleOpt.label}
                                    </option>
                                ))}
                            </select>
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