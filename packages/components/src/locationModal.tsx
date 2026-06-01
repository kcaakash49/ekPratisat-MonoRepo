"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
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
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  const [name, setName] = useState("");

  const queryClient = useQueryClient();

  const districtMutation = useCreateDistrict();
  const municpalityMutation = useCreateMunicipality();
  const wardMutation = useCreateWard();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const successHandler = (data: { message: string }) => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-2 backdrop-blur-[2px] dark:bg-black/60">
      <form
        onSubmit={handleSubmit}
        className="ek-form-shell w-full max-w-sm"
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
            className="ek-secondary-button"
            disabled = {districtMutation.isPending || wardMutation.isPending || municpalityMutation.isPending}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="ek-primary-button"
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
