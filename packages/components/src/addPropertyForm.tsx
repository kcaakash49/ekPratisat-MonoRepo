
"use client";

import { useState } from "react";
import { CategoryModal } from "./categoryModal";
import { SessionUser } from "@repo/validators";


interface Props {
    user: SessionUser;
}

export default function CreateProperty({ user }: Props){
    const [isModalOpen, setIsModal] = useState(false);
    return (
        <div>
            <button onClick={() => setIsModal(true)}>Open Category</button>
            {
                isModalOpen && <CategoryModal onClose={() => setIsModal(false)} user={user}/>
            }

        </div>
    )
}