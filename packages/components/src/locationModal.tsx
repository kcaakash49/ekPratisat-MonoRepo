"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { SessionUser } from "@repo/validators";
import { toast } from "sonner";

import ButtonLoader from "@repo/ui/buttonLoader";
import { useCreateDistrict, useCreateMunicipality, useCreateWard } from "@repo/query-hook";
import { useQueryClient } from "@tanstack/react-query";

type LocationType = "district" | "municipality" | "ward";

type Props = {
  type: LocationType;
  parentId?: string; // districtId for municipality, municipalityId for ward
  user: string;
  onClose: () => void;
};

export const LocationModal: React.FC<Props> = ({ type, parentId, user, onClose }) => {
  const [name, setName] = useState("");

  const queryClient = useQueryClient();

  const districtMutation = useCreateDistrict();
  const municpalityMutation = useCreateMunicipality();
  const wardMutation = useCreateWard();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const successHandler = (data: { status: number, message: string }) => {
    toast.success(data.message || "Success");
    queryClient.invalidateQueries({
      queryKey: ['location']
    });
    onClose();
  }

  const handleblur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.preventDefault();
    setName(name.trim().replace(/\s+/g, " "))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log(name);
    if (type === "district") {
      districtMutation.mutate({ name }, {
        onSuccess: successHandler
      })
    };

    if (type === "municipality") {
      municpalityMutation.mutate({ name, parentId: parentId! }, {
        onSuccess: successHandler
      })
    }

    if (type === "ward") {
      wardMutation.mutate({ name, parentId: parentId! }, {
        onSuccess: successHandler
      })
    }
  };

  const titleMap: Record<LocationType, string> = {
    district: "Add District",
    municipality: "Add Municipality",
    ward: "Add Ward",
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 dark:bg-black/60 z-50 p-2">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-secondary-800 p-6 rounded-lg w-full max-w-sm shadow-lg"
      > 
        <h2 className="text-xl font-bold mb-4 text-secondary-900 dark:text-secondary-50">
          {titleMap[type]}
        </h2>

        {/* Name */}
        <div className="mb-4">
          <label className="block font-medium mb-1 text-secondary-700 dark:text-secondary-200">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={handleChange}
            onBlur={handleblur}
            className="w-full px-3 py-2 border rounded bg-secondary-50 dark:bg-secondary-900 text-secondary-900 dark:text-secondary-50"
            required
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded bg-secondary-300 dark:bg-secondary-700 text-secondary-900 dark:text-secondary-50 hover:bg-secondary-400 dark:hover:bg-secondary-600"
            disabled = {districtMutation.isPending || wardMutation.isPending || municpalityMutation.isPending}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-primary-500 dark:bg-primary-600 text-white hover:bg-primary-600 dark:hover:bg-primary-700"
            disabled = {districtMutation.isPending || wardMutation.isPending || municpalityMutation.isPending}
          >
            {
              districtMutation.isPending || wardMutation.isPending || municpalityMutation.isPending ? <ButtonLoader/> : "Add"
            }
          </button>
        </div>
      </form>
    </div>
  );
};
