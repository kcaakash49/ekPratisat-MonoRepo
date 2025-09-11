"use server"

import { addCategory } from "@repo/functions";
import { CategorySchema } from "@repo/validators";


export async function addCategoryAction(formData:CategorySchema) {
    return await addCategory(formData);
}