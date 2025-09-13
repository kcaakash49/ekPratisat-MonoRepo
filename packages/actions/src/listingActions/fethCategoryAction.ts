"use server";

import { fetchCategories } from "@repo/functions";


export async function fetchCategoryAction(){
    return await fetchCategories();
}