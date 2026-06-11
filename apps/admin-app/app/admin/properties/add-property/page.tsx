"use client";

import { useState, useEffect } from "react";
import { AddPropertyForm } from "@repo/components/addPropertyForm";
import { useCreateProperty, useUser } from "@repo/query-hook";
import Loading from "../../loading";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export default function AddProperty() {
    const { data: user, isLoading } = useUser();
    const [isMounted, setIsMounted] = useState(false);
    const { mutate, isPending } = useCreateProperty();
    const queryClient = useQueryClient();
    const router = useRouter();

    // Ensure we only switch away from the loading state after the client has hydrated
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // 1. Show loading if we are server-rendering (!isMounted) OR fetching data (isLoading)
    if (!isMounted || isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loading />
            </div>
        );
    }

    // 2. Handle unauthorized state safely on the client
    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center p-8 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-800">
                    <p className="text-red-600 dark:text-red-400 font-bold">Unauthorized</p>
                    <p className="text-sm text-gray-500">Please log in as an admin to access this page.</p>
                </div>
            </div>
        );
    }

    const userRole = user?.role;
    const emptyState = {
        title: "",
        description: "",
        type: "sale" as 'rent' | 'sale',
        categoryId: "",
        negotiable:false,
        features:null,
        districtId: "",
        municipalityId: "",
        price: "",
        noOfBedRooms: "",
        noOfRestRooms: "",
        landArea: "",
        noOfFloors: "",
        propertyAge: "",
        facingDirection: "east",
        floorArea: "",
        roadSize: "",
        verified: false,
        locationId: "",
        floorLevel: "",
        tole: "",
        lat: null,
        lng: null,
        images: []
    }

    return (
        <div className="p-4">
            <AddPropertyForm user={userRole} initialData={emptyState} isLoading={isPending} onSubmit={(data: FormData) => mutate(data, {
                onSuccess: (data) => {
                    toast.success(data.message || "Property added successfully!!!");
                    queryClient.invalidateQueries({ queryKey: ["all-properties"] });
                    queryClient.invalidateQueries({ queryKey: ["zone"] });
                    // router.replace("/admin/properties")
                }
            })}  />
        </div>
    );
}