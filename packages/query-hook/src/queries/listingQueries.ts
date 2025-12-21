
import { fetchCategoryAction, fetchListingAction, fetchLocationTreeAction, fetchPropertyDetailAction } from "@repo/actions";

import { useQuery } from "@tanstack/react-query";


export const useGetCategories = () => {
    return useQuery({
        queryKey: ["categories"],
        queryFn: fetchCategoryAction,
        staleTime:60 * 60 * 1000,
        refetchOnMount: data => !data,
        retry: 1,
        retryDelay:2000,
        refetchOnWindowFocus: true
    })
}

export const useGetLocationTree = () => {
    return useQuery({
        queryKey: ["location"],
        queryFn: fetchLocationTreeAction,
        retry: 1,
        retryDelay:2000,
        staleTime: 60 * 60 * 1000,
        refetchOnMount: data => !data,
        refetchOnWindowFocus: true
    })
}

export const useFetchListings = ({page, pageSize}: {
    page?:number,
    pageSize?:number
}) => {
    return useQuery({
        queryKey: ["listings", String(page)],
        queryFn: async() => {
            const res = await fetchListingAction({page,pageSize});
            if(res.status === 200) {
                return res;
            }
        },
        retry: 1,
        staleTime:10 * 60 * 1000,
        refetchOnWindowFocus: true
    })
}

export const useFetchPropertyDetail = (id:string) => {
    return useQuery({
        queryKey: ["property-detail", id],
        queryFn: async() => {
            const res = await fetchPropertyDetailAction(id);
            if (res.status === 200) {
                return res.result;
            }
        },
        retry: 1,
        staleTime: 10 * 60 * 1000,
        refetchOnWindowFocus: true
    })
}