"use server"

import { getAgentList } from "@repo/functions"

export async function getAgentListAction() {
    return await getAgentList();
}