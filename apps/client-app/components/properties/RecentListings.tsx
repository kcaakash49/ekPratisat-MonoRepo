import Link from "next/link";
import { getPropertiesQuery } from "../../data/properties";
import ListingCard from "./ListingCard";

export default async function RecentListings() {
    const response = await getPropertiesQuery({});
    const listings = response.items.slice(0, 6);

    return (
        <section className="bg-secondary-50 dark:bg-secondary-800 py-16 md:py-24 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6">
                
                {/* Centered Header Section */}
                <div className="text-center mb-16">
                    <span className="text-gold font-bold tracking-[0.3em] text-xs md:text-sm uppercase">
                        Handpicked for you
                    </span>
                    <h2 className="text-secondary-900 dark:text-white text-3xl md:text-5xl font-black mt-3">
                        Recent <span className="text-gold">Listings</span>
                    </h2>
                    {/* Decorative gold line to match Categories */}
                    <div className="h-1 w-24 bg-gold-gradient mx-auto mt-6 rounded-full shadow-sm" />
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {listings.map((item: any) => (
                        <Link 
                            key={item.id} 
                            href={`/listing/${item.id}`} 
                            className="transition-transform duration-300 hover:-translate-y-2"
                        >
                            <ListingCard listing={item} />
                        </Link>
                    ))}
                </div>

                {/* Bottom Centered Button */}
                <div className="mt-16 text-center">
                    <Link 
                        href="/properties" 
                        className="inline-flex items-center gap-3 px-10 py-4 bg-secondary-900 dark:bg-secondary-800 text-white font-bold rounded-full hover:bg-gold-gradient transition-all duration-300 shadow-xl group border border-secondary-800 dark:border-secondary-700 hover:border-transparent"
                    >
                        View All Properties
                        <span className="group-hover:translate-x-2 transition-transform duration-300 text-gold group-hover:text-white">
                            →
                        </span>
                    </Link>
                </div>
            </div>
        </section>
    );
}