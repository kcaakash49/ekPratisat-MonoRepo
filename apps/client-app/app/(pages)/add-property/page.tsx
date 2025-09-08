"use client";

import { listingMutations } from "@repo/api-client";
import CreateProperty from "@repo/ui/add-property";
import AnimateLoader from "@repo/ui/animateLoader";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";




export default function AddProperty(){
    const { data:session, status } = useSession();
    const router = useRouter();
    
    useEffect(() => {
        if(status === "unauthenticated"){
            router.push("/");
        }
    },[status,router]);

    const addCategoryMutation = useMutation({
        mutationFn: listingMutations.createCategory,
        onSuccess: (data) => {
            console.log(data);
        },
        onError: (data) => {
            console.log(data)
        }

    })

    if (status === 'loading') {
        return <div className="min-h-screen flex items-center justify-center">
            <AnimateLoader/>
        </div>
    }

    return (
        <div className="min-h-screen"><CreateProperty onAddCategory={addCategoryMutation}/></div>
    )
}