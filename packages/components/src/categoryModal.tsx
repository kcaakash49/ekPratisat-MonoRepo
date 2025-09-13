"use client";

import { addCategoryAction } from "@repo/actions";
import { useCreateCategory } from "@repo/query-hook";
import ButtonLoader from "@repo/ui/buttonLoader";
import { CategorySchema, SessionUser } from "@repo/validators";
import { useQueryClient } from "@tanstack/react-query";
import React, { useState, ChangeEvent, FormEvent } from "react";
import { toast } from "sonner";


type Props = {
  onClose: () => void;
  user: SessionUser;
};

const booleanFields: { key: keyof CategorySchema; label: string }[] = [
  { key: "isLandAreaNeeded", label: "Land Area" },
  { key: "isNoOfFloorsNeeded", label: "Number of Floors" },
  { key: "isNoOfRoomsNeeded", label: "Number of Rooms" },
  { key: "isAgeOfThePropertyNeeded", label: "Age of Property" },
  { key: "isNoOfRestRoomsNeeded", label: "Number of Restrooms" },
  { key: "isFacingDirectionNeeded", label: "Facing Direction" },
  { key: "isFloorAreaNeeded", label: "Floor Area" },
  { key: "isFloorLevelNeeded", label: "Floor Level" },
  { key: "isRoadSizeNeeded", label: "Road Size" },
];

export const CategoryModal: React.FC<Props> = ({ onClose, user }) => {
  const [formData, setFormData] = useState<CategorySchema>({
    name: "",
    image: undefined as unknown as File,
    isLandAreaNeeded: false,
    isNoOfFloorsNeeded: false,
    isNoOfRoomsNeeded: false,
    isAgeOfThePropertyNeeded: false,
    isNoOfRestRoomsNeeded: false,
    isFacingDirectionNeeded: false,
    isFloorAreaNeeded: false,
    isFloorLevelNeeded: false,
    isRoadSizeNeeded: false,
  });
  
  const queryClient = useQueryClient();
  const createCategory = useCreateCategory();
  
  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    }
  };


  const handleSubmit = async(e: FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData, name: formData.name.replace(/\s+/g, " ").trim(), addedById: user.id
    }
    createCategory.mutate(payload, {
      onSuccess: () => {
        toast.success("Category Created Successfully!!!");
        queryClient.invalidateQueries({
          queryKey: ["categories"]
        })
        setTimeout(() => {
          onClose();
        }, 1000);
      }
    })
    
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 dark:bg-black/60 z-50 p-2 overflow-auto">
  <form
    onSubmit={handleSubmit}
    className="bg-white dark:bg-secondary-800 rounded-lg shadow-lg w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl p-4 sm:p-6 md:p-8 m-auto"
  >
    <h2 className="text-xl sm:text-2xl font-bold mb-4 text-secondary-900 dark:text-secondary-50">
      Add Category
    </h2>

    {/* Name */}
    <div className="mb-4">
      <label className="block font-medium mb-1 text-secondary-700 dark:text-secondary-200">
        Category Name
      </label>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleTextChange}
        className="w-full border border-secondary-300 dark:border-secondary-600 px-3 py-2 rounded bg-secondary-50 dark:bg-secondary-900 text-secondary-900 dark:text-secondary-50 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600"
        required
      />
    </div>

    {/* Image */}
    <div className="mb-4">
      <label className="block font-medium mb-1 text-secondary-700 dark:text-secondary-200">
        Category Image
      </label>
      <input
        type="file"
        name="image"
        onChange={handleFileChange}
        className="text-secondary-900 dark:text-secondary-50"
        required
      />
    </div>

    {/* Boolean Fields */}
    <div className="mb-4">
      <p className="font-medium mb-2 text-secondary-800 dark:text-secondary-200">
        Property Fields
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        {booleanFields.map(({ key, label }) => (
          <label
            key={key}
            className="flex items-center gap-2 text-secondary-700 dark:text-secondary-200"
          >
            <input
              type="checkbox"
              name={key}
              checked={formData[key] as boolean}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  [key]: e.target.checked,
                }))
              }
              className="accent-primary-500 dark:accent-primary-600"
            />
            {label}
          </label>
        ))}
      </div>
    </div>

    {/* Buttons */}
    <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
      <button
        type="button"
        onClick={onClose}
        className="px-4 py-2 rounded bg-secondary-300 dark:bg-secondary-700 text-secondary-900 dark:text-secondary-50 hover:bg-secondary-400 dark:hover:bg-secondary-600"
      >
        Cancel
      </button>
      <button
        type="submit"
        className="px-4 py-2 rounded bg-primary-500 dark:bg-primary-600 text-white hover:bg-primary-600 dark:hover:bg-primary-700"
      >
        {createCategory.isPending ? <ButtonLoader /> : "Add"}
      </button>
    </div>
  </form>
</div>

  );
};
