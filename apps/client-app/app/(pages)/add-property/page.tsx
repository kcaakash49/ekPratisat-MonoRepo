"use client";

import CreateProperty from "@repo/components/addPropertyForm";
import AnimateLoader from "@repo/ui/animateLoader";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";




export default function AddProperty(){
    const { data:session, status } = useSession();
    console.log(session);
    const router = useRouter();
    
    useEffect(() => {
        if(status === "unauthenticated"){
            router.push("/");
        }
    },[status,router]);

    if (status === 'loading') {
        return <div className="min-h-screen flex items-center justify-center">
            <AnimateLoader/>
        </div>
    }

    return (
        <div className="min-h-screen"><CreateProperty/></div>
    )
}