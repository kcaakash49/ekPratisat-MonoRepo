"use client";

import { useFetchPropertyDetail } from "@repo/query-hook";
import PageLoading from "@repo/ui/pageloading";
import { useParams } from "next/navigation";
import Image from "next/image";

function SpecItem({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;

  return (
    <div className="flex flex-col rounded-lg border border-secondary-200 dark:border-secondary-700 p-4 bg-secondary-50 dark:bg-secondary-800">
      <span className="text-sm text-secondary-500 dark:text-secondary-400">
        {label}
      </span>
      <span className="text-base font-semibold text-secondary-900 dark:text-secondary-100 mt-1">
        {value}
      </span>
    </div>
  );
}

export default function PropertyDetailComponent() {
  const param = useParams();

  const {
    data: property,
    isLoading,
    isError,
    error,
  } = useFetchPropertyDetail(param.id as string);

  if (isLoading) {
    return <PageLoading />;
  }

  if (isError || !property) {
    return (
      <div className="flex flex-1 items-center justify-center text-red-500 text-lg md:text-xl h-full">
        {error?.message || "Couldn't fetch property data"}
      </div>
    );
  }

  const images = property.images;

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-secondary-900">
      {/* ---------------- Hero Images ---------------- */}
      <div className="relative w-full h-[60vh] bg-secondary-100 dark:bg-secondary-800">
        {images && images.length > 0 ? (
          <Image
            src={`${process.env.NEXT_PUBLIC_BASE_URL}${images[0]!.url}`}
            alt={property.title}
            fill
            priority
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-secondary-500">
            No Image Available
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white">
          <h1 className="text-2xl md:text-4xl font-bold">
            {property.title}
          </h1>
          <p className="mt-2 text-sm md:text-base opacity-90">
            {property.location?.name}
          </p>
        </div>
      </div>

      {/* ---------------- Content ---------------- */}
      <div className="max-w-7xl mx-auto w-full px-4 md:px-6 py-8 space-y-8">
        {/* Price & Meta */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
              Rs. {property.price}
            </p>
            <p className="text-secondary-600 dark:text-secondary-400 mt-1">
              {property.category?.name} • {property.type}
            </p>
          </div>

          <div className="text-sm text-secondary-600 dark:text-secondary-400">
            Listed by{" "}
            <span className="font-medium text-secondary-900 dark:text-secondary-200">
              {property.user?.name}
            </span>
          </div>
        </div>

        {/* Specs Grid (Nullable-safe) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <SpecItem label="Bedrooms" value={property.noOfBedRooms} />
          <SpecItem label="Bathrooms" value={property.noOfRestRooms} />
          <SpecItem label="Land Area" value={property.landArea} />
          <SpecItem label="Floor Area" value={property.floorArea} />
          <SpecItem label="Floors" value={property.noOfFloors} />
          <SpecItem label="Floor Level" value={property.floorLevel} />
          <SpecItem label="Road Size" value={property.roadSize} />
          <SpecItem label="Facing" value={property.facingDirection} />
          <SpecItem label="Property Age" value={property.propertyAge} />
        </div>

        {/* Description */}
        <div className="rounded-xl border border-secondary-200 dark:border-secondary-700 p-6 bg-white dark:bg-secondary-900">
          <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-3">
            Description
          </h2>
          <p className="text-secondary-700 dark:text-secondary-300 leading-relaxed">
            {property.description}
          </p>
        </div>
      </div>
    </div>
  );
}
