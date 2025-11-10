"use client";

import { useGetAgentDetail } from "@repo/query-hook";
import AnimateLoader from "@repo/ui/animateLoader";
import { useParams } from "next/navigation"

export default function AgentDetail(){
    const param = useParams();
    const { data, isLoading, isError, error } = useGetAgentDetail(param.id as string);

    if (isLoading) {
        return <div className="flex flex-1 items-center justify-center"><AnimateLoader/></div>
    }

    if(isError) {
        const message = error.message || "Coundn't fetch data"
        return <div className="flex flex-1 items-center justify-center">{message}</div>
    }
    
    return (
        <div>Detail Page</div>
    )
}