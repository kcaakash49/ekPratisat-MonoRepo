
import { getCachedCategories } from "../../data/categories";
import CategoryCard from "./CategoryCard";
import Link from "next/link";


export async function Categories() {
    const categories = await getCachedCategories();
    
    if (categories.length === 0) return null;

    return (
        <section id="category-section" className="bg-white dark:bg-secondary-900 py-16 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <span className="text-gold font-bold tracking-[0.2em] text-sm uppercase">Explore by Type</span>
                    <h2 className="text-secondary-900 dark:text-white text-3xl md:text-4xl font-black mt-2">
                        Browse <span className="text-gold">Properties</span>
                    </h2>
                    <div className="h-1 w-20 bg-gold-gradient mx-auto mt-4 rounded-full" />
                </div>

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