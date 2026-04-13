import { prisma } from "@repo/database";

import { notFound } from "next/navigation";
import { PropertyDetailClient } from "../../../../components/properties/PropertyDetailClient";
import PropertyInfo from "../../../../components/properties/PropertyInfo";
import RelatedProperties from "../../../../components/properties/RelatedProperties";


export default async function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const param = await params;

    const result = await prisma.property.findUnique({
        where: {
            id: param.id,
            isActive: true,
            verified: true
        },
        select: {
            id: true,
            title: true,
            description: true,
            price: true,
            type: true,
            category: {
                select: {
                    id:true,
                    name: true
                }
            },
            isFeatured: true,
            noOfBedRooms: true,
            noOfRestRooms: true,
            landArea: true,
            noOfFloors: true,
            propertyAge: true,
            facingDirection: true,
            floorArea: true,
            roadSize: true,
            floorLevel: true,
            tole: true,
            createdAt: true,
            images: {
                select: {
                    url: true
                }
            },
            location: {
                select: {
                    name: true,
                    municipality: {
                        select: {
                            name: true,
                            district: {
                                select: {
                                    name: true
                                }
                            }
                        }
                    }
                }
            }

        }

    })
    if (!result) return notFound();

    return (
        <>
            <PropertyDetailClient property={result} />
            <PropertyInfo property={result} />
            <RelatedProperties categoryId={result.category.id} categoryName={result.category.name} currentPropertyId={result.id} type={result.type}/>
        </>
    )

}