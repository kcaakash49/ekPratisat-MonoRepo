import { getCachedCategories } from "../../data/categories";
import CategoryCard from "./CategoryCard";
import SectionHeader from "../SectionHeader";
import Link from "next/link";


export async function Categories() {
    const categories = await getCachedCategories();

    if (categories.length === 0) return null;

    return (
        <section id="category-section" className="bg-[var(--ek-bg-card)] py-16 transition-colors duration-200 [content-visibility:auto] [contain-intrinsic-size:1px_760px] dark:bg-[var(--ek-dark-page)]">
            <div className="max-w-7xl mx-auto px-6">
                <SectionHeader
                    eyebrow="Explore by Type"
                    title="Browse"
                    accent="Properties"
                    variant="sm"
                />

                {/* Grid Layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {categories.map((item) => (
                        <Link
                          href={`/properties?c_id=${item.id}`}
                          key={item.id}
                          className="w-full transform transition-transform hover:-translate-y-1"
                        >
                            <CategoryCard img={item.imageUrl} type={item.name} />
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
