"use client";

import { useGetAgentDetail } from "@repo/query-hook";
import AnimateLoader from "@repo/ui/animateLoader";
import { AgentDetailType } from "@repo/validators";
import { useParams } from "next/navigation";
import ManagementActions from "./ManagementActions";
import BasicInfoSection from "./BasicInfoSection";
import DocumentSection from "./DocumentSection";
import { DropdownSection } from "@repo/ui/dropdown-section"; // Your new component

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
        <div className="max-w-7xl mx-auto p-6 space-y-6 rounded-xl shadow-md">

            {/* Header - Profile Info (Always Visible) */}
            <BasicInfoSection agent={agent}/>
        
            {/* Management Settings - Collapsible */}
            <DropdownSection 
                title="Management Settings" 
                defaultOpen={false}
            >
                <ManagementActions agent={agent}/>
            </DropdownSection>
        
            {/* Documents - Collapsible */}
            <DropdownSection 
                title="Documents" 
                defaultOpen={false}
            >
                <DocumentSection agent={agent}/>
            </DropdownSection>

        </div>
    );
}