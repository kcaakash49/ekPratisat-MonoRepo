
"use server"

import { authOptions } from "@repo/auth-config";
import { addDistrict, addMunicipality, addWard, AppError, fetchLocationTree } from "@repo/functions"
import { LocationSchema } from "@repo/validators";
import { getServerSession } from "next-auth";

export async function fetchLocationTreeAction(){
    return await fetchLocationTree();
}

export async function addDistrictAction({name} : LocationSchema){
    const session = await getServerSession(authOptions);
    if (!session) {
        throw new AppError(401, "Unauthorized")
    }
    const userId = session.user.id;

    return await addDistrict({name,userId});
}

export async function addMunicipalityAction({name, parentId} : LocationSchema){
    const session = await getServerSession(authOptions);
    if (!session) {
        throw new AppError(401, "Unauthorized")
    }
    const userId = session.user.id;
    return await addMunicipality({name, userId, parentId});
}

export async function addWardAction({name,parentId} : LocationSchema) {
    const session = await getServerSession(authOptions);
    if (!session) {
        throw new AppError(401, "Unauthorized")
    }
    const userId = session.user.id;
    return await addWard({ name, userId, parentId })
}