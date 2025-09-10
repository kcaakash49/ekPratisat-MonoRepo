"use client";

import { useState } from "react";
import { useCreateUser } from "@repo/query-hook";
import { UserSingUpSchema } from "@repo/validators";
import { Button } from "@repo/ui/button";
import AnimateLoader from "@repo/ui/animateLoader";

import { User, Mail, Phone, Lock, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

type UserRole = "admin" | "client" | "partner";

type FormProps = {
    userRole?: string;
}
export default function SignupForm({ userRole }: FormProps) {
    const [form, setForm] = useState<UserSingUpSchema>({
        name: "",
        contact: "",
        email: "",
        password: "",
        role: "client" as UserRole,
    });

    const [showPassword, setShowPassword] = useState(false);
    const signupMutation = useCreateUser();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(form);
        signupMutation.mutate(form);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl px-8 pt-6 pb-6 w-full max-w-md"
        >
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Welcome to{" "}
                    <span className="text-red-600 dark:text-red-400">
                            <Link href="/">EkPratisat</Link>
                    </span>
                </h2>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    “Your trusted partner in building dreams through real estate.”
                </p>
            </div>

            {/* Name */}
            <label className="block mb-4">
                <span className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <User size={18} /> Name
                </span>
                <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="mt-1 block w-full border rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                    required
                />
            </label>

            {/* Contact */}
            <label className="block mb-4">
                <span className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Phone size={18} /> Contact
                </span>
                <input
                    type="text"
                    name="contact"
                    value={form.contact}
                    onChange={handleChange}
                    className="mt-1 block w-full border rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                    required
                />
            </label>

            {/* Email */}
            <label className="block mb-4">
                <span className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Mail size={18} /> Email
                </span>
                <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="mt-1 block w-full border rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                    required
                />
            </label>

            {/* Password with toggle */}
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

            {/* Role */}
            {
                userRole == "admin" &&
                <label className="block mb-6">
                    <span className="text-gray-700 dark:text-gray-300">Role</span>
                    <select
                        name="role"
                        value={form.role}
                        onChange={handleChange}
                        className="mt-1 block w-full border rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                    >
                        <option value="client">Client</option>
                        <option value="partner">Partner</option>
                        <option value="admin">Admin</option>
                    </select>
                </label>
            }


            {/* Submit */}
            <Button
                className="w-full"
                variant="destructive"
                type="submit"
                disabled={signupMutation.isPending}
            >
                {signupMutation.isPending ? <AnimateLoader /> : "Sign Up"}
            </Button>
        </form>
    );
}
