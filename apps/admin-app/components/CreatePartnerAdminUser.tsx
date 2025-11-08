"use client";

import { useCreateUser } from "@repo/query-hook";
import { UserSingUpSchema } from "@repo/validators";
import { useState } from "react";
import { toast } from "sonner";

type UserType = "admin" | "partner" | "staff";

type DocumentType =
  | "CITIZENSHIP_FRONT"
  | "CITIZENSHIP_BACK"
  | "LICENSE"
  | "PAN"
  | "PASSPORT"
  | "OTHER";

const documentTypeOptions: { label: string; value: DocumentType }[] = [
  { label: "Citizenship (Front)", value: "CITIZENSHIP_FRONT" },
  { label: "Citizenship (Back)", value: "CITIZENSHIP_BACK" },
  { label: "License", value: "LICENSE" },
  { label: "PAN", value: "PAN" },
  { label: "Passport", value: "PASSPORT" },
  { label: "Other", value: "OTHER" },
];

interface PropType {
  userRole: UserType;
}

export default function CreatePartnerAdminUser({ userRole }: PropType) {
  const [form, setForm] = useState<UserSingUpSchema>({
    name: "",
    email: "",
    contact: "",
    password: "",
    isVerified: false,
  });

  const { mutate, isPending } = useCreateUser();

  const [documents, setDocuments] = useState<{ type: DocumentType | ""; file: File | null }[]>([
    { type: "", file: null },
  ]);

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleDocumentChange = (index: number, field: string, value: string | File | null) => {
    setDocuments((prev) =>
      prev.map((doc, i) => (i === index ? { ...doc, [field]: value } : doc))
    );
  };

  const addDocumentField = () => {
    setDocuments((prev) => [...prev, { type: "", file: null }]);
  };

  const removeDocumentField = (index: number) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("contact", form.contact);
    formData.append("password", form.password);
    formData.append("role", userRole);
    formData.append("isVerified", String(form.isVerified));

    if (profileImage) formData.append("profileImage", profileImage);

    documents.forEach((doc, index) => {
      if (doc.type && doc.file) {
        formData.append(`document[${index}][type]`, doc.type);
        formData.append(`document[${index}][image]`, doc.file);
      }
    });

    mutate(formData, {
      onSuccess: (data) => {
        if (data.status === 200 && "user" in data) {
          toast.success(`${userRole} user created successfully!`);
          setErrors({});
        } else if ("error" in data) {
          setErrors(data.fieldErrors || {});
          toast.error(data.error);
        } else {
          toast.error("Something went wrong");
        }
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="shadow-lg rounded-2xl p-8 space-y-6 transition-colors"
    >
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
        Create {userRole.charAt(0).toUpperCase() + userRole.slice(1)} User
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Full Name
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full mt-1 p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full mt-1 p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>

        {/* Contact */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Contact
          </label>
          <input
            type="text"
            value={form.contact}
            onChange={(e) => setForm({ ...form, contact: e.target.value })}
            className="w-full mt-1 p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
          />
          {errors.contact && <p className="text-red-500 text-sm">{errors.contact}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Password
          </label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full mt-1 p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
        </div>

        {/* Is Verified */}
        <div className="flex items-center gap-3 mt-2">
          <input
            id="isVerified"
            type="checkbox"
            checked={form.isVerified}
            onChange={(e) => setForm({ ...form, isVerified: e.target.checked })}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="isVerified" className="text-sm text-gray-700 dark:text-gray-300">
            Mark as Verified
          </label>
        </div>

        {/* Profile Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Profile Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProfileImage(e.target.files?.[0] || null)}
            className="mt-1 text-gray-600 dark:text-gray-200"
            required
          />
        </div>
      </div>

      {/* Documents Section */}
      <div className="space-y-3">
        <h3 className="font-medium text-gray-800 dark:text-gray-200">Documents</h3>
        <div className="grid gap-3">
          {documents.map((doc, i) => (
            <div
              key={i}
              className="grid md:grid-cols-3 gap-3 items-center border border-gray-200 dark:border-gray-700 p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
            >
              <select
                value={doc.type}
                onChange={(e) =>
                  handleDocumentChange(i, "type", e.target.value as DocumentType)
                }
                required
                className="p-2 border rounded-lg bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 dark:text-white"
              >
                <option value="">Select Document Type</option>
                {documentTypeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleDocumentChange(i, "file", e.target.files?.[0] || null)
                }
                className="text-gray-600 dark:text-gray-200"
                required
              />

              {i > 0 && (
                <button
                  type="button"
                  onClick={() => removeDocumentField(i)}
                  className="text-red-500 text-sm hover:underline"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addDocumentField}
          className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline"
        >
          + Add another document
        </button>
      </div>

      {errors.general && <p className="text-red-500 text-sm">{errors.general}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2.5 rounded-lg font-medium transition"
      >
        {isPending ? `Creating ${userRole}...` : `Create ${userRole}`}
      </button>
    </form>
  );
}
