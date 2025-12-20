
import { fetchCategoryAction, fetchListingAction, fetchLocationTreeAction } from "@repo/actions";

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