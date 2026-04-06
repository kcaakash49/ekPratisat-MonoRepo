"use client";

import { Button } from "@repo/ui/button";

import { useRouter } from "next/navigation";

export default function ProfileDropDown(){
    const router = useRouter();
    return (
        <div className="flex gap-2">
            <Button onClick = {() => router.push("/add-property")}>Add Property</Button>

        </div>
        )
}