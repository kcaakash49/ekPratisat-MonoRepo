

"use client";

import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Lock, Phone, Eye, EyeOff } from "lucide-react";
import { Button } from "@repo/ui/button";
import Link from "next/link";
import { useSignInUser } from "@repo/query-hook";

type SignInError = {
  contact?: string;
  password?: string;
};

export default function SignInForm() {
  const [form, setForm] = useState({ contact: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const signinMutation = useSignInUser();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signinMutation.mutate(form , {
      onSuccess: (data) => {
        if (data?.ok){
          toast.success("Login Successful!!!");
          router.replace("/");
        }else if (data?.error){
          toast.error(data.error || "Something Happened");
        }else {
          toast.error("Unexpected Error")
        }
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl px-8 pt-6 pb-6 w-full max-w-md"
    >
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 text-center pb-10">
        Welcome to{" "}
        <span className="text-red-600 dark:text-red-400">
          <Link href="/">EkPratisat</Link>
        </span>
      </h2>

      {/* Contact */}
      <label className="block mb-4">
        <span className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <Phone size={18} /> Contact
        </span>
        <input
          type="tel"
          name="contact"
          value={form.contact}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "");
            setForm({ ...form, contact: value });
        }}
          inputMode="numeric"
          className="mt-1 block w-full border rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
          required
        />
      </label>

      {/* Password */}
      <label className="block mb-4">
        <span className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <Lock size={18} /> Password
        </span>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={form.password}
            onChange={handleChange}
            className="mt-1 block w-full border rounded px-3 py-2 pr-10 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </label>

      {/* Submit */}
      <Button
        className="w-full"
        variant="destructive"
        type="submit"
        disabled = {signinMutation.isPending}
      >
        {
          signinMutation.isPending ? "Signing in...." : "Sign In"
        }
      </Button>
    </form>
  );
}

function FieldError({ message }: { message: string }) {
  return (
    <p className="text-red-600 text-sm mt-1 dark:text-red-400">
      **{message}
    </p>
  );
}
