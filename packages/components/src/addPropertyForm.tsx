"use client";

import React, { useState, ChangeEvent, FormEvent, useEffect, useRef } from "react";
import { CategoryModal } from "./categoryModal";
import { LocationModal } from "./locationModal";
import { useCreateProperty, useGetCategories, useGetLocationTree } from "@repo/query-hook";
import { toast } from "sonner";
import { CreatePropertySchema } from "@repo/validators";
import { Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

// Mapbox
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";


type Props = {
  user: string;
};

interface FormSchema extends CreatePropertySchema {
  districtId: string;
  municipalityId: string;
}

type SaleType = "sale" | "rent";
type DirectionType =
  | "east"
  | "west"
  | "north"
  | "south"
  | "northeast"
  | "northwest"
  | "southeast"
  | "southwest";


const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

// Nepal bbox: [minLng, minLat, maxLng, maxLat]
const NEPAL_BBOX: [number, number, number, number] = [80.058, 26.347, 88.201, 30.447];

// Kathmandu fallback
const KATHMANDU: [number, number] = [85.324, 27.7172];

function MapPicker({
  value,
  onChange,
}: {
  value: { lat: number | null; lng: number | null };
  onChange: (v: { lat: number; lng: number }) => void;
}) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const geocoderContainerRef = useRef<HTMLDivElement | null>(null);

  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (!MAPBOX_TOKEN) return;
    if (!mapContainerRef.current) return;
    if (mapRef.current) return;

    (mapboxgl as any).accessToken = MAPBOX_TOKEN;

    const startCenter: [number, number] =
      value.lng != null && value.lat != null ? [value.lng, value.lat] : KATHMANDU;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: startCenter,
      zoom: value.lng != null && value.lat != null ? 15 : 11,
      maxBounds: NEPAL_BBOX,
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    // ✅ Current location button
    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
      trackUserLocation: true,
      showUserHeading: true,
    });
    map.addControl(geolocate, "top-right");

    geolocate.on("geolocate", (e: any) => {
      const lat = e.coords.latitude as number;
      const lng = e.coords.longitude as number;
      const accuracy = e.coords.accuracy as number; // meters

      placeOrMoveMarker(lng, lat);
      onChange({ lat, lng });
      map.flyTo({ center: [lng, lat], zoom: accuracy <= 50 ? 17 : 15 });

      if (accuracy > 150) {
        // big warning for user
        toast.warning(`Low GPS accuracy (~${Math.round(accuracy)}m). Please drag marker to correct.`);
      } else {
        toast.success(`Location detected (~${Math.round(accuracy)}m accuracy)`);
      }
    });

    // ✅ Nepal-biased search
    if (geocoderContainerRef.current) {
      const geocoder = new MapboxGeocoder({
        accessToken: MAPBOX_TOKEN,
        mapboxgl: mapboxgl as any,
        marker: false,
        placeholder: "Search in Nepal (place / area / address)",
        countries: "np",
        bbox: NEPAL_BBOX,
        proximity: { longitude: startCenter[0], latitude: startCenter[1] },
        types: "country,region,place,locality,neighborhood,address,poi",
        limit: 6,
      });

      geocoderContainerRef.current.innerHTML = "";
      geocoderContainerRef.current.appendChild(geocoder.onAdd(map));

      geocoder.on("result", (ev: any) => {
        const coords = ev?.result?.center as [number, number] | undefined;
        if (!coords) return;

        const [lng, lat] = coords;
        placeOrMoveMarker(lng, lat);
        onChange({ lat, lng });
        map.flyTo({ center: [lng, lat], zoom: 16 });

        geocoder.setProximity({ longitude: lng, latitude: lat });
      });

      map.on("moveend", () => {
        const c = map.getCenter();
        geocoder.setProximity({ longitude: c.lng, latitude: c.lat });
      });
    }

    // Click-to-place
    map.on("click", (e) => {
      const { lng, lat } = e.lngLat;
      placeOrMoveMarker(lng, lat);
      onChange({ lat, lng });
    });

    mapRef.current = map;

    if (value.lng != null && value.lat != null) {
      placeOrMoveMarker(value.lng, value.lat);
    }

    function placeOrMoveMarker(lng: number, lat: number) {
      if (!markerRef.current) {
        markerRef.current = new mapboxgl.Marker({ draggable: true })
          .setLngLat([lng, lat])
          .addTo(map);

        markerRef.current.on("dragend", () => {
          const pos = markerRef.current?.getLngLat();
          if (!pos) return;
          onChange({ lat: pos.lat, lng: pos.lng });
        });
      } else {
        markerRef.current.setLngLat([lng, lat]);
      }
    }

    return () => {
      markerRef.current?.remove();
      markerRef.current = null;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  // When form resets, remove marker
  useEffect(() => {
    if (!mapRef.current) return;
    if (value.lat == null || value.lng == null) {
      markerRef.current?.remove();
      markerRef.current = null;
    }
  }, [value.lat, value.lng]);

  if (!MAPBOX_TOKEN) {
    return (
      <div className="p-3 rounded border border-red-300 bg-red-50 text-red-700">
        Map is not configured. Set <code>NEXT_PUBLIC_MAPBOX_TOKEN</code>.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="block font-medium">Pin Location on Map</label>

      <div ref={geocoderContainerRef} />

      <div
        ref={mapContainerRef}
        className="w-full h-[320px] rounded-md border border-secondary-300 dark:border-transparent overflow-hidden"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div>
          <label className="block text-sm text-secondary-600 dark:text-secondary-300">Latitude</label>
          <input
            value={value.lat ?? ""}
            readOnly
            className="w-full px-3 py-2 border rounded bg-secondary-50 dark:bg-secondary-800 dark:border-transparent"
            placeholder="Select on map"
          />
        </div>
        <div>
          <label className="block text-sm text-secondary-600 dark:text-secondary-300">Longitude</label>
          <input
            value={value.lng ?? ""}
            readOnly
            className="w-full px-3 py-2 border rounded bg-secondary-50 dark:bg-secondary-800 dark:border-transparent"
            placeholder="Select on map"
          />
        </div>
      </div>

      <p className="text-xs text-secondary-500">
        Use search (Nepal-biased), click the map, drag the marker, or use the current-location button.
      </p>
    </div>
  );
}
export const AddPropertyForm: React.FC<Props> = ({ user }) => {
  const [formData, setFormData] = useState<any>({
    title: "",
    description: "",
    type: "sale" as SaleType,
    categoryId: "",
    districtId: "",
    municipalityId: "",
    price: "",
    noOfBedRooms: "",
    noOfRestRooms: "",
    landArea: "",
    noOfFloors: "",
    propertyAge: "",
    facingDirection: "east" as DirectionType,
    floorArea: "",
    roadSize: "",
    verified: false,
    locationId: "",
    floorLevel: "",
    tole: "",
    // NEW
    lat: null as number | null,
    lng: null as number | null,
  });

  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
  const allBlobUrls = useRef<string[]>([]);

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      type: "sale" as SaleType,
      categoryId: "",
      districtId: "",
      municipalityId: "",
      price: "",
      noOfBedRooms: "",
      noOfRestRooms: "",
      landArea: "",
      noOfFloors: "",
      propertyAge: "",
      facingDirection: "east" as DirectionType,
      floorArea: "",
      roadSize: "",
      verified: false,
      locationId: "",
      floorLevel: "",
      tole: "",
      lat: null,
      lng: null,
    });
    allBlobUrls.current.forEach(URL.revokeObjectURL);
    allBlobUrls.current = [];
    setImages([]);
  };

  useEffect(() => {
    return () => {
      allBlobUrls.current.forEach(URL.revokeObjectURL);
      allBlobUrls.current = [];
    };
  }, []);

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState<{
    type: "district" | "municipality" | "ward";
    parentId?: string;
  } | null>(null);

  const { data: categories, isLoading: categoryLoading } = useGetCategories();
  const { data: locations, isLoading: locationLoading } = useGetLocationTree();
  const { mutate, isPending } = useCreateProperty();
  const queryClient = useQueryClient();

  const selectedCategory = categories?.result.find((c) => c.id === formData.categoryId);

  const numericFields = [
    "price",
    "noOfBedRooms",
    "noOfRestRooms",
    "landArea",
    "noOfFloors",
    "propertyAge",
    "floorArea",
    "roadSize",
    "floorLevel",
  ];

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    let newValue = value;

    if (numericFields.includes(name)) {
      newValue = newValue.replace(/\D/g, "");
    }

    if (name === "categoryId") {
      setFormData((prev: any) => ({
        ...prev,
        [name]: newValue,
        noOfBedRooms: "",
        noOfRestRooms: "",
        landArea: "",
        noOfFloors: "",
        propertyAge: "",
        facingDirection: "",
        floorArea: "",
        roadSize: "",
        floorLevel: "",
      }));
    } else {
      setFormData((prev: any) => ({ ...prev, [name]: newValue }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value.trim().replace(/\s+/g, " "),
    }));
  };

  const handleAddImages = (imageFiles: File[]) => {
    const validFiles = imageFiles.filter((file) => {
      if (file.size > 1024 * 1024 * 2) {
        toast.error(`${file.name} is greater than 2MB and was skipped`);
        return false;
      }
      return true;
    });

    setImages((prev: any) => {
      const currentImages = prev;

      if (currentImages.length + validFiles.length > 5) {
        toast.error("You can add maximum upto 5 images!!!");
        return prev;
      }

      const newImages = validFiles.map((file) => {
        const preview = URL.createObjectURL(file);
        allBlobUrls.current.push(preview);
        return { file, preview };
      });

      return [...currentImages, ...newImages];
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (images.length === 0) {
      toast.error("Please add atleast 1 image");
      return;
    }

    if (formData.lat == null || formData.lng == null) {
      toast.error("Please select the property location on the map");
      return;
    }

    const cleanedData = Object.fromEntries(
      Object.entries(formData)
        .filter(([key]) => !["districtId", "municipalityId"].includes(key))
        .map(([key, value]) => [key, value === "" ? null : value])
    ) as CreatePropertySchema;

    const cleanedImages = images.map((img) => img.file);


    const form = new FormData();

    Object.entries(cleanedData).forEach(([key, value]) => {
      if (value === null || value === undefined) {
        form.append(key, "");
        return;
      };

      if (typeof value === "boolean" || typeof value === "number") {
        form.append(key, String(value));
      } else if (typeof value === "string") {
        form.append(key, value);
      }
    });
    cleanedImages.forEach((file) => form.append("images", file));


    mutate(form, {
      onSuccess: (data) => {
        toast.success(data.message || "Property added successfully!!!");
        queryClient.invalidateQueries({ queryKey: ["listings"] });
        resetForm();
      }
    });
    // mutate(cleanedData, {
    //   onSuccess: (data) => {
    //     toast.success(data.message || "Operation Successful!!!");
    //     queryClient.invalidateQueries({ queryKey: ["listings"] });
    //     resetForm();
    //   },
    // });
  };

  return (
    <div className="max-w-7xl p-4 rounded shadow-lg overflow-auto">
      <h2 className="text-2xl font-bold mb-4">Add Property</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block font-medium mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-3 py-2 rounded-md 
              bg-secondary-50 dark:bg-secondary-800 
              text-secondary-900 dark:text-secondary-50
              border border-secondary-300 dark:border-transparent 
              focus:ring-2 focus:ring-primary-500 focus:outline-none
              placeholder-secondary-400 transition`}
            placeholder="Enter title"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-3 py-2 rounded-md 
              bg-secondary-50 dark:bg-secondary-800 
              text-secondary-900 dark:text-secondary-50
              border border-secondary-300 dark:border-transparent 
              focus:ring-2 focus:ring-primary-500 focus:outline-none
              placeholder-secondary-400 transition`}
            placeholder="Enter Description"
            required
          />
        </div>

        {/* Type */}
        <div>
          <label className="block font-medium mb-1">Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className={`w-full px-3 py-2 rounded-md 
              bg-secondary-50 dark:bg-secondary-800 
              text-secondary-900 dark:text-secondary-50
              border border-secondary-300 dark:border-transparent 
              focus:ring-2 focus:ring-primary-500 focus:outline-none
              placeholder-secondary-400 transition`}
            required
          >
            <option value="sale">Sale</option>
            <option value="rent">Rent</option>
          </select>
        </div>

        {/* Category */}
        <div>
          <label className="block font-medium mb-1">Category</label>
          <div className="flex gap-2">
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-md bg-secondary-50 dark:bg-secondary-800 text-secondary-900 dark:text-secondary-50 focus:ring-2 focus:ring-primary-500 focus:outline-none placeholder-secondary-400 transition dark:border-transparent"
              required
            >
              <option value="" hidden disabled>
                Select Category
              </option>
              {categoryLoading ? (
                <option disabled>Loading categories...</option>
              ) : (
                categories?.result.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))
              )}
            </select>
            {user === "admin" && (
              <button
                type="button"
                className="px-2 py-1 bg-primary-500 text-white rounded"
                onClick={() => setShowCategoryModal(true)}
              >
                Add
              </button>
            )}
          </div>
        </div>

        {/* price */}
        <div>
          <label className="block font-medium mb-1">Price</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-500">Rs</span>
            <input
              type="text"
              name="price"
              value={formData.price}
              inputMode="numeric"
              onChange={handleChange}
              className="w-full pl-10 px-3 py-2 border rounded bg-secondary-50 dark:bg-secondary-800 text-secondary-900 dark:text-secondary-50 dark:border-transparent"
              required
            />
          </div>
        </div>

        {/* Location (District/Municipality/Ward) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {/* District */}
          <div className="flex flex-col">
            <label className="font-medium mb-1">District</label>
            <div className="flex gap-2">
              <select
                name="districtId"
                value={formData.districtId}
                onChange={(e) => {
                  handleChange(e);
                  setFormData((prev: any) => ({ ...prev, municipalityId: "", locationId: "" }));
                }}
                className="flex-1 px-2 py-1 border rounded dark:border-transparent"
                required
              >
                <option value="" disabled hidden>
                  Select District
                </option>
                {locationLoading ? (
                  <option disabled>Loading districts...</option>
                ) : (
                  locations?.result.map((district) => (
                    <option key={district.id} value={district.id}>
                      {district.name}
                    </option>
                  ))
                )}
              </select>

              {user === "admin" && (
                <button
                  type="button"
                  className="px-2 py-1 bg-primary-500 text-white rounded"
                  onClick={() => setShowLocationModal({ type: "district" })}
                >
                  Add
                </button>
              )}
            </div>
          </div>

          {/* Municipality */}
          <div className="flex flex-col">
            <label className="font-medium mb-1">Municipality</label>
            <div className="flex gap-2">
              <select
                name="municipalityId"
                value={formData.municipalityId}
                onChange={(e) => {
                  handleChange(e);
                  setFormData((prev: any) => ({ ...prev, locationId: "" }));
                }}
                className="flex-1 px-2 py-1 border rounded dark:border-transparent"
                required
                disabled={!formData.districtId}
              >
                <option value="" disabled hidden>
                  Select Municipality
                </option>
                {formData.districtId &&
                  locations?.result
                    .find((d) => d.id === formData.districtId)
                    ?.municipalities.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
              </select>

              {user === "admin" && formData.districtId && (
                <button
                  type="button"
                  className="px-2 py-1 bg-primary-500 text-white rounded"
                  onClick={() => setShowLocationModal({ type: "municipality", parentId: formData.districtId })}
                >
                  Add
                </button>
              )}
            </div>
          </div>

          {/* Ward */}
          <div className="flex flex-col">
            <label className="font-medium mb-1">Ward</label>
            <div className="flex gap-2">
              <select
                name="locationId"
                value={formData.locationId}
                onChange={handleChange}
                className="flex-1 px-2 py-1 border rounded dark:border-transparent"
                required
                disabled={!formData.municipalityId}
              >
                <option value="" disabled hidden>
                  Select Ward
                </option>
                {formData.municipalityId &&
                  locations?.result
                    .flatMap((d) => d.municipalities)
                    .find((m) => m.id === formData.municipalityId)
                    ?.wards.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name}
                      </option>
                    ))}
              </select>

              {user === "admin" && formData.municipalityId && (
                <button
                  type="button"
                  className="px-2 py-1 bg-primary-500 text-white rounded"
                  onClick={() => setShowLocationModal({ type: "ward", parentId: formData.municipalityId })}
                >
                  Add
                </button>
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1">Tole/Street</label>
          <input
            type="text"
            name="tole"
            value={formData.tole}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full px-3 py-2 border rounded bg-secondary-50 dark:bg-secondary-800 text-secondary-900 dark:text-secondary-50 focus:ring-2 focus:ring-primary-500 focus:outline-none placeholder-secondary-400 transition dark:border-transparent"
            placeholder="Enter tole/street"
            required
          />
        </div>

        {/* NEW: Map Picker */}
        <MapPicker
          value={{ lat: formData.lat, lng: formData.lng }}
          onChange={({ lat, lng }) => setFormData((prev: any) => ({ ...prev, lat, lng }))}
        />

        {/* Dynamic fields */}
        {selectedCategory && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* keep your dynamic fields unchanged */}
            {/* ... (your existing dynamic fields block stays exactly as-is) */}
          </div>
        )}

        {/* Images Upload */}
        <div>
          <label className="block font-medium mb-1">Images</label>
          <div className="flex items-center gap-4">
            <label className="px-4 py-2 bg-primary-500 text-white rounded cursor-pointer hover:bg-primary-600">
              Add Images
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  handleAddImages(files);
                }}
              />
            </label>

            <div className="flex gap-2 overflow-x-auto">
              {images?.map((img: any, idx: number) => (
                <div key={idx} className="relative group">
                  <img src={img.preview} alt={`preview-${idx}`} className="w-20 h-20 object-cover rounded border" />
                  <button
                    type="button"
                    onClick={() => {
                      URL.revokeObjectURL(img.preview);
                      setImages((prev) => prev.filter((_: any, i: number) => i !== idx));
                      allBlobUrls.current = allBlobUrls.current.filter((url) => url !== img.preview);
                    }}
                    className="absolute top-0 right-0 bg-black/60 text-white text-xs px-1 rounded opacity-0 group-hover:opacity-100 transition"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-1">Max 5 images, each not more than 2MB.</p>
        </div>

        {user === "admin" && (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="verified"
              id="verified"
              checked={formData.verified}
              onChange={() => setFormData((prev: any) => ({ ...prev, verified: !prev.verified }))}
              className="h-4 w-4 accent-primary-600 cursor-pointer"
            />
            <label htmlFor="verified" className="font-medium text-secondary-900 dark:text-secondary-50">
              Verified
            </label>
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            type="submit"
            disabled={isPending}
            className={`px-4 py-2 bg-primary-500 text-white rounded transition ${isPending ? "opacity-70 cursor-not-allowed" : "hover:bg-primary-600"
              }`}
          >
            {isPending ? <Loader2 className="animate-spin" /> : "Add Property"}
          </button>
        </div>
      </form>

      {showCategoryModal && <CategoryModal onClose={() => setShowCategoryModal(false)} user={user} />}
      {showLocationModal && (
        <LocationModal
          type={showLocationModal.type}
          parentId={showLocationModal.parentId}
          onClose={() => setShowLocationModal(null)}
          user={user}
        />
      )}
    </div>
  );
};