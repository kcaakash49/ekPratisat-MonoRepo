
import { Calendar, CheckCircle2, MapPin, MoreVertical, ShieldCheck, Star, XCircle } from "lucide-react";
import Link from "next/link";


type SaleType = "rent" | "sale"
export interface PropertyListing {
    id: string;
    title: string;
    type: SaleType; // "rent" | "saler"
    verified: boolean;
    isFeatured: boolean;
    tole: string;
    createdAt: Date | string; // Date if coming from server, string if via JSON API

    // Nested Location Data
    location: {
        name: string; // The Ward name (usually a number)
        municipality: {
            name: string;
            district: {
                name: string;
            };
        };
    };

    // Nested Category Data
    category: {
        name: string;
    };
}

export default function ListingTable({ listings }: { listings: PropertyListing[] }) {
    return (
        <div className="w-full max-w-7xl mx-auto px-4">
            {/* Desktop View */}
            <div className="hidden md:block overflow-hidden bg-white dark:bg-secondary-800 rounded-2xl border border-secondary-200 dark:border-secondary-700 shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-secondary-50 dark:bg-secondary-900/50 text-secondary-500 uppercase text-[10px] font-black tracking-widest">
                        <tr>
                            <th className="px-6 py-4">Property</th>
                            <th className="px-6 py-4">Location</th>
                            <th className="px-6 py-4">Category / Type</th>
                            <th className="px-6 py-4">Status</th>

                        </tr>
                    </thead>
                    <tbody className="divide-y divide-secondary-100 dark:divide-secondary-700">
                        {listings.map((item) => (
                            <tr key={item.id} className="hover:bg-secondary-50 dark:hover:bg-secondary-900/30 transition-colors group">
                                <td className={`px-6 py-4 transition-colors ${item.isFeatured ? "bg-gold/5" : ""}`}>
                                    <div className="flex flex-col gap-0.5">
                                        <Link href={`/admin/properties/${item.id}`} className="flex items-center gap-2">
                                            {item.isFeatured && (
                                                <Star
                                                    size={14}
                                                    className="text-gold fill-gold shrink-0"
                                                />
                                            )}
                                            <span className={`font-bold line-clamp-1 ${item.isFeatured
                                                    ? "text-gold dark:text-gold"
                                                    : "text-secondary-900 dark:text-white"
                                                }`}>
                                                {item.title}
                                            </span>
                                        </Link>

                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] text-secondary-400 font-medium">
                                                Added {new Date(item.createdAt).toLocaleDateString()}
                                            </span>
                                            {item.isFeatured && (
                                                <span className="text-[9px] font-black bg-gold/10 text-gold px-1.5 py-0.5 rounded uppercase tracking-tighter">
                                                    Featured
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-start gap-1 text-sm text-secondary-600 dark:text-secondary-400">
                                        <MapPin size={14} className="mt-0.5 text-gold shrink-0" />
                                        <span>
                                            {item.tole}, Ward {item.location.name}, {item.location.municipality.name}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs font-bold uppercase text-gold">{item.category.name}</span>
                                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md w-fit ${item.type === 'rent' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                                            }`}>
                                            For {item.type}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {item.verified ? (
                                        <div className="flex items-center gap-1.5 text-emerald-500 text-sm font-medium">
                                            <ShieldCheck size={16} /> Verified
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1.5 text-secondary-400 text-sm font-medium">
                                            <XCircle size={16} /> Pending
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile View (Card Layout) */}
            <div className="md:hidden flex flex-col gap-4">
                {listings.map((item) => (
                    <div key={item.id} className="bg-white dark:bg-secondary-800 p-5 rounded-2xl border border-secondary-200 dark:border-secondary-700 shadow-sm relative overflow-hidden">
                        {item.isFeatured && <div className="absolute top-0 right-0 bg-gold text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg">FEATURED</div>}

                        <div className="flex flex-col gap-3">
                            <div>
                                <h3 className="font-bold text-secondary-900 dark:text-white leading-tight">{item.title}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] font-black text-gold uppercase">{item.category.name}</span>
                                    <span className="text-secondary-300">•</span>
                                    <span className="text-[10px] font-bold text-secondary-400 uppercase">For {item.type}</span>
                                </div>
                            </div>

                            <div className="flex items-start gap-2 text-sm text-secondary-500 dark:text-secondary-400 bg-secondary-50 dark:bg-secondary-900/50 p-3 rounded-xl">
                                <MapPin size={16} className="text-gold shrink-0 mt-0.5" />
                                <span>{item.tole}, {item.location.municipality.name}, {item.location.municipality.district.name}</span>
                            </div>

                            <div className="flex items-center justify-between mt-2 pt-3 border-t border-secondary-100 dark:border-secondary-700">
                                <div className="flex items-center gap-1 text-[10px] text-secondary-400 font-bold uppercase">
                                    <Calendar size={12} />
                                    {new Date(item.createdAt).toLocaleDateString()}
                                </div>
                                <Link href={`/admin/properties/${item.id}`} className="text-sm font-bold text-gold hover:underline">View Details</Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}