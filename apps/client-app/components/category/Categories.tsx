import { getCachedCategories } from "../../data/categories";
import CategoryCard from "./CategoryCard";
import SectionHeader from "../SectionHeader";
import Link from "next/link";


export async function Categories() {
    const categories = await getCachedCategories();

    if (categories.length === 0) return null;

    return (
        <section id="category-section" className="bg-[var(--ek-bg-card)] py-16 transition-colors duration-200 [content-visibility:auto] [contain-intrinsic-size:1px_760px] dark:bg-[var(--ek-dark-page)]">
            <div className="max-w-[1500px] mx-auto px-6">
                <SectionHeader
                    eyebrow="Explore by Type"
                    title="Browse"
                    accent="Properties"
                    variant="sm"
                />

                {/*
                  Mobile (<sm): horizontal scroll strip — fixed-width cards in
                  one swipeable row, so the full category name fits on one line
                  and the section stays one card tall (no long vertical scroll
                  past 8 cards before Recent Listings).
                  sm and up: the original responsive grid, unchanged.
                */}
                <div className="relative -mx-6 sm:mx-0">
                <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 scroll-px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 sm:scroll-px-0 md:grid-cols-3 lg:grid-cols-4">
                    {categories.map((item) => (
                        <Link
                          href={`/properties?c_id=${item.id}`}
                          key={item.id}
                          className="w-[230px] shrink-0 snap-start transform transition-transform hover:-translate-y-1 sm:w-full sm:shrink"
                        >
                            <CategoryCard img={item.imageUrl} type={item.name} />
                        </Link>
                    ))}
                </div>
                {/* Subtle right-edge fade — mobile-only "swipe for more" hint.
                    sm:hidden, so it has zero effect on the grid at >=640. */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[var(--ek-bg-card)] to-transparent dark:from-[var(--ek-dark-page)] sm:hidden"
                />
                </div>
            </div>
        </section>
    );
}
