import { AgentDetailType } from "@repo/validators";


export default function DocumentSection({agent}: {agent: AgentDetailType}){
    return (
        <div className="mt-6">
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
    )
}