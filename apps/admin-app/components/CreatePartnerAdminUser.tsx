"use client";

import { useCreateUser } from "@repo/query-hook";
import { UserSingUpSchema } from "@repo/validators";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import Image from "next/image";

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

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      contact: "",
      password: "",
      isVerified: false,
    })
    if (profileImage) URL.revokeObjectURL(profileImage.preview);
    documents.forEach((doc) => doc.preview && URL.revokeObjectURL(doc.preview));
    if (profileImageRef.current) profileImageRef.current.value = "";

    setProfileImage(null);
    setDocuments([{ type: "", file: null }]);
  }
  const { mutate, isPending } = useCreateUser();

  // Profile image with preview
  const [profileImage, setProfileImage] = useState<{ file: File; preview: string } | null>(null);
  const profileImageRef = useRef<HTMLInputElement | null>(null);


  // Documents with optional preview
  const [documents, setDocuments] = useState<
    { type: DocumentType | ""; file: File | null; preview?: string }[]
  >([{ type: "", file: null }]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Clean up blob URLs on unmount
  useEffect(() => {
    return () => {
      if (profileImage) URL.revokeObjectURL(profileImage.preview);
      documents.forEach((doc) => doc.preview && URL.revokeObjectURL(doc.preview));
    };
  }, [documents, profileImage]);

  const handleDocumentChange = (
    index: number,
    field: "type" | "file" | "preview",
    value: string | File | null
  ) => {
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
    if (!profileImage) {
      toast.error("Please provide a profile picture!!!");
      return;
    }

    for (const doc of documents) {
      if (!doc.file) {
        toast.error("Please provide valid ID picture!!!");
        return;
      }
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("contact", form.contact);
    formData.append("password", form.password);
    formData.append("role", userRole);
    formData.append("isVerified", String(form.isVerified));

    if (profileImage) formData.append("profileImage", profileImage.file);

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
          resetForm();
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
    <form onSubmit={handleSubmit} className="shadow-lg rounded-2xl p-8 space-y-6 transition-colors max-w-7xl">
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
            required
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
            required
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
            required
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              setForm({ ...form, contact: value });
            }}
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
            required
            className="w-full mt-1 p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
        </div>

        {/* Verified */}
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
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Profile Image
          </label>
          <div className="flex items-center gap-4">
            <label className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700">
              Upload
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={profileImageRef}
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  if (!file) return;
                  const preview = URL.createObjectURL(file);
                  setProfileImage({ file, preview });
                }}
              />
            </label>

            {profileImage && (
              <div className="relative group">
                <Image
                  src={profileImage.preview}
                  alt="profile-preview"
                  width={80}
                  height={80}
                  className="rounded-full object-cover border w-20 h-20"
                />
                <button
                  type="button"
                  onClick={() => {
                    // if (profileImage) URL.revokeObjectURL(profileImage.preview);
                    setProfileImage(null);
                    if (profileImageRef.current) profileImageRef.current.value = "";
                  }}
                  className="absolute top-0 right-0 bg-black/60 text-white text-xs px-1 rounded opacity-0 group-hover:opacity-100 transition"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
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
                onChange={(e) => handleDocumentChange(i, "type", e.target.value as DocumentType)}
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

              <div className="flex items-center gap-3">
                <label className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700">
                  Upload
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      if (!file) return;
                      const preview = URL.createObjectURL(file);
                      handleDocumentChange(i, "file", file);
                      handleDocumentChange(i, "preview", preview);
                    }}
                  />
                </label>

                {doc.preview && (
                  <div className="relative group">
                    <Image
                      src={doc.preview}
                      alt={`doc-preview-${i}`}
                      width={80}
                      height={80}
                      className="rounded-md object-cover border w-20 h-20"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (doc.preview) URL.revokeObjectURL(doc.preview);
                        handleDocumentChange(i, "file", null);
                        handleDocumentChange(i, "preview", null);
                      }}
                      className="absolute top-0 right-0 bg-black/60 text-white text-xs px-1 rounded opacity-0 group-hover:opacity-100 transition"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

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
