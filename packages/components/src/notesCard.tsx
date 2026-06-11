"use client";

import { ClipboardList, FileText } from "lucide-react";

interface Props {
    // Accepts your nullable Prisma Json object
    notes: Record<string, any> | null | any;
    header:string;
    subheader:string;
}

export default function NotesCard({ notes, header, subheader }: Props) {
    // 1. Parse or validate the records array safely
    const hasNotes = notes && typeof notes === "object" && Object.keys(notes).length > 0;

    return (
        <div className="max-w-7xl mx-auto w-full bg-white dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-800 rounded-xl overflow-hidden shadow-sm">
            {/* Header section */}
            <div className="flex items-center gap-2.5 px-5 py-4 border-b border-secondary-100 dark:border-secondary-800 bg-secondary-50/50 dark:bg-secondary-800/30">
                <ClipboardList className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <div>
                    <h3 className="font-semibold text-secondary-900 dark:text-secondary-100 text-sm md:text-base">
                        {header}
                    </h3>
                    <p className="text-xs text-secondary-500">
                        {subheader}
                    </p>
                </div>
            </div>

            {/* Content area */}
            <div className="p-5">
                {hasNotes ? (
                    <div className="divide-y divide-secondary-100 dark:divide-secondary-800/60">
                        {Object.entries(notes).map(([key, value]) => {
                            // Clean up formatting (e.g., camelCase to Title Case if necessary, or just display raw string)
                            const displayKey = key.replace(/([A-Z])/g, ' $1').trim();
                            const displayValue = typeof value === "string" ? value : JSON.stringify(value);

                            return (
                                <div 
                                    key={key} 
                                    className="grid grid-cols-3 gap-4 py-3 first:pt-0 last:pb-0 items-baseline"
                                >
                                    {/* Key (Label Side) */}
                                    <span className="text-sm font-medium text-secondary-500 dark:text-secondary-400 capitalize break-words">
                                        {displayKey}
                                    </span>
                                    
                                    {/* Value Side */}
                                    <span className="col-span-2 text-sm font-semibold text-secondary-900 dark:text-secondary-100 break-words bg-secondary-50/60 dark:bg-secondary-800/20 px-3 py-1.5 rounded-lg border border-secondary-100/70 dark:border-secondary-800/40">
                                        {displayValue || "—"}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    /* Elegant Empty State */
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                        <div className="p-3 bg-secondary-50 dark:bg-secondary-800/50 rounded-full mb-3 text-secondary-400">
                            <FileText className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-medium text-secondary-600 dark:text-secondary-400">
                            No lead parameters recorded
                        </p>
                        <p className="text-xs text-secondary-400 mt-1 max-w-[240px]">
                            This property was either uploaded directly by the owner or contains no offline notes.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}