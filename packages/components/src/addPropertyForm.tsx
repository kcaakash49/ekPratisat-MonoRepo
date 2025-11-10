"use client";

import React, { useState, ChangeEvent, FormEvent, useEffect, useRef } from "react";
import { CategoryModal } from "./categoryModal";
import { LocationModal } from "./locationModal";
import { useCreateProperty, useGetCategories, useGetLocationTree } from "@repo/query-hook";
import { toast } from "sonner";
import { CreatePropertySchema } from "@repo/validators";
import { Loader2 } from "lucide-react";



type Props = {
  user: string;
};

interface FormSchema extends CreatePropertySchema {
  districtId: string;
  municipalityId: string;
}

type SaleType = "sale" | "rent"

type DirectionType = "east" | "west" | "north" | "south" | "northeast" | "northwest" | "southeast" | "southwest";

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
    tole: ""

  });

  const [images, setImages] = useState<{ file: File, preview: string }[]>([]);
  //to track all blobUrls
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
    })
    allBlobUrls.current.forEach(URL.revokeObjectURL);
    allBlobUrls.current = [];
    setImages([]);
  }

  //clean up blobURls on unmount
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
  const { data: locations, isLoading: locationLoading, isSuccess } = useGetLocationTree();
  const { mutate, isPending } = useCreateProperty();


  const selectedCategory = categories?.result.find(
    (c) => c.id === formData.categoryId
  );

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

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    let newValue = value;

    // Numeric-only fields
    if (numericFields.includes(name)) {
      // remove non-digit characters
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
      ...prev, [name]: value.trim().replace(/\s+/g, " ")
    }))
  }

  const handleAddImages = (imageFiles: File[]) => {
    const validFiles = imageFiles.filter((file) => {
      if (file.size > 1024 * 1024 * 2) {
        toast.error(`${file.name} is greater than 2MB and was skipped`)
        return false;
      }
      return true;
    });

    setImages((prev: any) => {
      const currentImages = prev;

      // Prevent more than 5
      if (currentImages.length + validFiles.length > 5) {
        toast.error("You can add maximum upto 5 images!!!")
        return prev;
      }

      const newImages = validFiles.map((file) => {
        const preview = URL.createObjectURL(file);
        allBlobUrls.current.push(preview); // Track blob URL
        return { file, preview };
      });
      return [...currentImages, ...newImages];
    });
  }
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (images.length === 0) {
      toast.error("Please add atleast 1 image");
      return;
    }

    const cleanedData = Object.fromEntries(
      Object.entries(formData)
        .filter(([key]) => !["districtId", "municipalityId"].includes(key)) // 🧹 remove unnecessary
        .map(([key, value]) => [key, value === "" ? null : value])
    ) as CreatePropertySchema;
    
    const cleanedImages = images.map((img) => img.file);

    cleanedData.images = cleanedImages;

    mutate(cleanedData, {
      onSuccess: (data) => {
        toast.success(data.message || "Operation Successful!!!");
        resetForm();
      }
    });
  };

  console.log(images);
  return (
    <div className="w-full mx-auto p-4 rounded shadow-lg overflow-auto">
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
              className="w-full px-3 py-2 rounded-md bg-secondary-50 dark:bg-secondary-800 text-secondary-900 dark:text-secondary-50 focus:ring-2 focus:ring-primary-500 focus:outline-none
              placeholder-secondary-400 transition` dark:border-transparent"
              required
            >
              <option value="" hidden disabled>Select Category</option>
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
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-500">
              Rs
            </span>
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



        {/* Location */}

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
                  onClick={() =>
                    setShowLocationModal({ type: "municipality", parentId: formData.districtId })
                  }
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
                    .flatMap((d) => d.municipalities) // get all municipalities
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
                  onClick={() =>
                    setShowLocationModal({ type: "ward", parentId: formData.municipalityId })
                  }
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
            className="w-full px-3 py-2 border rounded bg-secondary-50 dark:bg-secondary-800 text-secondary-900 dark:text-secondary-50 focus:ring-2 focus:ring-primary-500 focus:outline-none
              placeholder-secondary-400 transition dark:border-transparent"
            placeholder="Enter tole/street"
            required
          />
        </div>

        {/* dynamic fields based on category */}

        {/* Dynamic Category-specific Fields */}
        {selectedCategory && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {selectedCategory.isLandAreaNeeded && (
              <div>
                <label className="block font-medium mb-1">Land Area</label>
                <input
                  type="text"
                  name="landArea"
                  value={formData.landArea}
                  inputMode="numeric"
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded bg-secondary-50 dark:bg-secondary-800 text-secondary-900 dark:text-secondary-50 focus:ring-2 focus:ring-primary-500 focus:outline-none
              placeholder-secondary-400 transition dark:border-transparent"
                  required
                />
              </div>
            )}

            {selectedCategory.isNoOfFloorsNeeded && (
              <div>
                <label className="block font-medium mb-1">No. of Floors</label>
                <input
                  type="text"
                  name="noOfFloors"
                  value={formData.noOfFloors}
                  inputMode="numeric"
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded bg-secondary-50 dark:bg-secondary-800 text-secondary-900 dark:text-secondary-50 focus:ring-2 focus:ring-primary-500 focus:outline-none
              placeholder-secondary-400 transition dark:border-transparent"
                  required
                />
              </div>
            )}

            {selectedCategory.isNoOfRoomsNeeded && (
              <div>
                <label className="block font-medium mb-1">No. of Rooms</label>
                <input
                  type="text"
                  name="noOfBedRooms"
                  value={formData.noOfBedRooms}
                  inputMode="numeric"
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded bg-secondary-50 dark:bg-secondary-800 text-secondary-900 dark:text-secondary-50 focus:ring-2 focus:ring-primary-500 focus:outline-none
              placeholder-secondary-400 transition dark:border-transparent"
                  required
                />
              </div>
            )}

            {selectedCategory.isNoOfRestRoomsNeeded && (
              <div>
                <label className="block font-medium mb-1">No. of Rest Rooms</label>
                <input
                  type="text"
                  name="noOfRestRooms"
                  value={formData.noOfRestRooms}
                  inputMode="numeric"
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded bg-secondary-50 dark:bg-secondary-800 text-secondary-900 dark:text-secondary-50 focus:ring-2 focus:ring-primary-500 focus:outline-none
              placeholder-secondary-400 transition dark:border-transparent"
                  required
                />
              </div>
            )}

            {selectedCategory.isAgeOfThePropertyNeeded && (
              <div>
                <label className="block font-medium mb-1">Property Age</label>
                <input
                  type="text"
                  name="propertyAge"
                  value={formData.propertyAge}
                  inputMode="numeric"
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded bg-secondary-50 dark:bg-secondary-800 text-secondary-900 dark:text-secondary-50 focus:ring-2 focus:ring-primary-500 focus:outline-none
              placeholder-secondary-400 transition dark:border-transparent"
                  required
                />
              </div>
            )}

            {selectedCategory.isFacingDirectionNeeded && (
              <div>
                <label className="block font-medium mb-1">Facing Direction</label>
                <select
                  name="facingDirection"
                  value={formData.facingDirection}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded bg-secondary-50 dark:bg-secondary-800 text-secondary-900 dark:text-secondary-50 focus:ring-2 focus:ring-primary-500 focus:outline-none
              placeholder-secondary-400 transition dark:border-transparent"
                  required
                >
                  <option value="" disabled hidden>
                    Select Direction
                  </option>
                  <option value="east">East</option>
                  <option value="west">West</option>
                  <option value="north">North</option>
                  <option value="south">South</option>
                  <option value="northeast">Northeast</option>
                  <option value="northwest">Northwest</option>
                  <option value="southeast">Southeast</option>
                  <option value="southwest">Southwest</option>
                </select>
              </div>

            )}

            {selectedCategory.isFloorAreaNeeded && (
              <div>
                <label className="block font-medium mb-1">Floor Area</label>
                <input
                  type="text"
                  name="floorArea"
                  value={formData.floorArea}
                  inputMode="numeric"
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded bg-secondary-50 dark:bg-secondary-800 text-secondary-900 dark:text-secondary-50 focus:ring-2 focus:ring-primary-500 focus:outline-none
              placeholder-secondary-400 transition dark:border-transparent"
                  required
                />
              </div>
            )}

            {selectedCategory.isFloorLevelNeeded && (
              <div>
                <label className="block font-medium mb-1">Floor Level</label>
                <input
                  type="text"
                  name="floorLevel"
                  value={formData.floorLevel}
                  inputMode="numeric"
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded bg-secondary-50 dark:bg-secondary-800 text-secondary-900 dark:text-secondary-50 focus:ring-2 focus:ring-primary-500 focus:outline-none
              placeholder-secondary-400 transition dark:border-transparent"
                  placeholder="eg: 0 means GroundFloor"
                  required
                />
              </div>
            )}

            {selectedCategory.isRoadSizeNeeded && (
              <div>
                <label className="block font-medium mb-1">Road Size</label>
                <input
                  type="text"
                  name="roadSize"
                  value={formData.roadSize}
                  inputMode="numeric"
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded bg-secondary-50 dark:bg-secondary-800 text-secondary-900 dark:text-secondary-50 focus:ring-2 focus:ring-primary-500 focus:outline-none
              placeholder-secondary-400 transition dark:border-transparent"
                  required
                />
              </div>
            )}
          </div>
        )}

        {/* Images Upload */}
        <div>
          <label className="block font-medium mb-1">Images</label>
          <div className="flex items-center gap-4">
            <label
              className="px-4 py-2 bg-primary-500 text-white rounded cursor-pointer hover:bg-primary-600"
            >
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

            {/* Preview thumbnails */}
            <div className="flex gap-2 overflow-x-auto">
              {images?.map((img: any, idx: number) => (
                <div key={idx} className="relative group">
                  <img
                    src={img.preview}
                    alt={`preview-${idx}`}
                    className="w-20 h-20 object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      // revoke blob URL when removed
                      URL.revokeObjectURL(img.preview);
                      setImages((prev) => prev.filter((_, i) => i !== idx));
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
          <p className="text-sm text-gray-500 mt-1">
            Max 5 images, each not more than 2MB.
          </p>
        </div>
        {user === "admin" && (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="verified"
              id="verified"
              checked={formData.verified}
              onChange={() =>
                setFormData((prev: any) => ({
                  ...prev,
                  verified: !prev.verified,
                }))
              }
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
            className={`px-4 py-2 bg-primary-500 text-white rounded transition 
    ${isPending ? "opacity-70 cursor-not-allowed" : "hover:bg-primary-600"}`}
          >
            {isPending ? <Loader2 className="animate-spin" /> : "Add Property"}
          </button>

        </div>
      </form>

      {/* Modals */}
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
