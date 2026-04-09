
import Link from "next/link";
import { getPropertiesQuery } from "../../../data/properties";
import ListingCard from "../../../components/ListingCard";

export default async function Properties({
    searchParams,
}: {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
    const sp = await searchParams;

    const page = Number(sp.page || 1);
    const q = typeof sp.q === "string" ? sp.q : "";

    const data = await getPropertiesQuery({ page, pageSize: 20, q });
    console.log("hey");

    if (!data.items.length) {
        return (
            <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-semibold">Properties</h1>
                        <p className="text-sm text-muted-foreground">
                            Total: {data.meta.total}
                        </p>
                    </div>
                </div>

                {/* Empty State */}
                <div className="mt-16 flex flex-col items-center justify-center rounded-2xl border border-dashed p-12 text-center">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                        📷
                    </div>

                    <h2 className="text-lg font-semibold">No Properties yet</h2>

                    <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                        Start organizing your properties by creating your first property. It’s a great way to keep track of your listings and manage your real estate portfolio effectively.
                    </p>

                    <Link
                        href="#"
                        className="mt-6 rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white hover:opacity-90 transition"
                    >
                        Create your first Property
                    </Link>
                </div>
            </div>
        );
    }

    const listings = data.items;

    return (
              <div className="max-w-7xl mx-auto p-6">
                
                {/* Centered Header Section */}
                <div className="text-center mb-16">
                    <span className="text-gold font-bold tracking-[0.3em] text-xs md:text-sm uppercase">
                        Handpicked for you
                    </span>
                    <h2 className="text-secondary-900 dark:text-white text-3xl md:text-5xl font-black mt-3">
                        Listed <span className="text-gold">Properties</span>
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

        </div>
        
    );
}