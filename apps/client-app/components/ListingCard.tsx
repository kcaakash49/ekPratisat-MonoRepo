import Image from "next/image";
import { Bed, Bath, Maximize, MapPin } from "lucide-react"; // install lucide-react if not there

export default function ListingCard({ listing }: any) {
  // Use the Inland formatting logic for these large numbers
  const formattedPrice = new Intl.NumberFormat('en-IN').format(Number(listing.price));

  return (
    <div className="group relative bg-white dark:bg-secondary-800 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-secondary-100 dark:border-secondary-700 w-full">
      {/* Image Section */}
      <div className="relative h-64 w-full overflow-hidden">
        {listing.images?.[0]?.url ? (
          <Image
            src={`${process.env.NEXT_PUBLIC_BASE_URL}${listing.images[0].url}`}
            alt={listing.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-secondary-200 flex items-center justify-center">No Image</div>
        )}
        
        {/* Price Badge - Using your Gold Gradient */}
        <div className="absolute top-4 left-4 bg-gold-gradient text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
          Rs. {formattedPrice} {listing.type === "rent" ? "/mo" : ""}
        </div>

        {/* Category Tag */}
        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-lg text-xs font-medium uppercase tracking-wider">
          {listing.category?.name}
        </div>
      </div>

      {/* Info Section */}
      <div className="p-5">
        <div className="flex items-center gap-1 text-gold mb-1">
           <MapPin size={14} />
           <span className="text-xs font-semibold uppercase tracking-wider">{listing.tole}</span>
        </div>
        
        <h3 className="text-secondary-900 dark:text-white text-xl font-bold mb-4 line-clamp-1">
          {listing.title}
        </h3>

        {/* Features Row */}
        <div className="flex items-center justify-between border-t border-secondary-100 dark:border-secondary-700 pt-4">
          <div className="flex items-center gap-4 text-secondary-500 dark:text-secondary-400">
            {listing.noOfBedRooms && (
              <div className="flex items-center gap-1.5">
                <Bed size={18} className="text-gold" />
                <span className="text-sm font-medium">{listing.noOfBedRooms}</span>
              </div>
            )}
            {listing.noOfRestRooms && (
              <div className="flex items-center gap-1.5">
                <Bath size={18} className="text-gold" />
                <span className="text-sm font-medium">{listing.noOfRestRooms}</span>
              </div>
            )}
            {listing.landArea && (
              <div className="flex items-center gap-1.5">
                <Maximize size={18} className="text-gold" />
                <span className="text-sm font-medium">{listing.landArea}</span>
              </div>
            )}
          </div>
          
          <div className="text-xs font-bold text-secondary-400 uppercase">
             {listing.type}
          </div>
        </div>
      </div>
    </div>
  );
}