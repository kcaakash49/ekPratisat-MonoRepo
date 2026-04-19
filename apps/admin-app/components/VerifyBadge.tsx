"use client";

import { useState } from "react";
import { Undo } from "lucide-react";
import { toast } from "sonner";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@repo/ui/dialog";
import { Button } from "@repo/ui/button";
import { useVerifyAgent } from "@repo/query-hook";
import { useQueryClient } from "@tanstack/react-query";

interface VerifyBadgeProps {
  userId: string;
  isVerified: boolean;
}

const generateConfirmationText = () => {
  const words = ["verify", "confirm", "proceed", "continue", "accept", "approve"];
  const randomWord = words[Math.floor(Math.random() * words.length)];
  return `Type "${randomWord}" to verify`;
};

export default function VerifyBadge({ userId, isVerified }: VerifyBadgeProps) {
  const [open, setOpen] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const [userInput, setUserInput] = useState("");
  const { mutate: verifyAgent, isPending } = useVerifyAgent();
  const queryClient = useQueryClient();

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

    verifyAgent({userId,isVerified}, {
      onSuccess: () => {
        toast.success("Operation Successful!!!!");
        setOpen(false);
        queryClient.invalidateQueries({
          queryKey: ["all-users"]
        });
        queryClient.invalidateQueries({
          queryKey: ["agent-detail", userId]
        })
        setUserInput("");
      },
      onError: () => {
        setUserInput("");
      }
    });
  };

  const isConfirmButtonDisabled = isPending || userInput.trim() === "";

  return (
    <>
    {
      isVerified ? (
        <button  className="w-full flex items-center gap-3 p-3 text-left hover:bg-primary-200 dark:hover:bg-secondary-700 rounded-lg transition-colors group" onClick={handleOpenDialog}>
        <Undo size={20} color="red"/>
        <div>
          <div className="font-medium text-secondary-700 dark:text-secondary-300">
            Revoke Verification
          </div>
          <div className="text-sm text-secondary-500 dark:text-secondary-400">
            Remove verification status
          </div>

        </div>
      </button>
      ): (
         <button
        onClick={handleOpenDialog}
        className="w-full flex items-center gap-3 p-3 text-left hover:bg-primary-200 dark:hover:bg-secondary-700 rounded-lg transition-colors group"
      >
         <svg className="w-5 h-5 text-yellow-500 group-hover:text-yellow-600 dark:group-hover:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <div className="font-medium text-secondary-700 dark:text-secondary-300">
            Verify Agent
          </div>
          <div className="text-sm text-secondary-500 dark:text-secondary-400">
            Mark Agent as verified
          </div>

        </div>
      </button>
      )
    }

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent onClose={() => setOpen(false)} className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Verify User</DialogTitle>
          </DialogHeader>

          {/* FIX: Use proper grid/flex layout */}
          <div className="space-y-4">
            <p className="text-secondary-600 dark:text-secondary-300 text-sm break-words whitespace-normal">
              Are you sure you want to {isVerified ? "revoke verification for" : "verify"} this user? This action cannot be undone.
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