
"use client";

import { useState } from "react";
import { CategoryModal } from "./categoryModal";



export default function CreateProperty(){
    const [isModalOpen, setIsModal] = useState(false);
    return (
        <div>
            <button onClick={() => setIsModal(true)}>Open Category</button>
            {
                isModalOpen && <CategoryModal onClose={() => setIsModal(false)}/>
            }

        </div>
    )
}