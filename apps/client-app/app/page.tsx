"use client";

import { authMutations } from "@repo/api-client";
import { UserSingUpSchema } from "@repo/validators";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

type UserRole = "admin" | "client" | "partner";

export default function Home (){
  const [form, setForm] = useState<UserSingUpSchema>({
    name: "",
    contact: "",
    email: "",
    password: "",
    role: "client" as UserRole,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  
  const signupMutation = useMutation({
    mutationFn: authMutations.createUser,
    onSuccess: () => {
      console.log("Success");
    },
    onSettled: () => {
      console.log("Everything done");
    }
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted:", form);
    signupMutation.mutate(form);
   
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
  <form
    onSubmit={handleSubmit}
    className="bg-white dark:bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 w-full max-w-md"
  >
    <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">Sign Up</h2>

    <label className="block mb-2 text-gray-700 dark:text-gray-300">
      Name
      <input
        type="text"
        name="name"
        value={form.name}
        onChange={handleChange}
        className="mt-1 block w-full border rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
        required
      />
    </label>

    <label className="block mb-2 text-gray-700 dark:text-gray-300">
      Contact
      <input
        type="text"
        name="contact"
        value={form.contact}
        onChange={handleChange}
        className="mt-1 block w-full border rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
        required
      />
    </label>

    <label className="block mb-2 text-gray-700 dark:text-gray-300">
      Email
      <input
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        className="mt-1 block w-full border rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
        required
      />
    </label>

    <label className="block mb-2 text-gray-700 dark:text-gray-300">
      Password
      <input
        type="password"
        name="password"
        value={form.password}
        onChange={handleChange}
        className="mt-1 block w-full border rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
        required
      />
    </label>

    <label className="block mb-4 text-gray-700 dark:text-gray-300">
      Role
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

    <button
      type="submit"
      className="w-full bg-blue-600 dark:bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 dark:hover:bg-blue-600 transition"
    >
      Sign Up
    </button>
  </form>
</div>

  )
}