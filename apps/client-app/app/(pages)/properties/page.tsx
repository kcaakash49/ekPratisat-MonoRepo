
import Link from "next/link";
import { getPropertiesQuery } from "../../../data/properties";
import ListingCard from "../../../components/properties/ListingCard";
import PropertySearchBar from "../../../components/properties/PropertySearchBar";
import { getCachedCategories } from "../../../data/categories";
import Pagination from "../../../components/properties/Pagination";
import { PropertyListing } from "@repo/validators";

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
            <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="relative mb-6">
                    <div className="h-24 w-24 rounded-full bg-secondary-100 dark:bg-secondary-800 flex items-center justify-center text-4xl">
                        🏙️
                    </div>
                    <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full bg-gold-gradient flex items-center justify-center shadow-lg border-4 border-white dark:border-secondary-900">
                        <span className="text-white text-xs font-bold">?</span>
                    </div>
                </div>

                <h2 className="text-2xl md:text-3xl font-black text-secondary-900 dark:text-white uppercase tracking-tight">
                    No Matches <span className="text-gold">Found</span>
                </h2>

                <p className="mt-4 max-w-md text-secondary-500 dark:text-secondary-400 leading-relaxed">
                    We couldn't find any properties matching your current filters {q && <span>for <span className="text-gold font-bold">"{q}"</span></span>}.
                    Try broadening your criteria or resetting the filters.
                </p>

                <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                    {/* This link effectively "Refreshes" the search by clearing the URL */}
                    <Link
                        href="/properties"
                        className="px-10 py-4 bg-secondary-900 dark:bg-black text-white rounded-full font-bold hover:bg-gold-gradient transition-all shadow-xl active:scale-95"
                    >
                        Clear All Filters
                    </Link>

                    <Link
                        href="/"
                        className="px-10 py-4 border border-secondary-200 dark:border-secondary-700 text-secondary-900 dark:text-white rounded-full font-bold hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-all"
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
        <main className="min-h-screen">

            {/* Banner Section with Gold Gradient */}
            <div className="h-60 bg-secondary-900 flex items-center justify-center relative">
                <div className="absolute inset-0 opacity-80 dark:opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat" />
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
                            className="transition-transform duration-300 hover:-translate-y-2"
                        >
                            <ListingCard listing={item} />
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