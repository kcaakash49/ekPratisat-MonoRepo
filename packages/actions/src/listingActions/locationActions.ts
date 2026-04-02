
"use server";

import { fetchLocationTree } from "@repo/functions";


export async function fetchLocationTreeAction(){
    return await fetchLocationTree();
}