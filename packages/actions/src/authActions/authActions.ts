"use server"


import { addUser } from "@repo/functions";
import { UserSingUpSchema } from "@repo/validators";


export async function addUserAction(credentials: UserSingUpSchema){
    return await addUser(credentials);
}