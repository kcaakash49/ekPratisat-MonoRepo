import { jwtVerify } from "jose";
import { Clock, RefreshCw } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import MyListingCard from "../../../../components/user-related/MyListingCard";
import Pagination from "../../../../components/properties/Pagination";
import Link from "next/link";


const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export default async function MyListingPage({
    searchParams,
}: {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
    const sp = await searchParams;
    const page = Number(sp.page || 1);
    const pageSize = Number(sp.pageSize || 12);
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) redirect("/auth/signin");
    let userId;
    try {
        // 1. Verify Token
        const { payload } = await jwtVerify(token, SECRET);
        userId = payload.userId;
    } catch (err) {
        redirect("/auth/signin");
    }

    // 2. Fetch Data
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/listing/my-listings?pageSize=${pageSize}&page=${page}`, {
        headers: { 'Cookie': cookieStore.toString() },
        next: { tags: [`listings-${userId}`, `listings-${userId}-p${page}`] },
        cache: 'force-cache'
    });

   
    // 3. Check for specific status codes (like 401/403)
    if (res.status === 401) redirect("/auth/signin");

    if (!res.ok) {
        // This is where you return the "Failed" UI instead of throwing
        // Inside your (!res.ok) block
        return (
            <div className="max-w-7xl mx-auto px-4 py-20">
                <div className="flex flex-col items-center justify-center bg-white dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-800 rounded-3xl p-12 shadow-xl shadow-secondary-200/50 dark:shadow-none text-center">
                    {/* Animated or Pulsing Error Icon */}
                    <div className="relative mb-6">
                        <div className="absolute inset-0 bg-red-100 dark:bg-red-900/20 rounded-full animate-ping opacity-25"></div>
                        <div className="relative w-20 h-20 bg-red-50 dark:bg-red-900/30 rounded-full flex items-center justify-center border border-red-100 dark:border-red-800">
                            <svg
                                className="w-10 h-10 text-red-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                    </div>

                    <h2 className="text-2xl font-black text-secondary-900 dark:text-white mb-2">
                        Unable to load your listings
                    </h2>
                    <p className="text-secondary-500 max-w-sm mx-auto mb-8 font-medium">
                        Our servers are having a moment. Don't worry, your property data is safe—we just can't reach it right now.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            href="/user/my-listings"
                            className="bg-gold-gradient text-white px-8 py-3 rounded-xl font-bold shadow-gold-sm hover:shadow-gold transition-all flex items-center gap-2"
                        >
                            <RefreshCw size={18} />
                            Try Again
                        </Link>

                        <Link
                            href="/contact"
                            className="px-8 py-3 rounded-xl font-bold text-secondary-600 dark:text-secondary-400 border border-secondary-200 dark:border-secondary-700 hover:bg-secondary-50 dark:hover:bg-secondary-800 transition-all"
                        >
                            Contact Support
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const data = await res.json();
    const listings = data.listing;
    const meta = data.meta;

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 min-h-screen">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
                <div>
                    <h1 className="text-4xl font-black text-secondary-900 dark:text-white tracking-tight">
                        My <span className="text-gold">Properties</span>
                    </h1>
                    <p className="text-secondary-500 font-medium mt-2">
                        Total {meta.total} listings found
                    </p>
                </div>
                <Link
                    href="/user/add-property"
                    className="bg-gold-gradient text-white px-8 py-4 rounded-2xl font-bold shadow-gold-sm hover:shadow-gold transition-all active:scale-95 inline-block"
                >
                    + Post New Property
                </Link>
            </header>

            {listings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 bg-secondary-50 dark:bg-secondary-900/50 rounded-3xl border-2 border-dashed border-secondary-200 dark:border-secondary-800">
                    <div className="w-20 h-20 bg-secondary-100 dark:bg-secondary-800 rounded-full flex items-center justify-center mb-4">
                        <Clock size={32} className="text-secondary-400" />
                    </div>
                    <h2 className="text-xl font-bold text-secondary-900 dark:text-white">No Properties Found</h2>
                    <p className="text-secondary-500 mt-1">Start by adding your first property listing.</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {listings.map((item: any) => (
                            item.verified ? (
                                <Link
                                    href={`/properties/${item.id}`}
                                    key={item.id}
                                    className="transition-transform duration-300 hover:-translate-y-2 block"
                                >
                                    <MyListingCard item={item} />
                                </Link>
                            ) : (
                                <div
                                    key={item.id}
                                    className="relative group cursor-not-allowed"
                                >
                                    {/* Visual indicator that it's pending */}
                                    <div className="opacity-60 grayscale-[0.5] transition-all">
                                        <MyListingCard item={item} />
                                    </div>

                                    {/* CSS-only Tooltip (Works on Server Components) */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                        <div className="bg-secondary-900/90 text-white text-xs py-2 px-4 rounded-lg border border-gold/30 shadow-xl backdrop-blur-sm">
                                            Verification Pending — Access Restricted
                                        </div>
                                    </div>

                                    {/* Optional: A small "Pending" badge over the image */}
                                    <div className="absolute top-4 right-4 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-lg">
                                        PENDING
                                    </div>
                                </div>
                            )
                        ))}
                    </div>

                    <Pagination
                        totalPages={meta.totalPages}
                        currentPage={page}
                    />
                </>
            )}
        </div>
    );


}