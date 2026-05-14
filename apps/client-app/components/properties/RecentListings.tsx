import Link from "next/link";
import { getPropertiesQuery } from "../../data/properties";
import { PropertyListing } from "@repo/validators";
import PremiumListingCard from "./FeaturedListingCard";

export default async function RecentListings() {
    const response = await getPropertiesQuery({});

    if (response.items.length === 0) return null;

    const listings = response.items.slice(0, 6);

    return (
        <section className="bg-[var(--ek-bg-section)] py-16 transition-colors duration-200 dark:bg-[var(--ek-dark-section)] md:py-24">
            <div className="max-w-7xl mx-auto px-6">

                {/* Centered Header Section */}
                <div className="text-center mb-16">
                    <span className="text-[var(--ek-gold-text)] font-bold tracking-[0.3em] text-xs md:text-sm uppercase dark:text-[var(--ek-dark-gold)]">
                        Handpicked for you
                    </span>
                    <h2 className="text-[var(--ek-text-primary)] dark:text-[var(--ek-dark-text)] text-3xl md:text-5xl font-black mt-3">
                        Recent <span className="text-[var(--ek-gold-text)] dark:text-[var(--ek-dark-gold)]">Listings</span>
                    </h2>
                    {/* Decorative gold line to match Categories */}
                    <div className="h-1 w-24 bg-gold-gradient mx-auto mt-6 rounded-full shadow-sm" />
                </div>

                {/* Grid Layout */}
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

                {/* Bottom Centered Button */}
                <div className="mt-16 text-center">
                    <Link
                        href="/properties"
                        className="ek-secondary-button group gap-3 rounded-full px-10 py-4"
                    >
                        View All Properties
                        <span className="text-[var(--ek-gold-text)] transition-transform duration-300 group-hover:translate-x-1 dark:text-[var(--ek-dark-gold)]">
                            →
                        </span>
                    </Link>
                </div>
            </div>
        </section>
    );
}
