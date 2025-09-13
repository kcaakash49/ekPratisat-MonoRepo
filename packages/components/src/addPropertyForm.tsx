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

export const AddPropertyForm: React.FC<Props> = ({ user }) => {
  const [formData, setFormData] = useState<any>({
    title: "",
    description: "",
    type: "sale",
    categoryId: "",
    districtId: "",
    municipalityId: "",
    wardId: "",
  });

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState<{
    type: "district" | "municipality" | "ward";
    parentId?: string;
  } | null>(null);

  const { data: categories, isLoading: categoryLoading } = useGetCatgories();
  const { data: locations, isLoading: locationLoading, isSuccess } = useGetLocationTree();

  if (isSuccess) {
    console.log(locations);
  }




  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // mutation or submission logic goes here
    console.log("Submitted property:", formData);
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
              className="px-3 py-2 bg-primary-500 text-white rounded"
              onClick={() => setShowCategoryModal(true)}
            >
              Add
            </button>
          )}
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

        

        <div>
          <label className="block font-medium mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded bg-secondary-50 dark:bg-secondary-900 text-secondary-900 dark:text-secondary-50"
            required
          />
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
