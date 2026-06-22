"use client";

import { AddPropertyForm } from "@repo/components/addPropertyForm";
import { useEditProperty, useFetchPropertyDetail, useUser } from "@repo/query-hook";
import PageLoading from "@repo/ui/pageloading";
import { PropertyFormdata } from "@repo/validators";
import { useQueryClient } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { revalidateTagPathAction } from "../../../../../actions/revalidateAction";


export default function EditPropertyPage() {
    const params = useParams();
    const queryClient = useQueryClient();
    const [isMounted, setIsMounted] = useState(false);
    const router = useRouter();

    const { mutate, isPending } = useEditProperty(params.id as string);
    const {
        data: property,
        isLoading,
        isError,
        error,
    } = useFetchPropertyDetail(params.id as string);
    const { data: user, isLoading: userLoading } = useUser();

    useEffect(() => {
        setIsMounted(true);
    }, []);


    if (isLoading || userLoading || !isMounted) {
        return (
            <div className="min-h-screen flex items-center justify-center"><PageLoading/></div>
        )
    };

    if (isError || !property) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-red-500">
                <AlertCircle size={48} className="mb-4" />
                <p className="text-lg font-bold">{error?.message || "Couldn't fetch property data"}</p>
            </div>
        );
    }

    const amenities = property.amenities ? property.amenities.map((amenity) => amenity.id) : [];

    const initialData: PropertyFormdata = {
        title: property.title,
        description: property.description,
        type: property.type,
        categoryId: property.category.id,
        districtId: property.location.municipality.district.id,
        municipalityId: property.location.municipality.id,
        locationId: property.location.id,
        price: property.price,
        tole: property.tole,
        lat: property.lat,
        lng: property.lng,
        features:property.features,
        negotiable:property.negotiable,
        noOfBedRooms: property.noOfBedRooms ? property.noOfBedRooms : "",
        noOfRestRooms: property.noOfRestRooms ? property.noOfRestRooms : "",
        landArea: property.landArea ? property.landArea : "",
        noOfFloors: property.noOfFloors ? property.noOfFloors : "",
        propertyAge: property.propertyAge ? property.propertyAge : "",
        facingDirection: property.facingDirection ? property.facingDirection : "",
        floorArea: property.floorArea ? property.floorArea : "",
        roadSize: property.roadSize ? property.roadSize : "",
        floorLevel: property.floorLevel ? property.floorLevel : "",
        verified: property.verified,
        images: property.images,
        amenities
    }

    const userRole = user.role;

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 animate-in fade-in duration-500">

            <AddPropertyForm initialData={initialData} onSubmit={(data: FormData) => mutate(data, {
                onSuccess: async(data) => {
                    toast.success(data.message || "Update successful");
                    queryClient.invalidateQueries({
                        queryKey: ["property-detail", params.id]
                    });
                    await revalidateTagPathAction({tag:["properties",`listings-${user.id}`,"favourite"]});
                    router.replace(`/user/my-listings`)
                    
                }
            })} isEditing={true} isLoading={isPending} user={userRole} />
        </div>
    )
}
