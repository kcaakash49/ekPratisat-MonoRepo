
"use server"

import { fetchPropertyDetal } from "@repo/functions"

export async function fetchPropertyDetailAction(id:string) {
    return await fetchPropertyDetal(id);
}34