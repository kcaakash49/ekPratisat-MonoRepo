"use client";

import { useState } from "react";
import { AgentDetailType, editAgentBasicProfileSchema } from "@repo/validators";


interface Props {
  agent: AgentDetailType;
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    contact: string;
    secondaryContact: string | null;
  }) => void;
  isLoading?: boolean;
}

export function EditAgentBasicProfileModal({
  agent,
  open,
  onClose,
  onSubmit
}: Props) {
  const [name, setName] = useState(agent.name);
  const [contact, setContact] = useState(agent.contact);
  const [secondaryContact, setSecondaryContact] = useState<string | null>(
    null
  );

  if (!open) return null;

  const isValid = editAgentBasicProfileSchema.safeParse({
    id: agent.id,
    name,
    contact,
    secondaryContact,
  }).success;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white dark:bg-secondary-800 shadow-lg">
        {/* Header */}
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-secondary-800 dark:text-secondary-200">
            Edit Basic Profile
          </h3>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!isValid) return;

            onSubmit({
              name,
              contact,
              secondaryContact,
            });
          }}
          className="px-6 py-4 space-y-4"
        >
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Full Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 dark:bg-secondary-700"
              required
            />
          </div>

          {/* Primary Contact */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Primary Contact
            </label>
            <input
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="w-full rounded-lg border px-3 py-2  dark:bg-secondary-700"
              required
            />
          </div>

          {/* Secondary Contact */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Secondary Contact
              <span className="text-secondary-400 text-xs ml-1">
                (optional)
              </span>
            </label>
            <input
              value={secondaryContact ?? ""}
              onChange={(e) =>
                setSecondaryContact(
                  e.target.value.trim() === ""
                    ? null
                    : e.target.value
                )
              }
              className="w-full rounded-lg border px-3 py-2  dark:bg-secondary-700"
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!isValid}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
