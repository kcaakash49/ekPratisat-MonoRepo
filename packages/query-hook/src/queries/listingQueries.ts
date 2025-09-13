
import { fetchCategoryAction, fetchLocationTreeAction } from "@repo/actions";

import { useQuery } from "@tanstack/react-query";


export const useGetCatgories = () => {
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