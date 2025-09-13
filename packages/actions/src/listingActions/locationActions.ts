
"use server"

import { addDistrict, addMunicipality, addWard, fetchLocationTree } from "@repo/functions"
import { LocationSchema } from "@repo/validators";

export async function fetchLocationTreeAction(){
    return await fetchLocationTree();
}

export async function addDistrictAction({name, userId} : LocationSchema){
    return await addDistrict({name,userId});
}

export async function addMunicipalityAction({name, userId, parentId} : LocationSchema){
    return await addMunicipality({name, userId, parentId});
}

export async function addWardAction({name, userId, parentId} : LocationSchema) {
    return await addWard({ name, userId, parentId })
}