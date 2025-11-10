"use client";

import { useGetAgents } from "@repo/query-hook";
import AnimateLoader from "@repo/ui/animateLoader";
import { AgentType } from "@repo/validators";
import Link from "next/link";
import { toast } from "sonner";

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
  console.log(agents);

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
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    agent.isVerified
                      ? "bg-primary-100 text-primary-700 dark:bg-primary-dark-500 dark:text-primary-100"
                      : "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200"
                  }`}
                >
                  {agent.isVerified ? "Verified" : "Not Verified"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
