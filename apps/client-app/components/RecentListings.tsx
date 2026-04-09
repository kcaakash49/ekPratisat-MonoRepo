import Link from "next/link";
import { getPropertiesQuery } from "../data/properties";
import ListingCard from "./ListingCard";

export default async function RecentListings() {
    const response = await getPropertiesQuery({ page: 1, pageSize: 20, q: "" });
    const listings = response.items.slice(0, 6);

    return (
        <section className="bg-secondary-100 dark:bg-secondary-800 py-20 shadow-2xl">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                    <div>
                        <span className="text-gold font-bold tracking-[0.2em] text-sm uppercase">Handpicked for you</span>
                        <h2 className="text-secondary-900 dark:text-white text-3xl md:text-4xl font-black mt-2">
                           Recent <span className="text-gold">Listings</span>
                        </h2>
                    </div>
                    <Link href="/properties" className="text-secondary-600 dark:text-secondary-400 font-bold hover:text-gold transition-colors flex items-center gap-2">
                        View All Properties <span>→</span>
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {listings.map((item: any) => (
                        <a key={item.id} href={`/listing/${item.id}`} className="block">
                            <ListingCard listing={item} />
                        </a>
                    ))}
                </div>
            </div>
        </section>
    )
}