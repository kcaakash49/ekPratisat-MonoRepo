"use client";

import { useState } from "react";
import { Check, ShieldAlert } from "lucide-react";
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

    verifyAgent(userId, {
      onSuccess: () => {
        toast.success("User verified successfully!");
        setOpen(false);
        queryClient.invalidateQueries({
            queryKey: ["agents-list"]
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

  if (isVerified) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs sm:text-sm font-medium bg-primary-100 text-primary-700 dark:bg-primary-dark-500 dark:text-primary-200">
        <Check className="w-3 h-3" strokeWidth={3} />
        Verified
      </span>
    );
  }

  return (
    <>
      <button
        onClick={handleOpenDialog}
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs sm:text-sm font-medium bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200 hover:bg-red-200 transition"
      >
        <ShieldAlert className="w-3 h-3" strokeWidth={3} />
        Not Verified
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent onClose={() => setOpen(false)} className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Verify User</DialogTitle>
          </DialogHeader>

          {/* FIX: Use proper grid/flex layout */}
          <div className="space-y-4">
            <p className="text-secondary-600 dark:text-secondary-300 text-sm break-words whitespace-normal">
              Are you sure you want to verify this user? This action cannot be undone.
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
              {isPending ? "Verifying..." : "Confirm Verify"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}