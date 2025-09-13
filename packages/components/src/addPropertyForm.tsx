"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import ButtonLoader from "@repo/ui/buttonLoader";
import { SessionUser } from "@repo/validators";
import { CategoryModal } from "./categoryModal";
import { LocationModal } from "./locationModal";
import { useGetCatgories, useGetLocationTree } from "@repo/query-hook";



type Props = {
  user: SessionUser;
};

type DirectionType = "east" | "west" | "north" | "south" | "northeast" | "northwest" | "southeast" | "southwest";

export const AddPropertyForm: React.FC<Props> = ({ user }) => {
  const [formData, setFormData] = useState<any>({
    title: "",
    description: "",
    type: "sale",
    categoryId: "",
    districtId: "",
    municipalityId: "",
    wardId: "",
    price: "",
    userId: "",
    noOfBedRooms: "",
    noOfRestRooms: "",
    landArea: "",
    noOfFloors: "",
    propertyAge: "",
    facingDirection: "" as DirectionType,
    floorArea: "",
    roadSize: "",
    Verified: false,
    locaitonId: "",
    floorLevel: "",
    tole: "",
    images: []

  });

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState<{
    type: "district" | "municipality" | "ward";
    parentId?: string;
  } | null>(null);

  const { data: categories, isLoading: categoryLoading } = useGetCatgories();
  const { data: locations, isLoading: locationLoading, isSuccess } = useGetLocationTree();


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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // mutation or submission logic goes here
    console.log("Submitted property:", formData);

    const cleanedData = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [key, value === "" ? null : value])
    );

    console.log("Cleaned Data", cleanedData);
  };

  return (
    <div className="w-full mx-auto p-4 bg-white dark:bg-secondary-800 rounded shadow-lg overflow-auto">
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
            className="w-full px-3 py-2 border rounded bg-secondary-50 dark:bg-secondary-900 text-secondary-900 dark:text-secondary-50"
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
            className="w-full px-3 py-2 border rounded bg-secondary-50 dark:bg-secondary-900 text-secondary-900 dark:text-secondary-50"
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
            className="w-full px-3 py-2 border rounded bg-secondary-50 dark:bg-secondary-900 text-secondary-900 dark:text-secondary-50"
            required
          >
            <option value="sale">Sale</option>
            <option value="rent">Rent</option>
          </select>
        </div>

        {/* Category */}
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <label className="block font-medium mb-1">Category</label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded bg-secondary-50 dark:bg-secondary-900 text-secondary-900 dark:text-secondary-50"
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
          </div>
          {user.role === "admin" && (
            <button
              type="button"
              className="px-2 py-1 bg-primary-500 text-white rounded"
              onClick={() => setShowCategoryModal(true)}
            >
              Add
            </button>
          )}
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
              className="w-full pl-10 px-3 py-2 border rounded bg-secondary-50 dark:bg-secondary-900 text-secondary-900 dark:text-secondary-50"
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
                  setFormData((prev: any) => ({ ...prev, municipalityId: "", wardId: "" }));
                }}
                className="flex-1 px-2 py-1 border rounded"
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

              {user.role === "admin" && (
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
                  setFormData((prev: any) => ({ ...prev, wardId: "" }));
                }}
                className="flex-1 px-2 py-1 border rounded"
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

              {user.role === "admin" && formData.districtId && (
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
                name="wardId"
                value={formData.wardId}
                onChange={handleChange}
                className="flex-1 px-2 py-1 border rounded"
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

              {user.role === "admin" && formData.municipalityId && (
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
                  className="w-full px-3 py-2 border rounded "
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
                  className="w-full px-3 py-2 border rounded"
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
                  className="w-full px-3 py-2 border rounded"
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
                  className="w-full px-3 py-2 border rounded"
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
                  className="w-full px-3 py-2 border rounded"
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
                  className="w-full px-3 py-2 border rounded"
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
                  className="w-full px-3 py-2 border rounded"
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
                  className="w-full px-3 py-2 border rounded"
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
                  className="w-full px-3 py-2 border rounded"
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
                  setFormData((prev: any) => ({
                    ...prev,
                    images: [...(prev.images || []), ...files],
                  }));
                }}
              />
            </label>

            {/* Preview thumbnails */}
            <div className="flex gap-2 overflow-x-auto">
              {formData.images?.map((file: File, idx: number) => (
                <div key={idx} className="relative group">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`preview-${idx}`}
                    className="w-20 h-20 object-cover rounded border"
                  />
                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev: any) => ({
                        ...prev,
                        images: prev.images.filter((_: File, i: number) => i !== idx),
                      }))
                    }
                    className="absolute top-0 right-0 bg-black/60 text-white text-xs px-1 rounded opacity-0 group-hover:opacity-100 transition"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>



        {/* Submit */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            type="submit"
            className="px-4 py-2 bg-primary-500 text-white rounded"
          >
            Add Property
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
