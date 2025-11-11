"use client";

import { useGetAgents } from "@repo/query-hook";
import AnimateLoader from "@repo/ui/animateLoader";
import { AgentType } from "@repo/validators";
import Link from "next/link";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { UserPlus } from "lucide-react";
import { VerifyBadge } from "./VerifyBadge";

export default function ListAgents() {
  const { data, isLoading, isError, error } = useGetAgents();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <AnimateLoader />
      </div>
    );
  }

  if (isError) {
    toast(error.message || "Can't list agents right now!!!");
    const message = error.message || "Unknown error";
    return <p className="text-red-500">Error: {message}</p>;
  }

  const agents = data?.result || [];
  
  if (agents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <div className="w-20 h-20 bg-primary-100 dark:bg-primary-dark-600 text-primary-600 dark:text-primary-300 rounded-full flex items-center justify-center shadow-inner animate-pulse">
            <UserPlus className="w-10 h-10" />
          </div>
  
          <h2 className="mt-6 text-2xl font-semibold text-secondary-700 dark:text-secondary-200">
            No agents found
          </h2>
          <p className="text-secondary-500 dark:text-secondary-400 max-w-sm">
            You haven’t added any agents yet. Get started by adding your first one!
          </p>
        </motion.div>
  
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Link
            href="/agent/add-agent"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors shadow-md"
          >
            <UserPlus className="w-4 h-4" />
            Add Agent
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto p-4">
      <table className="max-w-7xl divide-y divide-secondary-300 dark:divide-secondary-700">
        <thead className="bg-secondary-100 dark:bg-secondary-900">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-secondary-700 dark:text-secondary-300 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-secondary-700 dark:text-secondary-300 uppercase tracking-wider">
              Contact
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-secondary-700 dark:text-secondary-300 uppercase tracking-wider">
              Created By
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-secondary-700 dark:text-secondary-300 uppercase tracking-wider">
              Verified
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-secondary-200 dark:divide-secondary-700">
          {agents.map((agent: AgentType) => (
            <tr key={agent.id} className="transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-primary-600 dark:text-primary-500 font-medium hover:underline">
                <Link href={`/agent/${agent.id}`}>{agent.name}</Link>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-secondary-600 dark:text-secondary-300">
                {agent.contact}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-secondary-600 dark:text-secondary-300">
                {agent.createdBy?.name || "Unknown"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <VerifyBadge isVerified = {agent.isVerified} userId={agent.id}/>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
