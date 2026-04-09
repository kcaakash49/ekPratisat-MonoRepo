import { Prisma, prisma } from "@repo/database"
import { unstable_cache } from "next/cache";

type Input = {
    page?: number;
    pageSize?: number;
    q?: string;
}

export const _getProperties = async (input: Input) => {
    console.log("Fetching properties with input:", input, "at", new Date().toISOString());
    const page = Math.max(1, Number(input.page || 1));
    const pageSize = Math.min(100, Math.max(1, Number(input.pageSize || 12)));
    const q = input.q?.trim();

    const where: Prisma.PropertyWhereInput = q
        ? {
            OR: [
                { title: { contains: q, mode: "insensitive" } },
                { description: { contains: q, mode: "insensitive" } },
                { isActive: true }
            ],
        }
        : {isActive: true};

    const [items, total] = await Promise.all([
        prisma.property.findMany({
            where,
            select: {
                id: true,
                title: true,
                price: true,
                type: true,
                noOfBedRooms: true,
                noOfFloors: true,
                noOfRestRooms: true,
                landArea: true,
                floorArea: true,
                tole: true,
                category: {
                    select: {
                        name: true,
                    }
                },
                images: {
                    select: {
                        url: true,
                    },
                    take: 1,
                },
                createdAt: true,
            },
            skip: (page - 1) * pageSize,
            take: pageSize,
            orderBy: { createdAt: "desc" },
        }),
        prisma.property.count({ where }),
    ]);

    return {
        items,
        meta: {
            total,
            page,
            pageSize,
            totalPages: Math.max(1, Math.ceil(total / pageSize)),
        },
    };
}

export const getPropertiesQuery = async (input: Input) => {
    const normalizedInput = {
        page: Math.max(1, Number(input.page || 1)),
        pageSize: Math.min(100, Math.max(1, Number(input.pageSize || 12))),
        q: input.q || "",
    };
    return unstable_cache(
        () => _getProperties(normalizedInput),
        ['properties', String(normalizedInput.page), String(normalizedInput.pageSize), String(normalizedInput.q)],
        { tags: ['properties'], revalidate: 3600 }
    )();
}

