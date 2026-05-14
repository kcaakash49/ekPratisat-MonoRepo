// app/property/[id]/property-detail-client.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ShareIcon,
  MapPinIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";
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
    <main className="min-h-screen bg-[#f7f3ea] text-[#10151f] transition-colors duration-200 dark:bg-[#171512] dark:text-[#f7f1e3]">
    <div className="ek-nav-safe-page mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8 lg:pb-16">
        {/* Header with actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              {property.isFeatured && (
                <span className="inline-flex items-center rounded-full border border-[var(--ek-border-soft)] bg-[rgba(214,169,54,0.12)] px-3 py-1 text-xs font-semibold text-[var(--ek-gold-text)] dark:border-[var(--ek-dark-border)] dark:bg-[rgba(229,184,62,0.12)] dark:text-[var(--ek-dark-gold)]">
                  <CheckBadgeIcon className="w-3.5 h-3.5 mr-1" />
                  Featured
                </span>
              )}
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 uppercase">
                {property.type || "Property"}
              </span>
              <span className="text-secondary-500 dark:text-[var(--ek-dark-soft)] text-sm">
                Listed on {formattedDate}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[var(--ek-text-primary)] dark:text-[var(--ek-dark-text)] mt-3">
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
            <button className="flex items-center gap-2 rounded-xl border border-[var(--ek-border-soft)] bg-[var(--ek-bg-card)] px-4 py-2 transition-colors duration-200 hover:border-[var(--ek-border-strong)] dark:border-[var(--ek-dark-border)] dark:bg-[var(--ek-dark-surface)] dark:hover:border-[var(--ek-dark-border-strong)]" onClick={handleShare}>
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
        <div className="mb-8 rounded-2xl border border-[var(--ek-border-soft)] bg-[linear-gradient(135deg,rgba(214,169,54,0.11),rgba(255,253,248,0.82))] p-6 dark:border-[var(--ek-dark-border)] dark:bg-[linear-gradient(135deg,rgba(229,184,62,0.1),rgba(33,28,20,0.88))]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <span className="text-sm text-secondary-500 dark:text-secondary-400 uppercase tracking-wide">
                Price
              </span>
              <p className="text-4xl font-bold text-[var(--ek-gold-text)] dark:text-[var(--ek-dark-gold)]">{formattedPrice}</p>
            </div>
            <div className="flex gap-3">
              <button className="rounded-xl bg-gold-gradient px-8 py-3 font-semibold text-[#151006] shadow-sm shadow-gold-800/15 transition-transform duration-200 hover:-translate-y-0.5 hover:bg-gold-gradient-hover active:translate-y-0">
                Contact Agent
              </button>
              <button className="rounded-xl border border-[var(--ek-border-strong)] px-8 py-3 font-semibold text-[var(--ek-gold-text)] transition-colors duration-200 hover:bg-[rgba(214,169,54,0.1)] dark:border-[var(--ek-dark-border-strong)] dark:text-[var(--ek-dark-gold)] dark:hover:bg-[rgba(229,184,62,0.1)]">
                Schedule Visit
              </button>
            </div>
          </div>
        </div>   
      </div>
    </main> 
    
  );
}
