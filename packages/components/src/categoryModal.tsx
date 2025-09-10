"use client";

import { CategorySchema, SessionUser } from "@repo/validators";
import React, { useState, ChangeEvent, FormEvent } from "react";


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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.image) {
      alert("Please fill in all required fields");
      return;
    }
    const data = new FormData();

    data.append("name", formData.name.replace(/\s+/g, " ").trim());
    data.append("image", formData.image);
    data.append("addedById", user?.id || "" )
    Object.entries(formData).forEach(([key, value]) => {
      if (typeof value === "boolean") {
        data.append(key, String(value));
      }
    });
    
    
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 dark:bg-black/60 z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-secondary-800 p-6 rounded-lg w-full max-w-md shadow-lg"
      >
        <h2 className="text-xl font-bold mb-4 text-secondary-900 dark:text-secondary-50">
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
          {booleanFields.map(({ key, label }) => (
            <div key={key} className="flex items-center mb-1">
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
                className="mr-2 accent-primary-500 dark:accent-primary-600"
              />
              <label className="text-secondary-700 dark:text-secondary-200">
                {label}
              </label>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 mt-4">
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
            {
              "Save"
            }
          </button>
        </div>
      </form>
    </div>
  );
};
