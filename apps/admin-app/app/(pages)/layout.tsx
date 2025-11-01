// File: app/admin/layout.tsx

import React from "react";

import { getServerSession } from "next-auth";
import { authOptions } from "@repo/auth-config";
import AdminSidebarClient from "../../components/AdminSidebarClient";


type Props = {
  children: React.ReactNode;
};

export default async function AdminLayout({ children }: Props) {
  const session = await getServerSession(authOptions);
  const userName = session?.user?.name ?? "Admin";

  return (
    <div className="min-h-screen flex bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
      <AdminSidebarClient userName={userName} />
      <div className="flex-1 flex flex-col">
        <main className="flex-grow overflow-auto flex flex-col">{children}</main>
        <footer className="p-4 text-center border-t border-gray-200 dark:border-gray-700 text-sm">
          &copy; {new Date().getFullYear()} StackHook Pvt. Ltd.
        </footer>
      </div>
    </div>
  );
}


