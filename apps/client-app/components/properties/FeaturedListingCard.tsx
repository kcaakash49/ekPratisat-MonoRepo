

import Image from "next/image";
import { Bed, Bath, Maximize, MapPin, Crown, Sparkles, TrendingUp, Award } from "lucide-react";
import { PropertyListing } from "@repo/validators";


export default function PremiumListingCard({ listing }: { listing: PropertyListing }) {

  const formattedPrice = new Intl.NumberFormat('en-IN').format(Number(listing.price));

  // Premium features based on actual data
  const premiumFeatures = [
    listing.noOfBedRooms ? `${listing.noOfBedRooms} Beds` : null,
    listing.noOfRestRooms ? `${listing.noOfRestRooms} Baths` : null,
    listing.landArea ? `${listing.landArea} sq.ft` : null,
    "Verified Property"
  ].filter(Boolean);

  return (
    <div
      className="group relative w-full h-full"
    >
      {/* Premium Glow Effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-gold via-gold-light to-gold rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition duration-500"></div>

      {/* Main Card - Fixed height container */}
      <div className="relative bg-gradient-to-br from-white via-white to-gold-50 dark:from-secondary-800 dark:via-secondary-800 dark:to-gold-900/10 rounded-2xl overflow-hidden shadow-lg hover:shadow-3xl transition-all duration-500 border-2 border-gold/30 dark:border-gold/20 h-full flex flex-col">

        {/* Premium Ribbon Banner - Pure CSS Ribbon */}
        {listing.isFeatured && (
          <div className="absolute top-0 right-0 z-20">
            <div className="relative">
              {/* Ribbon tail */}
              <div className="absolute -left-4 bottom-0 w-4 h-8 bg-gold-dark/80 clip-path-triangle"></div>
              {/* Main ribbon */}
              <div className=" bg-gold-gradient text-white px-6 py-2 shadow-lg relative">
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4" />
                  <span className="text-xs font-bold tracking-wider">PREMIUM</span>
                  <Sparkles className="w-3 h-3" />
                </div>
              </div>
              {/* Ribbon fold effect */}
              <div className="absolute -bottom-2 right-2 w-0 h-0 border-l-[8px] border-l-transparent border-t-[8px] border-t-gold-dark"></div>
            </div>
          </div>

        )}

        {/* Verified Badge */}
        {listing.isFeatured && (
          <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
            <div className="bg-black/70 backdrop-blur-md rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-lg">
              <Award className="w-3.5 h-3.5 text-gold" />
              <span className="text-white text-xs font-semibold">Premium Pick</span>
            </div>
          </div>

        )}

        {/* Image Section - Fixed height */}
        <div className="relative h-56 w-full overflow-hidden flex-shrink-0">
          {/* Premium Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10"></div>

          {listing.images?.[0]?.url ? (
            <Image
              src={`${process.env.NEXT_PUBLIC_BASE_URL}${listing.images[0].url}`}
              alt={listing.title}
              fill
              className={`object-cover transition-transform duration-700 transform-gpu hover:scale-110}`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gold-100 to-gold-200 dark:from-gold-900/20 dark:to-gold-800/10 flex items-center justify-center">
              <Crown className="w-16 h-16 text-gold/40" />
            </div>
          )}

          {/* Premium Price Badge */}
          <div className="absolute bottom-3 left-3 z-20">
            <div className="bg-gradient-to-r from-gold to-gold-dark text-white px-4 py-1.5 rounded-lg shadow-2xl transform transition-transform group-hover:scale-105">
              <div className="text-xs font-semibold opacity-90">Price</div>
              <div className="text-lg font-bold">Rs. {formattedPrice}{listing.type === "rent" ? <span className="text-xs">/mo</span> : ""}</div>
            </div>
          </div>

          {/* Trending Badge */}
          <div className="absolute bottom-3 right-3 z-20">
            <div className="bg-black/60 backdrop-blur-md rounded-lg px-2.5 py-1.5">
              <div className="flex items-center gap-1 text-white text-xs">
                <TrendingUp className="w-3 h-3 text-gold" />
                <span>High Demand</span>
              </div>
            </div>
          </div>
        </div>

        {/* Info Section - Flexible content with consistent spacing */}
        <div className="p-5 flex-1 flex flex-col">
          {/* Location */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-gold group-hover:text-gold-dark transition-colors">
              <MapPin size={14} className="text-gold" />
              <span className="text-xs font-semibold uppercase tracking-wider line-clamp-1">
                {listing.tole || "Premium Location"}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-gold" />
              <span className="text-[10px] font-semibold text-gold uppercase tracking-wider">{listing.category.name}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-secondary-900 dark:text-white text-lg font-bold line-clamp-1 group-hover:text-gold transition-colors duration-300 mb-3">
            {listing.title}
          </h3>

          {/* Premium Features Chips */}
          <div className="flex flex-wrap gap-2 mb-4">
            {premiumFeatures.slice(0, 3).map((feature, idx) => (
              <div key={idx} className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-gold/10 dark:bg-gold/20 text-xs text-secondary-700 dark:text-secondary-300">
                <div className="w-1 h-1 rounded-full bg-gold"></div>
                <span>{feature}</span>
              </div>
            ))}
          </div>

          {/* Features Row - Compact */}
          <div className="flex items-center justify-between pt-3 mt-auto border-t border-gold/20 dark:border-gold/10">
            <div className="flex items-center gap-4">
              {listing.noOfBedRooms && (
                <div className="flex items-center gap-1.5">
                  <div className="p-1 rounded bg-gold/10">
                    <Bed size={14} className="text-gold" />
                  </div>
                  <span className="text-xs font-semibold text-secondary-900 dark:text-white">{listing.noOfBedRooms}</span>
                </div>
              )}

              {listing.noOfRestRooms && (
                <div className="flex items-center gap-1.5">
                  <div className="p-1 rounded bg-gold/10">
                    <Bath size={14} className="text-gold" />
                  </div>
                  <span className="text-xs font-semibold text-secondary-900 dark:text-white">{listing.noOfRestRooms}</span>
                </div>
              )}

              {listing.landArea && (
                <div className="flex items-center gap-1.5">
                  <div className="p-1 rounded bg-gold/10">
                    <Maximize size={14} className="text-gold" />
                  </div>
                  <span className="text-xs font-semibold text-secondary-900 dark:text-white">{listing.landArea}</span>
                </div>
              )}
            </div>

            {/* Type Badge */}
            <div className="bg-gradient-to-r from-gold/20 to-gold/10 dark:from-gold/20 dark:to-gold/5 rounded-full px-2.5 py-1">
              <div className="text-[10px] font-bold text-gold uppercase tracking-wider flex items-center gap-1">
                <Crown className="w-2.5 h-2.5" />
                {listing.type}
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <button className="w-full mt-4 py-2.5 rounded-lg bg-gold-gradient text-white font-semibold text-sm hover:shadow-lg hover:shadow-gold/20 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group/btn">
            <span>View Details</span>
            <Sparkles className="w-3.5 h-3.5 group-hover/btn:rotate-12 transition-transform" />
          </button>
        </div>

        {/* Premium Corner Accents */}
        <div className="absolute bottom-0 left-0 w-16 h-16 pointer-events-none">
          <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-tr from-gold/15 to-transparent rounded-bl-2xl"></div>
        </div>
        <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none">
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-gold/15 to-transparent rounded-tr-2xl"></div>
        </div>
      </div>

    </div>
  );
}