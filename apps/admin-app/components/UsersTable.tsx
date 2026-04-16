"use client";

import React from "react";
import { 
  CheckCircle2, 
  XCircle, 
  UserCircle, 
  Calendar, 
  Phone, 
  ShieldCheck 
} from "lucide-react";

// Types matching your Prisma select
interface User {
  id: string;
  name: string;
  contact: string;
  isVerified: boolean;
  role: string;
  createdAt: string;
  secondContact?: string | null;
  createdBy?: {
    id: string;
    name: string;
  } | null;
}

interface UserTableProps {
  users: User[];
}

export default function UserTable({ users }: UserTableProps) {

  return (
    <div className="w-full">
      {/* --- Desktop Table (Hidden on Mobile) --- */}
      <div className="hidden md:block overflow-hidden rounded-2xl border border-secondary-100 dark:border-secondary-800 bg-white dark:bg-secondary-900 shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-secondary-50 dark:bg-secondary-800/50 border-b border-secondary-100 dark:border-secondary-800">
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-secondary-500">Name</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-secondary-500">Contact</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-secondary-500">Role</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-secondary-500">Status</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-secondary-500">Joined Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-secondary-100 dark:divide-secondary-800">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-secondary-50/50 dark:hover:bg-secondary-800/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                      <UserCircle size={24} />
                    </div>
                    <span className="font-semibold text-secondary-900 dark:text-white">{user.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-secondary-600 dark:text-secondary-400">
                  <div className="flex flex-col">
                    <span className="flex items-center gap-1.5"><Phone size={14} /> {user.contact}</span>
                    {user.secondContact && <span className="text-xs opacity-60 ml-5">{user.secondContact}</span>}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getRoleStyles(user.role)}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {user.isVerified ? (
                    <div className="flex items-center gap-1.5 text-emerald-500 text-sm font-medium">
                      <ShieldCheck size={16} /> Verified
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-secondary-400 text-sm font-medium">
                      <XCircle size={16} /> Pending
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-secondary-500 dark:text-secondary-400">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- Mobile Cards (Hidden on Desktop) --- */}
      <div className="md:hidden space-y-4">
        {users.map((user) => (
          <div key={user.id} className="bg-white dark:bg-secondary-900 p-5 rounded-2xl border border-secondary-100 dark:border-secondary-800 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                  <UserCircle size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-secondary-900 dark:text-white">{user.name}</h3>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${getRoleStyles(user.role)}`}>
                    {user.role}
                  </span>
                </div>
              </div>
              {user.isVerified && <CheckCircle2 size={20} className="text-emerald-500" />}
            </div>
            
            <div className="space-y-3 pt-3 border-t border-secondary-50 dark:border-secondary-800">
              <div className="flex items-center justify-between text-sm">
                <span className="text-secondary-400 flex items-center gap-2"><Phone size={14}/> Contact</span>
                <span className="text-secondary-900 dark:text-white font-medium">{user.contact}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-secondary-400 flex items-center gap-2"><Calendar size={14}/> Joined</span>
                <span className="text-secondary-900 dark:text-white font-medium">
                   {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Helper for dynamic role colors
function getRoleStyles(role: string) {
  switch (role.toLowerCase()) {
    case "staff": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
    case "partner": return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300";
    default: return "bg-secondary-100 text-secondary-700 dark:bg-secondary-800 dark:text-secondary-400";
  }
}

// Loading Skeleton
function TableSkeleton() {
  return (
    <div className="w-full animate-pulse space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-16 bg-secondary-100 dark:bg-secondary-800 rounded-xl" />
      ))}
    </div>
  );
}