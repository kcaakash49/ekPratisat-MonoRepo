
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
            <button className="rounded-xl border border-[var(--ek-border-soft)] bg-[var(--ek-bg-card-soft)] p-2.5 text-[var(--ek-text-secondary)] shadow-sm transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600 dark:border-[var(--ek-dark-border)] dark:bg-[var(--ek-dark-elevated)] dark:text-[var(--ek-dark-muted)] dark:hover:border-red-400/35 dark:hover:bg-red-500/12 dark:hover:text-red-200" onClick={(e) => {
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
                            className="bg-red-600 text-white hover:bg-red-700"
                        >
                            {isPending ? "Confirming......." : "Confirm"}
                            
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
