"use client";

import { useGetAgents } from "@repo/query-hook";
import AnimateLoader from "@repo/ui/animateLoader";
import { AgentType } from "@repo/validators";
import Link from "next/link";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { UserPlus } from "lucide-react";
import VerifyBadge from "./VerifyBadge";


export default function ListAgents() {
  const { data, isLoading, isError, error } = useGetAgents();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <AnimateLoader />
      </div>
    );
  }

  if (isError) {
    toast.error(error.message || "Can't list agents right now!!!");
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">Error loading agents</p>
          <p className="text-secondary-600 dark:text-secondary-400">
            {error.message || "Please try again later"}
          </p>
        </div>
      </div>
    );
  }

  const agents = data?.result || [];

  if (agents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 rounded-full flex items-center justify-center shadow-inner">
            <UserPlus className="w-10 h-10" />
          </div>

          <h2 className="mt-6 text-2xl font-semibold text-secondary-800 dark:text-secondary-200">
            No agents found
          </h2>
          <p className="text-secondary-600 dark:text-secondary-400 max-w-sm mt-2">
            {"You haven’t added any agents yet. Get started by adding your first one!"}

          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Link
            href="/agent/add-agent"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors shadow-md font-medium"
          >
            <UserPlus className="w-5 h-5" />
            Add Your First Agent
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header Section */}
      <div className="flex-shrink-0 p-6 pb-4 border-b border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-900">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-secondary-900 dark:text-white">
              Agents
            </h1>
            <p className="text-secondary-600 dark:text-secondary-400 mt-1">
              Manage your real estate agents and their verification status
            </p>
          </div>
          <Link
            href="/agent/add-agent"
            className="inline-flex items-center gap-2 px-4 py-2 mt-4 sm:mt-0 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium"
          >
            <UserPlus className="w-4 h-4" />
            Add Agent
          </Link>
        </div>
      </div>

      {/* Table Container */}
      <div className="flex-1 min-h-0 p-6">
        <div className="h-full flex flex-col bg-white dark:bg-secondary-900 rounded-xl border border-secondary-200 dark:border-secondary-700 shadow-sm overflow-hidden">
          {/* Table Wrapper */}
          <div className="flex-1 min-h-0 overflow-auto">
            <table className="w-full min-w-[800px] divide-y divide-secondary-200 dark:divide-secondary-700">
              <thead className="bg-secondary-50 dark:bg-secondary-800 sticky top-0">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-700 dark:text-secondary-300 uppercase tracking-wider">
                    Agent Name

                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-700 dark:text-secondary-300 uppercase tracking-wider">
                    Contact Information
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-700 dark:text-secondary-300 uppercase tracking-wider">
                    Created By
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-700 dark:text-secondary-300 uppercase tracking-wider">
                    Verification Status
                  </th>
                  {/* <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-700 dark:text-secondary-300 uppercase tracking-wider">
                    Actions
                  </th> */}
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-200 dark:divide-secondary-700 bg-white dark:bg-secondary-900">
                {agents.map((agent: AgentType, index: number) => (
                  <motion.tr
                    key={agent.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-secondary-50 dark:hover:bg-secondary-800 transition-colors group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                          <span className="text-primary-600 dark:text-primary-300 font-medium text-sm">
                            {agent.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <Link
                            href={`/agent/${agent.id}`}
                            className="text-lg font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 hover:underline transition-colors"
                          >
                            {agent.name}
                          </Link>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-secondary-900 dark:text-white font-medium">
                        {agent.contact}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-secondary-900 dark:text-white">
                        {agent.createdBy?.name || "Unknown"}
                      </div>
                      {agent.createdAt && (
                        <div className="text-secondary-500 dark:text-secondary-400 text-sm mt-1">
                          {new Date(agent.createdAt).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <VerifyBadge isVerified={agent.isVerified} userId={agent.id} />
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                          href={`/agent/${agent.id}`}
                          className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium text-sm"
                        >
                          View
                        </Link>
                        <Link
                          href={`/agent/${agent.id}/edit`}
                          className="text-secondary-600 dark:text-secondary-400 hover:text-secondary-700 dark:hover:text-secondary-300 font-medium text-sm"
                        >
                          Edit
                        </Link>
                      </div>
                    </td> */}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="flex-shrink-0 px-6 py-4 border-t border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-800">
            <div className="flex items-center justify-between">
              <p className="text-sm text-secondary-600 dark:text-secondary-400">
                Showing <span className="font-medium">{agents.length}</span> agent{agents.length !== 1 ? 's' : ''}
              </p>
              <div className="flex items-center space-x-2">
                <button
                  disabled
                  className="px-3 py-1 text-sm border border-secondary-300 dark:border-secondary-600 rounded text-secondary-400 dark:text-secondary-500"
                >
                  Previous
                </button>
                <button
                  disabled
                  className="px-3 py-1 text-sm border border-secondary-300 dark:border-secondary-600 rounded text-secondary-400 dark:text-secondary-500"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}