
"use client";

import { useState } from "react";
import { CategoryModal } from "./categoryForm";
import { UseMutationResult } from "@tanstack/react-query";

interface CreatePropertyProps{
    onAddCategory?: UseMutationResult<any,any,FormData,any>;
}

export default function CreateProperty({onAddCategory}: CreatePropertyProps){
    const [isModalOpen, setIsModal] = useState(false);
    return (
        <div>
            <button onClick={() => setIsModal(true)}>Open Category</button>
            {
                isModalOpen && <CategoryModal onClose={() => setIsModal(false)} onSubmit={(data) => onAddCategory?.mutate(data)}/>
            }

        </div>
    )
}