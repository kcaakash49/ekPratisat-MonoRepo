"use server"

import { fetchListings } from "@repo/functions";

type fetchListingProps = {
    page? : number;
    pageSize?: number
}

export async function fetchListingAction({page, pageSize}:fetchListingProps) {
    return await fetchListings({page,pageSize})
}