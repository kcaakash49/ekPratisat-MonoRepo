"use client";
import { useUpdateCoverImage } from "@repo/query-hook";
import { Button } from "@repo/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@repo/ui/dialog";
import { useQueryClient } from "@tanstack/react-query";
import { Check, Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface PropertyImage {
  id: string;
  url: string;
}

interface Props {
  propertyId: string;
  images: PropertyImage[];
  coverImageId: string | null | undefined;
  text?: string;
}

export default function UpdateCoverImage({ propertyId, images, coverImageId, text = "Change Cover" }: Props) {
  const [open, setOpen] = useState(false);
  const [coverId, setCoverId] = useState(coverImageId ? coverImageId : "");

  const { mutate, isPending } = useUpdateCoverImage(propertyId);
  const queryClient = useQueryClient();

  const handleOpenDialog = () => {
    setOpen(true);
    setCoverId(coverImageId ? coverImageId : "");
  };

  const handleCoverUpdate = async () => {
    if (!coverId) {
      toast.error("Please select an image first!");
      return;
    }

    mutate(coverId, {
      onSuccess: (data) => {
        toast.success(data.message || "Operation Success!!!");
        queryClient.invalidateQueries({
          queryKey: ["property-detail", propertyId],
        });
        setOpen(false);
      },
    });
  };

  return (
    <>
      <button
        onClick={handleOpenDialog}
        className="inline-flex items-center gap-1.5 px-3 py-2 border border-secondary-200 dark:border-secondary-800 hover:bg-secondary-50 dark:hover:bg-secondary-800 rounded-xl text-xs font-semibold text-secondary-700 dark:text-secondary-300 transition-colors"
      >
        <ImageIcon className="w-3.5 h-3.5 text-secondary-400" />
        <span>{text}</span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent onClose={() => setOpen(false)} className="max-w-lg sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Update Cover Picture</DialogTitle>
          </DialogHeader>

          {/* 🖼️ Grid Section for rendering Gallery Images */}
          <div className="py-4">
            {images.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-secondary-200 dark:border-secondary-800 rounded-xl">
                <p className="text-sm text-secondary-500">No images uploaded for this property yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3 max-h-[350px] overflow-y-auto p-1">
                {images.map((img) => {
                  const isSelected = coverId === img.id;
                  return (
                    <button
                      key={img.id}
                      type="button"
                      onClick={() => setCoverId(img.id)}
                      className={`relative aspect-[4/3] group rounded-xl overflow-hidden border-2 transition-all cursor-pointer bg-secondary-100 dark:bg-secondary-900 ${
                        isSelected
                          ? "border-blue-600 ring-2 ring-blue-600/20 scale-[0.98]"
                          : "border-transparent hover:border-secondary-300 dark:hover:border-secondary-700"
                      }`}
                    >
                      {/* Thumbnail Image */}
                      <img
                        src={`${process.env.NEXT_PUBLIC_BASE_URL}${img.url}`}
                        alt="Property preview"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />

                      {/* Dark Overlay when active or hovered */}
                      <div
                        className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${
                          isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                        }`}
                      >
                        {isSelected ? (
                          <div className="bg-blue-600 text-white rounded-full p-1.5 shadow-md">
                            <Check className="w-4 h-4 stroke-[3]" />
                          </div>
                        ) : (
                          <span className="text-xs text-white font-medium bg-black/60 px-2 py-1 rounded-md">
                            Set Cover
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setOpen(false);
                setCoverId("");
              }}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCoverUpdate}
              disabled={isPending || !coverId}
              className="bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}