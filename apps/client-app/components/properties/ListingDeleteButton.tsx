
"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@repo/ui/dialog";
import { Button } from "@repo/ui/button";
import { useDeactivateListing } from "@repo/query-hook";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { revalidateTagPathAction, revalidateWithUserId } from "../../actions/revalidateAction";

export default function ListingDeleteButton({ id, isVerified }: { id: string, isVerified: boolean }) {
    const [open,setOpen] = useState(false);
    const {mutate,isPending} = useDeactivateListing();
    const queryClient = useQueryClient();
    const router = useRouter();

    const handleDelete = () => {
        mutate({id}, {
            onSuccess: async(data) => {
                toast.success(data.message || "Operation Successful!!!");
                queryClient.invalidateQueries({
                    queryKey: ["property-detail", id]
                });
                if (isVerified){
                    await revalidateTagPathAction({tag:["properties","favourite"], path: `/properties/${id}`});
                    await revalidateWithUserId({tag:"listings"});
                    router.refresh();
                    return;
                }

                await revalidateWithUserId({tag:"listings"});
                router.refresh();
                
            }
        })
    }
    return (
        <>
            <button className="p-2.5 text-secondary-600 dark:text-secondary-400 bg-secondary-50 dark:bg-secondary-800 hover:bg-red-500 hover:text-white rounded-xl transition-all border border-transparent shadow-sm" onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setOpen(true);
            }}
           >
                <Trash2 size={18} />
            </button>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent onClose={() => setOpen(false)} className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Delete Listing</DialogTitle>
                    </DialogHeader>

                    {/* FIX: Use proper grid/flex layout */}
                    <div className="space-y-4">
                        <p className="text-secondary-600 dark:text-secondary-300 text-sm break-words whitespace-normal">
                            Are you sure you want to delete this listing? This action cannot be undone.
                        </p>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setOpen(false);
                            }}
                            // disabled={isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleDelete}
                            disabled={isPending}
                            className="bg-primary-600 hover:bg-primary-700 text-white"
                        >
                            {isPending ? "Confirming......." : "Confirm"}
                            
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}