import { authenticatedFetch } from "@repo/shared-provider";
import { useQuery } from "@tanstack/react-query";

export const useGetLeads = ({page=1,limit=20,status="",dealType="",clientType="",q=""}) => {
    return useQuery({
        queryKey: ["leads", {page,status,dealType,clientType,q}],
        queryFn: async () => {
            const params = new URLSearchParams({
                page: String(page),
                limit:String(limit),
                ...(q && {q}),
                ...(status && {status}),
                ...(dealType && {dealType}),
                ...(clientType && {clientType}),
            })
            return authenticatedFetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/lead?${params.toString()}`,
                {method: "GET"}
            );
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 1,
        retryDelay: 2000,
        refetchOnWindowFocus: true,

    });
}

export const useGetLeadById = (id:string) => {
    return useQuery({
        queryKey:["lead-detail",id],
        queryFn: async () => {
            return authenticatedFetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/lead/${id}`,
                {method: "GET"}
            )
        },
        staleTime:5 * 60 * 1000,
        retry:1,
        retryDelay:2000,
        refetchOnWindowFocus:true
    })
}