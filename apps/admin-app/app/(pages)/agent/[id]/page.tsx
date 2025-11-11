"use client";

import { useGetAgentDetail } from "@repo/query-hook";
import AnimateLoader from "@repo/ui/animateLoader";
import { AgentDetailType } from "@repo/validators";
import { useParams } from "next/navigation";
import Image from "next/image";
import { VerifyBadge } from "../../../../components/VerifiedBadge";

export default function AgentDetail() {
    const param = useParams();
    const { data, isLoading, isError, error } = useGetAgentDetail(param.id as string);

    if (isLoading) {
        return (
            <div className="flex flex-1 items-center justify-center h-full">
                <AnimateLoader />
            </div>
        );
    }

    if (isError) {
        const message = error.message || "Couldn't fetch data";
        return (
            <div className="flex flex-1 items-center justify-center text-red-500 text-lg md:text-xl">{message}</div>
        );
    }

    const agent = data?.result as AgentDetailType;

    return (
        <div className="max-w-7xl p-6 space-y-6 rounded-xl shadow-md">

            {/* Header */}
            <div className="flex flex-col md:flex-row items-center md:justify-between gap-6 md:gap-14 max-w-4xl mx-auto">
                {/* Profile Image - Clean without tick */}
                <div className="flex-shrink-0">
                    <div className="relative w-36 h-36 sm:w-40 sm:h-40 md:w-44 md:h-44 rounded-full overflow-hidden border-4 border-primary-500 dark:border-primary-dark-500">
                        {agent.profileImageUrl ? (
                            <Image
                                src={`${process.env.NEXT_PUBLIC_BASE_URL}${agent.profileImageUrl}`}
                                alt={agent.name}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="flex items-center justify-center w-full h-full bg-secondary-200 dark:bg-secondary-700 text-secondary-500 dark:text-secondary-300 text-sm sm:text-base">
                                No Image
                            </div>
                        )}
                    </div>
                </div>

                {/* Basic Info */}
                <div className="flex-1 space-y-2 text-sm sm:text-base md:text-base lg:text-lg">
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl sm:text-3xl font-bold text-primary-600 dark:text-primary-500">
                            {agent.name}
                        </h1>
                        {/* Keep verification badge next to name only */}
                        {agent.isVerified && (
                            <div className="flex items-center justify-center w-6 h-6 bg-blue-500 rounded-full" title="Verified Agent">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-3 w-3 text-white"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                        )}
                    </div>
                    <p className="text-secondary-600 dark:text-secondary-300">Email: {agent.email}</p>
                    <p className="text-secondary-600 dark:text-secondary-300">Contact: {agent.contact}</p>
                    <p className="text-secondary-600 dark:text-secondary-300">
                        Created By: {agent.createdBy?.name || "Unknown"}
                    </p>
                    <VerifyBadge isVerified = {agent.isVerified} userId={agent.id}/>
                </div>
            </div>

            {/* Documents */}
            <div className="mt-6 max-w-4xl mx-auto">
                <h2 className="text-xl sm:text-2xl font-semibold text-secondary-700 dark:text-secondary-300 mb-4">
                    Documents
                </h2>
                {agent.documents.length === 0 ? (
                    <p className="text-secondary-500 dark:text-secondary-400 text-sm sm:text-base">No documents uploaded.</p>
                ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                        {agent.documents.map((doc) => (
                            <div
                                key={doc.id}
                                className="p-4 border rounded-lg bg-secondary-50 dark:bg-secondary-800 border-secondary-200 dark:border-secondary-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 hover:shadow-md transition-shadow"
                            >
                                <a
                                    href={doc.url.startsWith("/") ? `${process.env.NEXT_PUBLIC_BASE_URL}${doc.url}` : doc.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary-600 dark:text-primary-500 font-medium text-sm sm:text-base break-words"
                                >
                                    Document Type: {doc.type}
                                </a>

                                <span
                                    className={`px-3 py-1 text-xs sm:text-sm md:text-base font-medium rounded-full flex-shrink-0 ${doc.isVerified
                                        ? "bg-green-100 text-green-700 dark:bg-green-600 dark:text-green-200"
                                        : "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200"
                                        }`}
                                >
                                    {doc.isVerified ? "Verified" : "Not Verified"}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
}