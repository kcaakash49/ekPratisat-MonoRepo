
"use server";

import { getAgentDetai } from "@repo/functions";

export async function getAgentDetailAction(id: string){
    return await getAgentDetai(id);
}