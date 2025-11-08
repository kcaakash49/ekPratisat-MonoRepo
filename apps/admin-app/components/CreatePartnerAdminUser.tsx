"use client";

import { useCreateUser } from "@repo/query-hook";
import { UserSingUpSchema } from "@repo/validators";
import { useState } from "react";
import { toast } from "sonner";

type UserType = 'admin' | 'partner' | 'staff';

interface PropType {
  userRole : UserType;
}
export default function CreatePartnerAdminUser({userRole} : PropType) {
  const [form, setForm] = useState<UserSingUpSchema>({
    name: "",
    email: "",
    contact: "",
    password: "",
    isVerified: false,
  });

  const { mutate, isPending } = useCreateUser();

  const [documents, setDocuments] = useState<
    { type: string; file: File | null }[]
  >([{ type: "", file: null }]);

  const [profileImage, setProfileImage] = useState<File | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleDocumentChange = (index: number, field: string, value: any) => {
    setDocuments((prev) =>
      prev.map((doc, i) =>
        i === index ? { ...doc, [field]: value } : doc
      )
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
    formData.append("role", userRole); // 👈 important

    if (profileImage) formData.append("profileImage", profileImage);

    documents.forEach((doc, index) => {
      if (doc.type && doc.file) {
        formData.append(`document[${index}][type]`, doc.type);
        formData.append(`document[${index}][image]`, doc.file);
      }
    });

    mutate(formData, {
      onSuccess: (data) => {
        console.log(data);
        if (data.status === 200 && "user" in data) {
          toast.success("User created successfully!");
          setErrors({})
        } else if ("error" in data) {
          setErrors(data.fieldErrors || {});
          toast.error(data.error);
        } else {
          toast.error("Something went wrong");
        }
      }
    })


  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto bg-white shadow-md rounded-2xl p-6 space-y-4"
    >
      <h2 className="text-xl font-semibold text-gray-700">Add Partner</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700">Full Name</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full mt-1 p-2 border rounded-lg"
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full mt-1 p-2 border rounded-lg"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Contact</label>
        <input
          type="text"
          value={form.contact}
          onChange={(e) => setForm({ ...form, contact: e.target.value })}
          className="w-full mt-1 p-2 border rounded-lg"
        />
        {errors.contact && <p className="text-red-500 text-sm">{errors.contact}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full mt-1 p-2 border rounded-lg"
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
      </div>

      {/* Profile Image */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Profile Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setProfileImage(e.target.files?.[0] || null)}
          className="mt-1"
        />
      </div>

      {/* Document Uploads */}
      <div className="space-y-2">
        <h3 className="font-medium text-gray-700">Documents</h3>
        {documents.map((doc, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Document type (e.g. Citizenship)"
              value={doc.type}
              onChange={(e) => handleDocumentChange(i, "type", e.target.value)}
              className="flex-1 p-2 border rounded-lg"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                handleDocumentChange(i, "file", e.target.files?.[0] || null)
              }
            />
            {i > 0 && (
              <button
                type="button"
                onClick={() => removeDocumentField(i)}
                className="text-red-500 text-sm"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addDocumentField}
          className="text-blue-600 text-sm"
        >
          + Add another document
        </button>
      </div>

      {errors.general && <p className="text-red-500 text-sm">{errors.general}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
      >
        {isPending ? "Creating Partner..." : "Create Partner"}
      </button>
    </form>
  );
}
