"use client";

import { useCreateUser } from "@repo/query-hook";

import { Button } from "@repo/ui/button";
import ButtonLoader from "@repo/ui/buttonLoader";
import { UserSingUpSchema } from "@repo/validators";

import { useState } from "react";

type UserRole = "admin" | "client" | "partner";

export default function SignupPage() {
  const [form, setForm] = useState<UserSingUpSchema>({
    name: "",
    contact: "",
    email: "",
    password: "",
    role: "client" as UserRole,
  });

  const signupMutation = useCreateUser();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signupMutation.mutate(form);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4">
      <form
        onSubmit={handleSubmit}
        className="
          w-full                /* take full width on small screens */
          sm:max-w-md           /* from sm breakpoint, limit width */
          md:max-w-lg
          lg:max-w-xl
          bg-white dark:bg-gray-800 
          shadow-lg rounded-none sm:rounded-2xl 
          px-6 sm:px-10 py-8 sm:py-12
          border border-gray-200 dark:border-gray-700
        "
      >
        <h2 className="text-2xl sm:text-3xl font-extrabold text-center">
          Welcome to{" "}
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            EkPratisat
          </span>
        </h2>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-6 text-sm sm:text-base">
          Join us and start your journey 🚀
        </p>

        <div className="space-y-4">
          <InputField label="Full Name" name="name" value={form.name} onChange={handleChange} required />
          <InputField label="Contact" name="contact" value={form.contact} onChange={handleChange} required />
          <InputField label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
          <InputField label="Password" name="password" type="password" value={form.password} onChange={handleChange} required />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Role
            </label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="client">Client</option>
              <option value="partner">Partner</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        <Button
          className="mt-6 w-full rounded-lg py-3 font-medium shadow-md hover:shadow-lg transition disabled:opacity-70"
          variant="destructive"
          type="submit"
          disabled={signupMutation.isPending}
        >
          {signupMutation.isPending ? <ButtonLoader/> : "Sign Up"}
        </Button>

        <p className="mt-4 text-sm sm:text-base text-center text-gray-500 dark:text-gray-400">
          Already have an account?{" "}
          <a href="/login" className="text-indigo-600 hover:underline dark:text-indigo-400">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

function InputField({ label, ...props }: InputFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <input
        {...props}
        className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
      />
    </div>
  );
}
