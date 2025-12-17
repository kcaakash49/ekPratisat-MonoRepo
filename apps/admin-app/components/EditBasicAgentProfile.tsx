"use client";

import { useState, useEffect } from "react";
import FocusTrap from "focus-trap-react";
import { AgentDetailType, EditAgentBasicProfileInput, editAgentBasicProfileSchema } from "@repo/validators";
import { ConfirmationModal } from "./ConfirmationModal";
import { useEditBasicInfo } from "@repo/query-hook";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  agent: AgentDetailType;
  open: boolean;
  onClose: () => void;
  
}

export function EditAgentBasicProfileModal({
  agent,
  open,
  onClose,
}: Props) {

  const [name, setName] = useState(agent.name);
  const [contact, setContact] = useState(agent.contact);
  const [secondaryContact, setSecondaryContact] = useState<string | null>(agent.secondContact);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingSubmit, setPendingSubmit] = useState<{
    name: string;
    contact: string;
    secondaryContact: string | null;
    id:string
  } | null>(null);
  const [shake, setShake] = useState(false);

  const { mutate, isPending } = useEditBasicInfo();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (open) {
      setName(agent.name);
      setContact(agent.contact);
      setSecondaryContact(agent.secondContact);
    }
  }, [open, agent]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    const payload: EditAgentBasicProfileInput = { id:agent.id,name, contact, secondaryContact };

    // ⚠️ Primary contact changed → confirm
    if (contact !== agent.contact) {
      setPendingSubmit(payload);
      setShowConfirm(true);
      return;
    }
    mutate(payload, {
      onSuccess: (data) => {
        toast.success(data.message || "Operation Successful !!!");
        queryClient.invalidateQueries({
          queryKey: ["agent-detail", agent.id]
        })
        queryClient.invalidateQueries({
          queryKey:["agents-list"]
        })
        onClose();
      }
    })
  }

  const isValid = editAgentBasicProfileSchema.safeParse({
    id: agent.id,
    name,
    contact,
    secondaryContact,
  }).success;

  const triggerShake = () => {
    const audio = new Audio("/sounds/warning.mp3");
    audio.play().catch((err) => console.log(err));

    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  return (
    <>
      <FocusTrap
        focusTrapOptions={{ clickOutsideDeactivates: false, escapeDeactivates: false }}
        active = {open && !showConfirm}>
        
        {/* Full-screen overlay */}
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay behind modal */}
          <div
            className="absolute inset-0 bg-black/70"
            onClick={triggerShake} // shake trigger
          />

          {/* Modal content */}
          <div
            className={`relative w-full max-w-lg rounded-xl bg-white dark:bg-secondary-800 shadow-lg p-4 m-4
            ${shake ? "animate-shake" : ""}`}
            onClick={(e) => e.stopPropagation()} // prevent shake on modal clicks
          >
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-secondary-800 dark:text-secondary-200">
                Edit Basic Profile
              </h3>
            </div>

            <form
              onSubmit={handleSubmit}
              className="px-6 py-4 space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 dark:bg-secondary-700"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Primary Contact</label>
                <input
                  value={contact}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    setContact(value);
                }}
                  className="w-full rounded-lg border px-3 py-2 dark:bg-secondary-700"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Secondary Contact
                  <span className="text-secondary-400 text-xs ml-1">(optional)</span>
                </label>
                <input
                  value={secondaryContact ?? ""}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    setSecondaryContact(value)
                }}
                  className="w-full rounded-lg border px-3 py-2 dark:bg-secondary-700"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isValid || isPending}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50"
                >
                  {isPending ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </FocusTrap>

      {/* Confirmation modal */}
      <ConfirmationModal
        open={showConfirm}
        title="Change Primary Contact?"
        description="Changing the primary contact may affect login and notifications. Are you sure you want to continue?"
        confirmText="Yes, change it"
        isLoading={isPending}
        onCancel={() => {
          setShowConfirm(false);
          setPendingSubmit(null);
        }}
        onConfirm={() => {
          if (!pendingSubmit) return;
          mutate(pendingSubmit, {
            onSuccess: (data) => {
              toast.success(data.message || "Operation Successful !!!");
              queryClient.invalidateQueries({
                queryKey: ["agent-detail", agent.id]
              })
              queryClient.invalidateQueries({
                queryKey:["agents-list"]
              })
              onClose();
            }
          })
          setShowConfirm(false);
          setPendingSubmit(null);
        }}
      />
    </>
  );
}
