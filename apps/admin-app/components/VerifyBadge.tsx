"use client";

import { useState } from "react";
import { Check, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@repo/ui/dialog";
import { Button } from "@repo/ui/button";
import { useVerifyAgent } from "@repo/query-hook";

interface VerifyBadgeProps {
  userId: string;
  isVerified: boolean;
}

export function VerifyBadge({ userId, isVerified }: VerifyBadgeProps) {
  const [open, setOpen] = useState(false);
  const { mutate: verifyAgent, isPending } = useVerifyAgent();

  const handleVerify = () => {
    verifyAgent(userId, {
      onSuccess: () => {
        toast.success("User verified successfully!");
        setOpen(false);
      }
    });
  };

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
      {/* Button when user not verified */}
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs sm:text-sm font-medium bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200 hover:bg-red-200 transition"
      >
        <ShieldAlert className="w-3 h-3" strokeWidth={3} />
        Not Verified
      </button>

      {/* Dialog for confirmation */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent onClose={() => setOpen(false)}>
          <DialogHeader>
            <DialogTitle>Verify User</DialogTitle>
          </DialogHeader>

          {/* FIX: Add proper text wrapping classes here */}
          <p className="text-secondary-600 dark:text-secondary-300 text-sm break-words whitespace-normal max-w-full">
            Are you sure you want to verify this user? This action cannot be undone.
          </p>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleVerify}
              disabled={isPending}
              className="bg-primary-600 hover:bg-primary-700 text-white"
            >
              {isPending ? "Verifying..." : "Verify"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}