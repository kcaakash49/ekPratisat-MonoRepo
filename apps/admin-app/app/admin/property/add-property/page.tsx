"use client";
import { AddPropertyForm } from "@repo/components/addPropertyForm";
import { useUser } from "@repo/query-hook";
import Loading from "../../loading";



export default function AddProperty() {
    
    const {data: user, isLoading} = useUser();

    if(isLoading) {
        return <div className="flex items-center justify-center min-h-screen"><Loading/></div>
    }

    const userRole = user?.role;
    return (
        <AddPropertyForm user={userRole}/>
    )
}