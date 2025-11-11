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
    <div className="min-h-screen flex bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <AdminSidebarClient userName={userName} />
      <div className="flex-1 flex flex-col min-h-0">
        <main className="flex-1 overflow-auto pt-16 md:pt-0">
          {children}
        </main>
        <footer className="flex-shrink-0">
          {/* <Footer /> */}
          <span>&copy; 2025 StackHook Pvt. Ltd.</span>
          <span className="hidden sm:inline">|</span>
          <span>All Rights Reserved</span>
        </footer>
      </div>
    </div>
  );
}