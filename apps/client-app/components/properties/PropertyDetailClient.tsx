// app/property/[id]/property-detail-client.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import {
  HeartIcon,
  ShareIcon,
  MapPinIcon,
  HomeIcon,
  ArrowsPointingOutIcon,
  CalendarIcon,
  CheckBadgeIcon,
  BuildingOfficeIcon,
  CursorArrowRippleIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import FavouriteButton from "./FavouriteButton";
import { toast } from "sonner";

export type PropertyData = {
  id: string;
  title: string;
  description: string;
  price: string;
  type: string;
  category: { name: string } | null
  isFeatured: boolean;
  noOfBedRooms: string | null;
  noOfRestRooms: string | null;
  landArea: string | null;
  noOfFloors: string | null;
  propertyAge: string | null;
  facingDirection: string | null;
  floorArea: string | null;
  roadSize: string| null;
  floorLevel: string | null;
  tole: string | null;
  createdAt: Date;
  images: { url: string }[];
  location: {
    name: string;
    municipality: {
      name: string;
      district: { name: string };
    };
  } | null;
};

export interface PropertyDetailClientProps {
  property: PropertyData;
}

export function PropertyDetailClient({ property }: PropertyDetailClientProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  // Format price with commas
  const formattedPrice = new Intl.NumberFormat("en-NP", {
    style: "currency",
    currency: "NPR",
    maximumFractionDigits: 0,
  }).format(Number(property.price));

  // Format date
  const formattedDate = new Date(property.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleShare = async () => {
  const shareData = {
    title: property.title,
    text: `Check out this property on Ek Pratisat: ${property.title}`,
    url: window.location.href, // Current page URL
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
    } catch (err) {
      console.log("Share failed or cancelled", err);
    }
  } else {
    // Fallback: Copy to clipboard
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  }
};

  // Location string
  const locationString = property.location
    ? `${property.location.municipality.name}-${property.location.name}, ${property.location.municipality.district.name}`
    : "Location not specified";

  const toleString = property.tole ? `, ${property.tole}` : "";

  const images = property.images.length > 0 ? property.images : [{ url: "/placeholder-property.jpg" }];

  return (
    <div className={`transition-colors duration-300}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              {property.isFeatured && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gold/20 text-gold border border-gold/30">
                  <CheckBadgeIcon className="w-3.5 h-3.5 mr-1" />
                  Featured
                </span>
              )}
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 uppercase">
                {property.type || "Property"}
              </span>
              <span className="text-secondary-500 dark:text-secondary-400 text-sm">
                Listed on {formattedDate}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-secondary-900 dark:text-white mt-3">
              {property.title}
            </h1>
            <div className="flex items-center gap-2 mt-2 text-secondary-600 dark:text-secondary-300">
              <MapPinIcon className="w-5 h-5 text-gold" />
              <span>
                {locationString}
                {toleString}
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            {/* <button
              onClick={() => setIsSaved(!isSaved)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-secondary-200 dark:border-secondary-700 hover:border-gold dark:hover:border-gold transition-all duration-200 bg-white dark:bg-secondary-800"
            >
              {isSaved ? (
                <HeartSolidIcon className="w-5 h-5 text-red-500" />
              ) : (
                <HeartIcon className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
              )}
              <span className="text-secondary-700 dark:text-secondary-300">
                {isSaved ? "Saved" : "Save"}
              </span>
            </button> */}
            <FavouriteButton property={property}/>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-secondary-200 dark:border-secondary-700 hover:border-gold dark:hover:border-gold transition-all duration-200 bg-white dark:bg-secondary-800" onClick={handleShare}>
              <ShareIcon className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
              <span className="text-secondary-700 dark:text-secondary-300">Share</span>
            </button>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-3">
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-secondary-100 dark:bg-secondary-800">
                <Image
                  src={`${process.env.NEXT_PUBLIC_BASE_URL}${images[selectedImage]?.url}` || "/placeholder-property.jpg"}
                  alt={property.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 75vw"
                  priority
                />
              </div>
            </div>
            <div className="grid grid-cols-4 lg:grid-cols-1 gap-3">
              {images.slice(0, 4).map((image, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative aspect-video rounded-xl overflow-hidden bg-secondary-100 dark:bg-secondary-800 transition-all duration-200 ${
                    selectedImage === idx
                      ? "ring-2 ring-gold ring-offset-2 dark:ring-offset-secondary-900"
                      : "opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BASE_URL}${image.url}`}
                    alt={`${property.title} - image ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 25vw, 150px"
                  />
                </button>
              ))}
              {images.length > 4 && (
                <div className="relative aspect-video rounded-xl overflow-hidden bg-secondary-100 dark:bg-secondary-800 flex items-center justify-center">
                  <span className="text-secondary-600 dark:text-secondary-400 font-medium">
                    +{images.length - 4} more
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Price and CTA */}
        <div className="bg-gradient-to-r from-gold/10 to-gold/5 dark:from-gold/5 dark:to-transparent rounded-2xl p-6 mb-8 border border-gold/20">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <span className="text-sm text-secondary-500 dark:text-secondary-400 uppercase tracking-wide">
                Price
              </span>
              <p className="text-4xl font-bold text-gold">{formattedPrice}</p>
            </div>
            <div className="flex gap-3">
              <button className="px-8 py-3 rounded-xl bg-gold-gradient hover:bg-gold-gradient-hover text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl">
                Contact Agent
              </button>
              <button className="px-8 py-3 rounded-xl border-2 border-gold text-gold hover:bg-gold/10 font-semibold transition-all duration-200">
                Schedule Visit
              </button>
            </div>
          </div>
        </div>   
      </div>
    </div>
  );
}