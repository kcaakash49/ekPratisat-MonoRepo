"use client";

import { categorySchema, CategorySchema } from "@repo/validators";
import React from "react";
import { useForm, Controller } from "react-hook-form";



type Props = {
  onSubmit: (data: CategorySchema) => void;
  onClose: () => void;
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

export const CategoryModal: React.FC<Props> = ({ onSubmit, onClose }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CategorySchema>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      image: undefined,
      isLandAreaNeeded: false,
      isNoOfFloorsNeeded: false,
      isNoOfRoomsNeeded: false,
      isAgeOfThePropertyNeeded: false,
      isNoOfRestRoomsNeeded: false,
      isFacingDirectionNeeded: false,
      isFloorAreaNeeded: false,
      isFloorLevelNeeded: false,
      isRoadSizeNeeded: false,
    },
  });

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-lg w-full max-w-md"
      >
        <h2 className="text-xl font-bold mb-4">Add Category</h2>

        {/* Category Name */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Category Name</label>
          <input
            type="text"
            {...register("name")}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        {/* Category Image */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Category Image</label>
          <input type="file" {...register("image" as any)} />
          {errors.image && (
            <p className="text-red-500 text-sm">{errors.image.message}</p>
          )}
        </div>

        {/* Boolean Fields */}
        <div className="mb-4">
          <p className="font-medium mb-2">Property Fields</p>
          {booleanFields.map(({ key, label }) => (
            <div key={key} className="flex items-center mb-1">
              <Controller
                control={control}
                name={key as any}
                render={({ field }) => (
                  <input
                    type="checkbox"
                    {...field}
                    checked={field.value}
                    className="mr-2"
                  />
                )}
              />
              <label>{label}</label>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};
