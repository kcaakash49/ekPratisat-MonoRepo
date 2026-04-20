"use client";
import { AddPropertyForm } from "@repo/components/addPropertyForm";
import { AddPropertySkeleton } from "@repo/components/addPropertySkeleton";
import { useCreateProperty, useUser } from "@repo/query-hook";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, LockKeyhole } from "lucide-react";
import { toast } from "sonner";

export default function AddProperty() {
  const { data: user, isLoading } = useUser();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { mutate, isPending } = useCreateProperty();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isLoading && !user) {
      const timer = setTimeout(() => {
        router.replace("/auth/signin");
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [user, isLoading, router]);

  if (isLoading || !mounted) {
    return <div className="mx-auto max-w-7xl px-4 py-8"><AddPropertySkeleton /></div>;
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 animate-in fade-in duration-500">
        <div className="relative">
          {/* Outer Glow Effect */}
          <div className="absolute inset-0 bg-yellow-500/20 blur-xl rounded-full" />

          {/* Icon Container */}
          <div className="relative bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
            <LockKeyhole className="h-10 w-10 text-yellow-600" />
          </div>

          {/* Small Spinner positioned on the corner */}
          <div className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-900 p-1 rounded-full shadow-md">
            <Loader2 className="h-5 w-5 text-yellow-600 animate-spin" />
          </div>
        </div>

        <div className="text-center space-y-1">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            Authentication Required
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm max-w-[250px]">
            Please wait while we redirect you to the login page...
          </p>
        </div>
      </div>
    )
  }

  const role = user?.role;
  const emptyState = {
        title: "",
        description: "",
        type: "sale" as 'rent' | 'sale',
        categoryId: "",
        districtId: "",
        municipalityId: "",
        price: "",
        noOfBedRooms: "",
        noOfRestRooms: "",
        landArea: "",
        noOfFloors: "",
        propertyAge: "",
        facingDirection: "east",
        floorArea: "",
        roadSize: "",
        verified: false,
        locationId: "",
        floorLevel: "",
        tole: "",
        lat: null,
        lng: null,
        images: []
    }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 animate-in fade-in duration-500">
      <AddPropertyForm user={role} initialData={emptyState} isLoading={isPending} onSubmit={(data: FormData) => mutate(data, {
                onSuccess: (data) => {
                    toast.success(data.message || "Property added successfully!!!");
                    router.replace("/user/my-listings")
                }
            })}  />

    </div>

  )
}