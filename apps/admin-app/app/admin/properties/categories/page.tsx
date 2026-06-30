"use client";

import { useGetCategories } from "@repo/query-hook";
import AnimateLoader from "@repo/ui/animateLoader";
import Image from "next/image";
import { useState } from "react";

const requirements = [
    {
        key: "isLandAreaNeeded",
        label: "Land Area",
    },
    {
        key: "isNoOfFloorsNeeded",
        label: "Number of Floors",
    },
    {
        key: "isNoOfRoomsNeeded",
        label: "Number of Rooms",
    },
    {
        key: "isAgeOfThePropertyNeeded",
        label: "Age of Property",
    },
    {
        key: "isNoOfRestRoomsNeeded",
        label: "Number of Rest Rooms",
    },
    {
        key: "isFacingDirectionNeeded",
        label: "Facing Direction",
    },
    {
        key: "isFloorAreaNeeded",
        label: "Floor Area",
    },
    {
        key: "isFloorLevelNeeded",
        label: "Floor Level",
    },
    {
        key: "isRoadSizeNeeded",
        label: "Road Size",
    },
];


export default function AllCategories() {
    const { data, isLoading, isError, error } = useGetCategories();

    const [openId, setOpenId] = useState<string | null>(null);


    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full min-h-[400px]">
                <AnimateLoader />
            </div>
        );
    }


    if (isError) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-500 font-medium">
                {error.message || "Try again later!!!"}
            </div>
        );
    }


    const categories = data?.result || [];


    return (
        <div className="p-6 space-y-5">

            <h1 className="text-2xl font-semibold">
                Categories
            </h1>


            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                {categories.map((category) => (

                    <div
                        key={category.id}
                        className="border rounded-xl overflow-hidden bg-white shadow-sm"
                    >

                        {/* Image */}
                        <div className="relative h-48 w-full bg-gray-100">

                            <Image
                                src={`${process.env.NEXT_PUBLIC_BASE_URL}${category.imageUrl}`}
                                alt={category.name}
                                fill
                                className="object-contain"
                            />

                        </div>


                        <div className="p-4 space-y-4">


                            <div className="flex justify-between items-center">

                                <h2 className="text-xl font-semibold capitalize">
                                    {category.name}
                                </h2>


                                <div className="flex gap-2">

                                    <button
                                        className="px-3 py-1 rounded-md bg-blue-500 text-white text-sm"
                                        onClick={() =>
                                            console.log("edit", category.id)
                                        }
                                    >
                                        Edit
                                    </button>


                                    <button
                                        className="px-3 py-1 rounded-md bg-red-500 text-white text-sm"
                                        onClick={() =>
                                            console.log("delete", category.id)
                                        }
                                    >
                                        Delete
                                    </button>

                                </div>

                            </div>



                            {/* Dropdown */}
                            <div>

                                <button
                                    className="w-full border rounded-md px-3 py-2 text-left"
                                    onClick={() =>
                                        setOpenId(
                                            openId === category.id
                                                ? null
                                                : category.id
                                        )
                                    }
                                >
                                    Property Requirements
                                </button>



                                {openId === category.id && (

                                    <div className="mt-3 border rounded-md p-3 space-y-2 bg-gray-50">

                                        {requirements
                                            .filter(
                                                (item) =>
                                                    category[
                                                        item.key as keyof typeof category
                                                    ]
                                            )
                                            .map((item) => (

                                                <div
                                                    key={item.key}
                                                    className="flex justify-between text-sm"
                                                >

                                                    <span>
                                                        {item.label}
                                                    </span>

                                                    <span className="text-green-600 font-medium">
                                                        Required
                                                    </span>

                                                </div>

                                            ))}



                                        {!requirements.some(
                                            (item) =>
                                                category[
                                                    item.key as keyof typeof category
                                                ]
                                        ) && (

                                            <p className="text-gray-500 text-sm">
                                                No additional fields required
                                            </p>

                                        )}

                                    </div>

                                )}

                            </div>


                        </div>

                    </div>

                ))}

            </div>

        </div>
    );
}