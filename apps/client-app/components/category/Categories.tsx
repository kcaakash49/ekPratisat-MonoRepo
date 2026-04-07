import { prisma } from "@repo/database";
import CategoryCard from "./CategoryCard";
import Link from "next/link";

export async function Categories() {
    const categories = await prisma.category.findMany({
        select: {
            id: true,
            name: true,
            imageUrl: true,
        }
        });
    
    if (categories.length === 0) {
        return;
    }

    return (
         <div id="category-section" className="max-w-7xl mx-auto py-10 px-4">
            <div className="text-3xl font-bold pb-5 text-center">Browse Properties</div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {categories.map((item, index) => (
                    <Link href={item.id} key={index} className="w-full flex justify-center">
                        <CategoryCard img={item.imageUrl} type={item.name} />
                    </Link>
                ))}
            </div>
        </div>
    );
    
}