"use server"

import { editBasicInfo } from "@repo/functions";
import { EditAgentBasicProfileInput } from "@repo/validators";

export async function editBasicInfoAction(payload:EditAgentBasicProfileInput) {
    return await editBasicInfo(payload);
}