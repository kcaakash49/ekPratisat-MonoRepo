"use client";

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useGetUserLead } from '@repo/query-hook';
import {
    Briefcase,
    AlertOctagon,
    Clock,
    User,
    Phone,
    ArrowUpRight,
    Calendar,
    FolderOpen,
    Info,
    Layers,
    Sparkles
} from 'lucide-react';

interface LeadItem {
    id: string;
    leadCode: number;
    name: string | null;
    contact: string;
    email: string | null;
    source: string;
    clientType: 'BUYER' | 'SELLER';
    propertyId: string | null;
    imageUrl: string;
    dealType: string;
    coordinates: string | null;
    managedById: string;
    notes: Record<string, any> | null;
    followUpAt: string | null;
    status: 'NEW' | 'CONTACTED' | 'FOLLOW_UP' | 'WON' | 'LOST';
    createdAt: string;
    updatedAt: string;
    updatedById: string | null;
    remarks: string | null;
}

export default function MyLeadsDashboard() {
    const { data, isLoading, isError, error, refetch } = useGetUserLead();

    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    const { overdueLeads, todayLeads, standardLeads } = useMemo(() => {
        const rawLeads: LeadItem[] = data?.result ?? [];

        const overdue: LeadItem[] = [];
        const today: LeadItem[] = [];
        const standard: LeadItem[] = [];

        // Get exact local time numbers
        
        const startOfToday = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate()).getTime();
        const endOfToday = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), 23, 59, 59, 999).getTime();
        const currentEpoch = currentTime.getTime();

        rawLeads.forEach((lead) => {
            if (!lead.followUpAt) {
                standard.push(lead);
                return;
            }

            // Parse absolute universal epoch milliseconds to eliminate timezone offsets
            const followUpEpoch = new Date(lead.followUpAt).getTime();

            if (followUpEpoch < currentEpoch) {
                // ✅ Local time has passed this absolute timestamp = OVERDUE
                overdue.push(lead);
            } else if (followUpEpoch >= startOfToday && followUpEpoch <= endOfToday) {
                // Scheduled for later on today's calendar
                today.push(lead);
            } else {
                // Future date pipeline
                standard.push(lead);
            }
        });

        return { overdueLeads: overdue, todayLeads: today, standardLeads: standard };
    }, [data, currentTime]);

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
                <div className="h-8 w-64 bg-secondary-200 dark:bg-secondary-800 rounded-lg animate-pulse" />
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-44 bg-secondary-50 dark:bg-secondary-900/40 rounded-2xl border border-secondary-200 dark:border-secondary-800 animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="bg-red-50/50 dark:bg-red-950/10 border border-red-200 dark:border-red-900/30 rounded-2xl p-8 text-center max-w-xl mx-auto space-y-4 shadow-sm">
                    <AlertOctagon className="w-12 h-12 text-red-500 mx-auto stroke-[1.5]" />
                    <div>
                        <h3 className="text-base font-bold text-secondary-900 dark:text-secondary-100">Failed to load pipeline records</h3>
                        <p className="text-sm text-secondary-500 mt-1">{error?.message || "Database request timeout."}</p>
                    </div>
                    <button onClick={() => refetch()} className="px-5 py-2 text-xs font-bold bg-white dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-700 rounded-xl hover:bg-secondary-50 transition active:scale-95">
                        Retry Sync
                    </button>
                </div>
            </div>
        );
    }

    const totalLeads = (data?.result ?? []).length;

    return (
        <div className="max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-10">

            {/* 🌟 PREMIUM MINIMALIST HERO HEADER BLOCK */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-secondary-100 dark:border-secondary-800/60 pb-8">
                <div className="space-y-1.5">
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 text-xs font-semibold tracking-wide">
                        <Sparkles className="w-3.5 h-3.5" /> Workspace Control
                    </div>
                    <h1 className="text-2xl font-black tracking-tight text-secondary-900 dark:text-secondary-50 flex items-center gap-3">
                        My Operational Leads
                    </h1>
                    <p className="text-sm text-secondary-500 dark:text-secondary-400 max-w-xl leading-relaxed">
                        Real-time visual monitoring grid separating urgent follow-ups from daily pipeline movements.
                    </p>
                </div>
                <div className="flex items-center gap-3 shrink-0 bg-secondary-50 dark:bg-secondary-900/60 border border-secondary-200/60 dark:border-secondary-800 p-3 rounded-2xl">
                    <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center text-white font-black text-sm shadow-md shadow-primary-500/20">
                        {totalLeads}
                    </div>
                    <div>
                        <div className="text-xs font-bold text-secondary-900 dark:text-secondary-100">Assigned Allocation</div>
                        <div className="text-[11px] text-secondary-400">Total active Leads</div>
                    </div>
                </div>
            </div>

            {totalLeads === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-secondary-200 dark:border-secondary-800 rounded-3xl bg-secondary-50/20 dark:bg-secondary-900/5">
                    <FolderOpen className="w-14 h-14 text-secondary-300 dark:text-secondary-700 stroke-[1.2] mb-3" />
                    <h3 className="text-base font-bold text-secondary-800 dark:text-secondary-200">No managed leads active</h3>
                    <p className="text-xs text-secondary-400 max-w-xs mt-1 leading-relaxed">Your assigned queue configuration shows 0 records needing action right currentTime.</p>
                </div>
            ) : (
                <div className="space-y-10">

                    {/* 🛑 SEPARATE HIGH-ALERT CONTAINER FOR MISSED DEADLINES */}
                    {overdueLeads.length > 0 && (
                        <div className="bg-gradient-to-b from-red-50/30 to-red-50/5 dark:from-red-950/10 dark:to-transparent border border-red-200/80 dark:border-red-900/30 rounded-3xl p-6 space-y-4 shadow-sm">
                            <div className="flex items-center justify-between border-b border-red-100 dark:border-red-950/40 pb-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                    <h2 className="text-xs font-black tracking-widest text-red-600 dark:text-red-400 uppercase flex items-center gap-1.5 animate-pulse duration-100">
                                        <AlertOctagon className="w-4 h-4 text-red-500" />
                                        Critical Overdue Tasks ({overdueLeads.length})
                                    </h2>
                                </div>
                                <span className="text-[10px] bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 px-2.5 py-0.5 rounded-md font-bold">Action Needed currentTime</span>
                            </div>
                            <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                                {overdueLeads.map((lead) => (
                                    <LeadCard key={lead.id} lead={lead} alertType="overdue" />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ⏰ TODAY PENDING PIPELINE GRID */}
                    {todayLeads.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 border-b border-amber-200/60 dark:border-amber-800/60 pb-3">
                                <h2 className="text-xs font-black tracking-widest text-amber-600 dark:text-amber-400 uppercase flex items-center gap-1.5">
                                    <Clock className="w-4 h-4 text-amber-500" />
                                    Scheduled Contact Targets Today ({todayLeads.length})
                                </h2>
                            </div>
                            <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                                {todayLeads.map((lead) => (
                                    <LeadCard key={lead.id} lead={lead} alertType="today" />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 📋 STANDARD ALLOCATION LAYER */}
                    {standardLeads.length > 0 && (
                        <div className="space-y-4">
                            {(overdueLeads.length > 0 || todayLeads.length > 0) && (
                                <div className="flex items-center gap-2 border-b border-secondary-100 dark:border-secondary-800 pb-3">
                                    <h2 className="text-xs font-black tracking-widest text-secondary-400 uppercase flex items-center gap-1.5">
                                        <Layers className="w-3.5 h-3.5" />
                                        General Leads ({standardLeads.length})
                                    </h2>
                                </div>
                            )}
                            <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                                {standardLeads.map((lead) => (
                                    <LeadCard key={lead.id} lead={lead} alertType="standard" />
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            )}
        </div>
    );
}

/* SUB-COMPONENT MODULE: PREMIUM INDIVIDUAL CONTENT CARD */
function LeadCard({ lead, alertType }: { lead: LeadItem; alertType: 'overdue' | 'today' | 'standard' }) {

    const styleConfig = {
        overdue: {
            border: "border-red-200 dark:border-red-900/60 bg-white dark:bg-secondary-950/20 hover:border-red-400 dark:hover:border-red-500 hover:shadow-lg hover:shadow-red-500/5",
            badge: "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400",
            pillColor: "bg-red-500"
        },
        today: {
            border: "border-amber-200 dark:border-amber-900/60 bg-white dark:bg-secondary-950/20 hover:border-amber-400 dark:hover:border-amber-500 hover:shadow-lg hover:shadow-amber-500/5",
            badge: "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
            pillColor: "bg-amber-500"
        },
        standard: {
            border: "border-secondary-200 dark:border-secondary-800/80 bg-white dark:bg-secondary-900/20 hover:border-primary-400 dark:hover:border-primary-500 hover:shadow-lg hover:shadow-primary-500/5",
            badge: "bg-secondary-50 text-secondary-600 dark:bg-secondary-800 dark:text-secondary-400",
            pillColor: "bg-primary-500"
        }
    }[alertType];

    return (
        <div className={`p-5 rounded-2xl border flex flex-col justify-between gap-5 transition-all duration-300 relative group overflow-hidden ${styleConfig.border}`}>

            {/* Decorative vertical color flash strip edge visible on hover */}
            <div className={`absolute left-0 top-0 bottom-0 w-[3px] transition-transform origin-left scale-y-0 group-hover:scale-y-100 ${styleConfig.pillColor}`} />

            <div className="space-y-3.5">
                {/* Core Metadata Frame */}
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 space-y-0.5">
                        <h4 className="text-sm font-bold text-secondary-900 dark:text-secondary-100 flex items-center gap-1.5 truncate">
                            <User className="w-3.5 h-3.5 text-secondary-400 shrink-0" />
                            {lead.name ? lead.name : "Anonymous Prospect"}
                        </h4>
                        <div className="text-[10px] text-secondary-400 font-mono tracking-wider uppercase">
                            Lead-Code: #{lead.leadCode}
                        </div>
                    </div>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-md font-black tracking-wider uppercase shrink-0 ${styleConfig.badge}`}>
                        {lead.status}
                    </span>
                </div>

                {/* Info Rows Parameters Block */}
                <div className="space-y-2 border-t border-secondary-50 dark:border-secondary-800/40 pt-3 text-xs text-secondary-600 dark:text-secondary-400">
                    <div className="flex items-center justify-between">
                        <span className="text-secondary-400 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-secondary-400" /> Phone</span>
                        <span className="font-mono font-medium text-secondary-800 dark:text-secondary-200">{lead.contact}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-secondary-400 flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5 text-secondary-400" /> Channel</span>
                        <span className="font-semibold text-secondary-800 dark:text-secondary-200">{lead.source}</span>
                    </div>
                </div>
            </div>

            {/* Card Base Interface Control strip */}
            <div className="pt-3 border-t border-secondary-100 dark:border-secondary-800/60 flex items-center justify-between gap-4 text-[11px]">
                {lead.followUpAt ? (
                    <div className={`flex items-center gap-1.5 font-bold truncate ${alertType === 'overdue' ? 'text-red-500' : alertType === 'today' ? 'text-amber-500' : 'text-secondary-400'
                        }`}>
                        <Calendar className="w-3.5 h-3.5 shrink-0" />
                        <span>
                            {new Date(lead.followUpAt).toLocaleDateString([], { month: 'short', day: 'numeric' })} at{' '}
                            {new Date(lead.followUpAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                ) : (
                    <span className="text-secondary-400 dark:text-secondary-500 italic flex items-center gap-1">
                        <Info className="w-3.5 h-3.5 text-secondary-300 dark:text-secondary-700" /> Unscheduled
                    </span>
                )}

                <Link
                    href={`/admin/leads/${lead.id}`}
                    className="inline-flex items-center gap-0.5 font-bold text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 shrink-0 transition"
                >
                    View File
                    <ArrowUpRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
            </div>

        </div>
    );
}