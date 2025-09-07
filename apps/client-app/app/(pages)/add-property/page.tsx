"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";



export default function AddProperty(){
    const { data:session } = useSession();
   
    console.log(session?.user?.id);

    if(!session?.user){
        redirect("/");
    }

    return (
        <div>Add Property</div>
    )
}