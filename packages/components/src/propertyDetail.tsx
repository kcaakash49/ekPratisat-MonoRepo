"use client";

import { useState, useEffect } from "react";
import { useFeatureProperty, useFetchPropertyDetail, useToggleActive, usetoggleActiveListing, useVerifyProperty } from "@repo/query-hook";
import PageLoading from "@repo/ui/pageloading";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import PropertyMap from "./propertyMap";
import {
  ShieldCheck,
  Star,
  Edit3,
  Trash2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import DeletePropertyButton from "./deletePropertyButton";
import AddPropertyNoteButton from "./addPropertyNoteButton";
import PropertyLeadNotesCard from "./propertyLeadNotes";
// Assuming you have a way to call your backend mutations (axios/fetch)
// import { verifyProperty, toggleFeature, deleteProperty } from "@/lib/api/admin";

export default function AdminPropertyDetailComponent() {
  const param = useParams();
  const queryClient = useQueryClient();
  const {
    data: property,
    isLoading,
    isError,
    error,
    refetch // Important for updating UI after actions
  } = useFetchPropertyDetail(param.id as string);
  const { mutate: verifyMutate, isPending: verifyPending } = useVerifyProperty();
  const { mutate: featureMutate, isPending: featurePending } = useFeatureProperty();
  const { mutate: activeMutate, isPending: activePending } = usetoggleActiveListing();

  const router = useRouter();

  const [activeImage, setActiveImage] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const images = property?.images ?? [];

  const openLightbox = (startIndex?: number) => {
    if (typeof startIndex === "number") setActiveImage(startIndex);
    setIsLightboxOpen(true);
  };
  const closeLightbox = () => setIsLightboxOpen(false);
  const showNextImage = () => setActiveImage((c) => (c + 1) % images.length);
  const showPrevImage = () => setActiveImage((c) => (c - 1 + images.length) % images.length);

  useEffect(() => {
    if (!isLightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowRight") showNextImage();
      else if (e.key === "ArrowLeft") showPrevImage();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLightboxOpen, images.length]);

  if (isLoading) return <PageLoading />;

  if (isError || !property) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-red-500">
        <AlertCircle size={48} className="mb-4" />
        <p className="text-lg font-bold">{error?.message || "Couldn't fetch property data"}</p>
      </div>
    );
  }

  // --- Handlers (Placeholder for your actual API calls) ---
  const handleVerify = async () => {
    if (confirm("Once verified, this cannot be undone. Proceed?")) {
      verifyMutate({ propertyId: property.id }, {
        onSuccess: (data) => {
          toast.success(data.message || "Operation Successful!!!");
          queryClient.invalidateQueries({
            queryKey: ["all-properties"]
          });
          queryClient.invalidateQueries({
            queryKey: ["property-detail", property.id]
          })
        }
      })
      refetch();
    }
  };

  const handleToggleFeature = async () => {
    if (confirm(`Do you want to ${property.isFeatured ? "remove feature for" : "feature"} this listing?`)) {
      featureMutate({ propertyId: property.id, isFeatured: property.isFeatured }, {
        onSuccess: (data) => {
          toast.success(data.message || "Operation Successful!!!");
          queryClient.invalidateQueries({
            queryKey: ["all-properties"]
          });
          queryClient.invalidateQueries({
            queryKey: ["property-detail", property.id]
          })
        }
      })
    }
    refetch();
  };

  const handleActiveToggle = async () => {
    if (confirm(`Do you want to ${property.isActive ? "deactivate" : "activate"} this listing?`)) {
      activeMutate({ id: property.id }, {
        onSuccess: (data) => {
          toast.success(data.message || "Operation Successful!!!");
          queryClient.invalidateQueries({
            queryKey: ["all-properties"]
          });
          queryClient.invalidateQueries({
            queryKey: ["property-detail", property.id]
          })
        }
      })
    }
    refetch();
  }

  console.log(property);

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden bg-white dark:bg-secondary-900">

      {/* ---------------- LIGHTBOX ---------------- */}
      {isLightboxOpen && images.length > 0 && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Property photos"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/92 backdrop-blur-sm"
          onClick={closeLightbox}
        >
          <button
            type="button"
            onClick={closeLightbox}
            aria-label="Close"
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-secondary-900/90 text-white transition hover:bg-secondary-900"
          >
            <X size={22} />
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); showPrevImage(); }}
                aria-label="Previous photo"
                className="absolute left-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-secondary-900/90 text-white transition hover:bg-secondary-900 sm:left-6"
              >
                <ChevronLeft size={26} />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); showNextImage(); }}
                aria-label="Next photo"
                className="absolute right-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-secondary-900/90 text-white transition hover:bg-secondary-900 sm:right-6"
              >
                <ChevronRight size={26} />
              </button>
            </>
          )}

          <div className="relative flex h-full w-full items-center justify-center px-12 py-16 sm:px-20" onClick={(e) => e.stopPropagation()}>
            <div className="relative h-full w-full">
              <Image
                src={`${process.env.NEXT_PUBLIC_BASE_URL}${images[activeImage]?.url}`}
                alt={`${property.title} photo ${activeImage + 1} of ${images.length}`}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>
          </div>

          <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-white/25 bg-secondary-900/90 px-4 py-1.5 text-sm font-semibold text-white">
            {activeImage + 1} / {images.length}
          </div>
        </div>
      )}

      {/* ---------------- ADMIN MANAGEMENT BAR ---------------- */}
      <div className="z-50 bg-white/80 dark:bg-secondary-900/80  border-b border-secondary-200 dark:border-secondary-800 px-4 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${property.verified ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
              }`}>
              {property.verified ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
              {property.verified ? "Verified" : "Pending Verification"}
            </div>
            {property.isFeatured && (
              <div className="bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1.5">
                <Star size={14} fill="currentColor" /> Featured
              </div>
            )}
            <AddPropertyNoteButton propertyId={property.id} leadNotes={property.leadNotes}/>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Verification Button: Hidden if already verified */}
            {!property.verified && (
              <button
                onClick={handleVerify}
                disabled={verifyPending}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-bold transition-all"
              >
                <ShieldCheck size={18} /> Verify Property
              </button>
            )}

            {/* Toggle Feature Button */}
            <button
              onClick={handleToggleFeature}
              disabled={featurePending}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all border ${property.isFeatured
                ? "border-amber-500 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                : "bg-amber-500 hover:bg-amber-600 text-white"
                }`}
            >
              <Star size={18} fill={property.isFeatured ? "currentColor" : "none"} />
              {property.isFeatured ? "Remove from Featured" : "Make Featured"}
            </button>

            <div className="h-6 w-px bg-secondary-200 dark:bg-secondary-800 mx-1" />

            <button className="p-2 text-secondary-600 hover:bg-secondary-100 dark:hover:bg-secondary-800 rounded-lg transition-colors" onClick={() => router.push(`/admin/properties/edit/${property.id}`)}>
              <Edit3 size={20} />
            </button>
            <button className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all border ${property.isActive
              ? "border-amber-500 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20"
              : "bg-amber-500 hover:bg-amber-600 text-white"
              }`} onClick={handleActiveToggle} disabled={activePending}>
              {/* <Trash2 size={20} /> */}
              {/* <Trash2 size={18} fill={property.isActive ? "currentColor" : "none"} /> */}
              {property.isActive ? "Deactivate" : "Activate"}
            </button>
            <DeletePropertyButton id={property.id} isActive={property.isActive} />

          </div>
        </div>
      </div>

      {/* ---------------- Rest of the UI (Same as your provided layout) ---------------- */}
      <div
        className={`relative w-full aspect-[16/10] max-h-[70vh] bg-secondary-100 dark:bg-secondary-800 ${images.length > 0 ? "cursor-zoom-in" : ""}`}
        onClick={() => images.length > 0 && openLightbox(activeImage)}
      >
        {images.length > 0 ? (
          <Image
            src={`${process.env.NEXT_PUBLIC_BASE_URL}${images[activeImage]?.url ?? images[0]!.url}`}
            alt={property.title}
            fill
            priority
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-secondary-500">No Image Available</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
        {images.length > 1 && (
          <span className="absolute top-4 right-4 rounded-full bg-black/55 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
            {activeImage + 1} / {images.length}
          </span>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white pointer-events-none">
          <h1 className="text-2xl md:text-5xl font-black tracking-tight">{property.title}</h1>
          <p className="mt-2 text-sm md:text-lg font-medium opacity-90">
            {property.location.municipality.district.name}, {property.location.municipality.name}, {property.tole}
          </p>
        </div>
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto bg-secondary-50 dark:bg-secondary-900/50 px-4 py-3 border-b border-secondary-100 dark:border-secondary-800">
          {images.map((img, idx) => (
            <button
              key={img.url}
              type="button"
              onClick={() => setActiveImage(idx)}
              aria-label={`Show image ${idx + 1} of ${images.length}`}
              className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${idx === activeImage
                ? "border-primary-500 ring-2 ring-primary-500/30"
                : "border-transparent opacity-70 hover:opacity-100"
                }`}
            >
              <Image
                src={`${process.env.NEXT_PUBLIC_BASE_URL}${img.url}`}
                alt={`${property.title} thumbnail ${idx + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      <div className="max-w-7xl mx-auto w-full px-4 md:px-6 py-12 space-y-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-secondary-100 dark:border-secondary-800 pb-8">
          <div>
            <p className="text-4xl font-black text-primary-600 dark:text-primary-400">
              Rs. {property.price.toLocaleString()}
            </p>
            <p className="text-secondary-500 dark:text-secondary-400 mt-1 font-bold">
              {property.category?.name} • {property.type}
            </p>
          </div>
          <div className="bg-secondary-50 dark:bg-secondary-800/50 p-4 rounded-2xl flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-secondary-200 dark:bg-secondary-700 flex items-center justify-center font-bold">
              {property.user?.name?.charAt(0)}
            </div>
            <div>
              <p className="text-xs text-secondary-500 font-bold uppercase">Posted by</p>
              <p className="font-bold text-secondary-900 dark:text-secondary-100">{property.user?.name}</p>

            </div>
          </div>

        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          <SpecItem label="Bedrooms" value={property.noOfBedRooms} />
          <SpecItem label="Bathrooms" value={property.noOfRestRooms} />
          <SpecItem label="Land Area" value={property.landArea} />
          <SpecItem label="Floors" value={property.noOfFloors} />
          <SpecItem label="Road Size" value={property.roadSize} />
          <SpecItem label="Facing" value={property.facingDirection} />
          {/* ... Add other specs as needed */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div className="rounded-3xl border border-secondary-200 dark:border-secondary-800 p-8 bg-white dark:bg-secondary-900">
              <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">Description</h2>
              <p className="text-secondary-600 dark:text-secondary-400 leading-relaxed whitespace-pre-line text-lg">
                {property.description}
              </p>
            </div>

            {/* Map Section */}
            {typeof (property as any).lat === "number" && typeof (property as any).lng === "number" ? (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 flex items-center gap-2">
                  Location Mapping
                </h2>
                <div className="rounded-[2.5rem] overflow-hidden border-4 border-white dark:border-secondary-800 shadow-2xl">
                  <PropertyMap lat={(property as any).lat} lng={(property as any).lng} />
                </div>
              </div>
            ) : null}
          </div>

          {/* Admin Summary Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-secondary-50 dark:bg-secondary-800/40 rounded-[2rem] p-8 border border-secondary-100 dark:border-secondary-800">
              <h3 className="font-bold text-secondary-900 dark:text-white mb-4">Listing Details</h3>
              <div className="space-y-4">
                <DetailLine label="Listing ID" value={property.id} />
                <DetailLine label="Created At" value={new Date(property.createdAt).toLocaleDateString()} />
                <DetailLine label="Status" value={property.verified ? "Verified" : "Pending Approval"} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <PropertyLeadNotesCard leadNotes={property.leadNotes} />
    </div>
  );
}

// Small helper for the sidebar
function DetailLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start gap-2 text-sm">
      <span className="text-secondary-500 font-medium shrink-0">{label}</span>
      <span className="text-secondary-900 dark:text-secondary-200 font-mono text-xs break-all text-right">{value}</span>
    </div>
  );
}

function SpecItem({ label, value }: { label: string; value?: string | number | null }) {
  if (!value) return null;
  return (
    <div className="flex flex-col rounded-2xl border border-secondary-100 dark:border-secondary-800 p-5 bg-white dark:bg-secondary-900 shadow-sm">
      <span className="text-[10px] uppercase tracking-widest font-bold text-secondary-400">
        {label}
      </span>
      <span className="text-lg font-bold text-secondary-900 dark:text-secondary-100 mt-1">
        {value}
      </span>
    </div>
  );
}