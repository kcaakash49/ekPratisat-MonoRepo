"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { ToggleTheme } from "@repo/components/toggleTheme";
import { SidebarDropdownSection } from "@repo/ui/sideBarDropdownSection";

const navSections = [
  { name: "Dashboard", path: "/dashboard" },
  {
    name: "Properties",
    children: [
      { name: "Add Property", path: "/add-property" },
      { name: "List Properties", path: "/list-properties" },
    ],
  },
  {
    name: "Users",
    children: [
      { name: "Add Agent", path: "/agent/add-agent" },
      { name: "List Agents", path: "/agent/list-agents" },
    ],
  },
];

interface Props {
  userName?: string;
}

export default function AdminSidebarClient({ userName }: Props) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Check if any child link is active to show dropdown as active
  const isSectionActive = (children: { path: string }[]) => {
    return children.some(child => pathname === child.path);
  };

  return (
    <>
      {/* Mobile Navbar */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700 px-4 py-3 flex items-center justify-between z-50">
        <button
          className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? (
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
        
        <h2 className="text-lg font-semibold">
          Welcome, {userName?.split(" ")[0]}
        </h2>
        
        {/* Empty div for flex spacing */}
        <div className="w-10"></div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <nav
        className={`fixed inset-y-0 md:static top-0 left-0 w-64 bg-gray-100 dark:bg-gray-800 p-6 flex flex-col z-40
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:mt-0 mt-16`}
      >
        {/* Hidden on mobile since we have the mobile navbar */}
        <h2 className="hidden md:block text-lg sm:text-xl md:text-2xl font-bold mb-5 md:mb-8">
          Welcome, {userName?.split(" ")[0]}
        </h2>

        <div className="flex flex-col space-y-2 text-sm sm:text-base">
          {navSections.map((section) =>
            section.children ? (
              <SidebarDropdownSection 
                key={section.name}
                title={section.name}
                defaultOpen={isSectionActive(section.children)}
                isActive={isSectionActive(section.children)}
                className="mb-2"
              >
                {section.children.map(({ name, path }) => (
                  <Link
                    key={path}
                    href={path}
                    onClick={() => setSidebarOpen(false)}
                    className={`block px-3 py-2 rounded-lg transition-all duration-200 text-xs ${
                      pathname === path
                        ? "bg-primary-500 text-white shadow-sm"
                        : "text-secondary-700 dark:text-secondary-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400"
                    }`}
                  >
                   - {name}
                  </Link>
                ))}
              </SidebarDropdownSection>
            ) : (
              <Link
                key={section.path}
                href={section.path!}
                onClick={() => setSidebarOpen(false)}
                className={`block px-4 py-3 rounded-lg transition-all duration-200 ${
                  pathname === section.path
                    ? "bg-primary-500 text-white shadow-sm"
                    : "text-secondary-700 dark:text-secondary-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400"
                }`}
              >
                {section.name}
              </Link>
            )
          )}
        </div>

        <div className="mt-auto flex flex-col space-y-3 text-sm">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="px-4 py-2 rounded-lg border border-gray-400 dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-700 transition-all duration-200"
          >
            Log Out
          </button>

          <ToggleTheme />
        </div>
      </nav>
    </>
  );
}