import { AgentDetailType } from "@repo/validators";
import Image from "next/image";
import VerifyBadge from "./VerifyBadge";

export default function BasicInfoSection({agent} : {agent: AgentDetailType}){
    return (
        <div className="flex flex-col md:flex-row items-center md:justify-between gap-6 md:gap-14">
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
                <VerifyBadge isVerified={agent.isVerified} userId={agent.id}/>
            </div>
        </div>
    )
}