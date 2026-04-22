"use client";

import { Edit, Trash2, ShieldCheck, Clock, MapPin } from "lucide-react";

interface Listing {
  id: string;
  title: string;
  price: number;
  type: string;
  tole: string;
  verified: boolean;
  images: { url: string }[];
  category: { name: string };
}

export default function MyListingCard({ item }: { item: Listing }) {
  const mainImage = item.images?.[0]?.url || "/placeholder-property.jpg";

  return (
    <div className="group relative bg-white dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-800 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500">
      {/* Status Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {item.verified ? (
          <div className="flex items-center gap-1.5 bg-green-500/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
            <ShieldCheck size={14} />
            Verified
          </div>
        ) : (
          <div className="flex items-center gap-1.5 bg-gold/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
            <Clock size={14} />
            Pending Verification
          </div>
        )}
      </div>

      {/* Image Section */}
      <div className="aspect-[4/3] relative overflow-hidden bg-secondary-100">
        <img 
          src={`${process.env.NEXT_PUBLIC_BASE_URL}${mainImage}`} 
          alt={item.title} 
          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700" 
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            <p className="text-white text-xs font-medium uppercase tracking-wider opacity-90">
                {item.category.name} • {item.type}
            </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        <div className="flex justify-between items-start gap-2 mb-2">
            <h3 className="font-bold text-secondary-900 dark:text-white text-lg truncate flex-1">
                {item.title}
            </h3>
        </div>

        <div className="flex items-center gap-1 text-secondary-500 text-sm mb-4">
          <MapPin size={14} className="text-gold" />
          <span className="truncate">{item.tole}</span>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-secondary-100 dark:border-secondary-800">
          <div>
            <p className="text-[10px] text-secondary-400 uppercase font-bold tracking-tighter">Price</p>
            <span className="text-xl font-black text-secondary-900 dark:text-white">
                Rs. {item.price.toLocaleString()}
            </span>
          </div>
          
          <div className="flex gap-2">
            <button className="p-2.5 text-secondary-600 dark:text-secondary-400 bg-secondary-50 dark:bg-secondary-800 hover:bg-gold hover:text-white rounded-xl transition-all border border-transparent shadow-sm">
              <Edit size={18} />
            </button>
            <button className="p-2.5 text-secondary-600 dark:text-secondary-400 bg-secondary-50 dark:bg-secondary-800 hover:bg-red-500 hover:text-white rounded-xl transition-all border border-transparent shadow-sm" onClick={(e) => {
              e.stopPropagation();
            }}>
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}