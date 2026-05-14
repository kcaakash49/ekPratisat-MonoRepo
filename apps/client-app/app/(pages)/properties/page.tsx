
import Link from "next/link";
import { getPropertiesQuery } from "../../../data/properties";
import PropertySearchBar from "../../../components/properties/PropertySearchBar";
import { getCachedCategories } from "../../../data/categories";
import Pagination from "../../../components/properties/Pagination";
import { PropertyListing } from "@repo/validators";
import PremiumListingCard from "../../../components/properties/FeaturedListingCard";

export default async function Properties({
    searchParams,
}: {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
    const sp = await searchParams;

    const page = Number(sp.page || 1);
    const q = typeof sp.q === "string" ? sp.q : "";
    const c_id = typeof sp.c_id === "string" ? sp.c_id : "";
    const type = typeof sp.type === "string" ? sp.type : "";
   const isFeatured = sp.isFeatured === "true";

    const categories = await getCachedCategories();
    const data = await getPropertiesQuery({ page, pageSize: 21, q, c_id, type,isFeatured });


    if (!data.items.length) {
        return (
            /* --- BEAUTIFUL EMPTY STATE (Server Side) --- */
            <div className="flex flex-col items-center justify-center bg-[var(--ek-bg-main)] py-20 text-center animate-in fade-in slide-in-from-bottom-4 duration-700 dark:bg-[var(--ek-dark-page)]">
                <div className="relative mb-6">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[var(--ek-bg-card-soft)] text-4xl dark:bg-[var(--ek-dark-surface)]">
                        🏙️
                    </div>
                    <div className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-full border-4 border-[var(--ek-bg-main)] bg-gold-gradient shadow-lg dark:border-[var(--ek-dark-page)]">
                        <span className="text-xs font-bold text-[#151006]">?</span>
                    </div>
                </div>

                <h2 className="text-2xl md:text-3xl font-black text-[var(--ek-text-primary)] dark:text-[var(--ek-dark-text)] uppercase tracking-tight">
                    No Matches <span className="text-[var(--ek-gold-text)] dark:text-[var(--ek-dark-gold)]">Found</span>
                </h2>

                <p className="mt-4 max-w-md text-[var(--ek-text-muted)] dark:text-[var(--ek-dark-muted)] leading-relaxed">
                    We couldn&apos;t find any properties matching your current filters {q && <span>for <span className="text-[var(--ek-gold-text)] font-bold dark:text-[var(--ek-dark-gold)]">&quot;{q}&quot;</span></span>}.
                    Try broadening your criteria or resetting the filters.
                </p>

                <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                    {/* This link effectively "Refreshes" the search by clearing the URL */}
                    <Link
                        href="/properties"
                        className="rounded-full bg-gold-gradient px-10 py-4 font-bold text-[#151006] shadow-sm shadow-gold-800/15 transition-transform hover:-translate-y-0.5 hover:bg-gold-gradient-hover active:translate-y-0"
                    >
                        Clear All Filters
                    </Link>

                    <Link
                        href="/"
                        className="rounded-full border border-[var(--ek-border-soft)] px-10 py-4 font-bold text-[var(--ek-text-primary)] transition-colors hover:border-[var(--ek-border-strong)] hover:bg-[var(--ek-bg-card)] dark:border-[var(--ek-dark-border)] dark:text-[var(--ek-dark-text)] dark:hover:border-[var(--ek-dark-border-strong)] dark:hover:bg-[var(--ek-dark-surface)]"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    const listings = data.items;
    const { totalPages, page: currentPage } = data.meta;

    return (
        <main className="min-h-screen bg-[var(--ek-bg-main)] dark:bg-[var(--ek-dark-page)]">

            {/* Banner Section with Gold Gradient */}
            <div className="relative flex h-60 items-center justify-center bg-[var(--ek-text-primary)] dark:bg-[var(--ek-dark-page)]">
                <div className="absolute inset-0 bg-[url('/marketing/texture-cubes.png')] bg-repeat opacity-80 dark:opacity-30" />
                <h1 className="text-4xl font-black text-white z-10">Properties</h1>
            </div>

            {/* Search Bar overlaps the banner slightly with -mt-10 */}
            <PropertySearchBar categories={categories} />
            {/* Grid Layout */}
            <div className="max-w-7xl mx-auto px-6 pb-20">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {listings.map((item: PropertyListing) => (
                        <Link
                            key={item.id}
                            href={`/properties/${item.id}`}
                            className="block transition-transform duration-300 hover:-translate-y-1"
                        >
                            <PremiumListingCard listing={item} />
                        </Link>
                    ))}
                </div>
                <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                />
            </div>


        </main>

    );
}
