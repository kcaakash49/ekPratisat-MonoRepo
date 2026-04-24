"use client";

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
  XCircle
} from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import DeletePropertyButton from "./deletePropertyButton";
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
  const {mutate: activeMutate, isPending: activePending} = usetoggleActiveListing();
  
  const router = useRouter();

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
      activeMutate({id: property.id }, {
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

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-secondary-900">

      {/* ---------------- ADMIN MANAGEMENT BAR ---------------- */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-secondary-900/80 backdrop-blur-md border-b border-secondary-200 dark:border-secondary-800 px-4 py-4">
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
          </div>

          <div className="flex items-center gap-2">
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
                }`} onClick={handleActiveToggle}>
              {/* <Trash2 size={20} /> */}
              <Trash2 size={18} fill={property.isActive ? "currentColor" : "none"} />
              {property.isActive ? "Deactivate" : "Activate"}
            </button>
            <DeletePropertyButton id={property.id} isActive = {property.isActive}/>
          </div>
        </div>
      </div>

      {/* ---------------- Rest of the UI (Same as your provided layout) ---------------- */}
      <div className="relative w-full h-[50vh] bg-secondary-100 dark:bg-secondary-800">
        {property.images && property.images.length > 0 ? (
          <Image
            src={`${process.env.NEXT_PUBLIC_BASE_URL}${property.images[0]!.url}`}
            alt={property.title}
            fill
            priority
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-secondary-500">No Image Available</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white">
          <h1 className="text-2xl md:text-5xl font-black tracking-tight">{property.title}</h1>
          <p className="mt-2 text-sm md:text-lg font-medium opacity-90">
            {property.location.municipality.district.name}, {property.location.municipality.name}, {property.tole}
          </p>
        </div>
      </div>

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
    </div>
  );
}

// Small helper for the sidebar
function DetailLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-secondary-500 font-medium">{label}</span>
      <span className="text-secondary-900 dark:text-secondary-200 font-mono text-xs">{value}</span>
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