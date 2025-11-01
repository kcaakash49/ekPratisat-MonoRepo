"use client";

import { useState, useEffect, useRef } from "react";
import { useCreateUser } from "@repo/query-hook";
import { UserSingUpSchema } from "@repo/validators";
import { Button } from "@repo/ui/button";
import AnimateLoader from "@repo/ui/animateLoader";
import { User, Mail, Phone, Lock, Eye, EyeOff, ImageIcon } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";


type ErrorType = {
    name?: string;
    contact?: string;
    email?: string;
    password?: string;
};

export default function SignupForm() {
    const [form, setForm] = useState<UserSingUpSchema>({
        name: "",
        contact: "",
        email: "",
        password: ""
    });
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<ErrorType>({});
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const signupMutation = useCreateUser();

    // refs for each input
    const nameRef = useRef<HTMLInputElement>(null);
    const contactRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    // focus on the first error when error state changes
    useEffect(() => {
        if (error.name && nameRef.current) {
            nameRef.current.focus();
        } else if (error.contact && contactRef.current) {
            contactRef.current.focus();
        } else if (error.email && emailRef.current) {
            emailRef.current.focus();
        } else if (error.password && passwordRef.current) {
            passwordRef.current.focus();
        }
    }, [error]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const payload = {
            ...form,
            name: form.name.replace(/\s+/g, " ").trim(),
        };
        console.log(payload);
        // signupMutation.mutate(payload, {
        //     onSuccess: (data) => {
        //         if (data.status === 200 && "user" in data) {
        //             toast.success("User created successfully!");
        //             setError({})
        //             router.replace("/");

        //         } else if ("error" in data) {
        //             setError(data.fieldErrors || {});
        //             toast.error(data.error);
        //         } else {
        //             toast.error("Something went wrong");
        //         }
        //     },
        // });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Only image files are allowed")
            return;
        }

        setProfileImage(file);
        setPreviewUrl(URL.createObjectURL(file));

    }
    return (
        <form
            onSubmit={handleSubmit}
            className="shadow-2xl rounded-2xl px-8 pt-6 pb-6 w-full"
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

            {/* ✅ Profile Image */}
            <label className="block mb-4">
                <span className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <ImageIcon size={18} /> Profile Image (optional)
                </span>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="mt-1 block w-full text-gray-700 dark:text-gray-300"
                />
                {previewUrl && (
                    <div className="mt-2 flex justify-center">
                        <img
                            src={previewUrl}
                            alt="Preview"
                            className="h-24 w-24 object-cover rounded-full border"
                        />
                    </div>
                )}
            </label>

            {/* Name */}
            <label className="block mb-4">
                <span className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <User size={18} /> Name
                </span>
                <input
                    ref={nameRef}
                    type="text"
                    name="name"
                    value={form.name}
                    max={10}
                    onChange={handleChange}
                    className="mt-1 block w-full border rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                    required
                />
                {error.name && <FieldError message={error.name} />}
            </label>

            {/* Contact */}
            <label className="block mb-4">
                <span className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Phone size={18} /> Contact
                </span>
                <input
                    ref={contactRef}
                    type="text"
                    inputMode="numeric"
                    name="contact"
                    pattern="\d*"
                    value={form.contact}
                    onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        setForm({ ...form, contact: value });
                    }}
                    className="mt-1 block w-full border rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                    required
                />
                {error.contact && <FieldError message={error.contact} />}
            </label>

            {/* Email */}
            <label className="block mb-4">
                <span className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Mail size={18} /> Email
                </span>
                <input
                    ref={emailRef}
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="mt-1 block w-full border rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                    required
                />
                {error.email && <FieldError message={error.email} />}
            </label>

            {/* Password with toggle */}
            <label className="block mb-4">
                <span className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Lock size={18} /> Password
                </span>
                <div className="relative">
                    <input
                        ref={passwordRef}
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
                {error.password && <FieldError message={error.password} />}
            </label>

            {/* Submit */}

            <Button
                variant="destructive"
                type="submit"
                disabled={signupMutation.isPending}
                className="w-full"
            >
                {signupMutation.isPending ? <AnimateLoader /> : "Sign Up"}
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
