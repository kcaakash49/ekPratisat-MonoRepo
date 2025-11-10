import { getAgentDetailAction, getAgentListAction } from "@repo/actions"
import { useQuery } from "@tanstack/react-query"

export const useGetAgents = () => {
    return useQuery({
        queryKey: ["agents-list"],
        queryFn: getAgentListAction,
        retry:1,
        staleTime:10 * 60 * 1000,
        refetchOnWindowFocus: true
    })
}

export const useGetAgentDetail = (id: string) => {
    return useQuery({
        queryKey: ["agent-detail", id],
        queryFn: async () => {
            const res = await getAgentDetailAction(id);
            if(res.status === 200){
                return res;
            }
        },
        retry: 1,
        staleTime: 10 * 60 * 1000,
        refetchOnWindowFocus: true
    })
}