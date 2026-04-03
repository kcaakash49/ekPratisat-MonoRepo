"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@repo/ui/dialog"; // adjust path

export default function DeleteZoneModal({
  open,
  onClose,
  zone,
  onConfirm,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  zone: { id: string; name: string };
  onConfirm: () => void;
  loading: boolean;
}) {
  const [input, setInput] = useState("");

  const expected = `DELETE ${zone.name}`;
  const isValid = input === expected;

  useEffect(() => {
  if (open) setInput("");
}, [open]);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent onClose={onClose}>
        <DialogHeader>
          <DialogTitle>
            Delete Zone
          </DialogTitle>
        </DialogHeader>

        <p className="text-sm text-gray-600">
          This action cannot be undone.
        </p>

        <p className="text-sm">
          Type{" "}
          <span className="font-semibold">{expected}</span>{" "}
          to confirm.
        </p>

        <input
          className="border p-2 rounded w-full"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <DialogFooter>
          <button
            className="px-3 py-2 border rounded"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            disabled={!isValid || loading}
            className="px-3 py-2 bg-red-600 text-white rounded disabled:opacity-50"
            onClick={onConfirm}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}