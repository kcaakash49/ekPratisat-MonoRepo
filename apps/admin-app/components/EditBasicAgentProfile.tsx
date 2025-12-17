"use client";

import { useState, useEffect } from "react";
import FocusTrap from "focus-trap-react";
import { AgentDetailType, editAgentBasicProfileSchema } from "@repo/validators";

interface Props {
  agent: AgentDetailType;
  open: boolean;
  onClose: () => void;
  isLoading?: boolean;
}

export function EditAgentBasicProfileModal({
  agent,
  open,
  onClose,
  isLoading,
}: Props) {
  
  const [name, setName] = useState(agent.name);
  const [contact, setContact] = useState(agent.contact);
  const [secondaryContact, setSecondaryContact] = useState<string | null>(agent.secondContact);
  const [shake, setShake] = useState(false);

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
    if(!isValid) return;
    if (contact !== agent.contact) {
      const question = confirm("Are You Sure");
      console.log(question);

    }
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
    <FocusTrap focusTrapOptions={{ clickOutsideDeactivates: false, escapeDeactivates: false }}>
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
                onChange={(e) => setContact(e.target.value)}
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
                onChange={(e) =>
                  setSecondaryContact(e.target.value.trim() === "" ? null : e.target.value)
                }
                className="w-full rounded-lg border px-3 py-2 dark:bg-secondary-700"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border">
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isValid || isLoading}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50"
              >
                {isLoading ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </FocusTrap>
  );
}
