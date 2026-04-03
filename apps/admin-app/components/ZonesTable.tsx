"use client";

import { useState } from "react";
import { useZonesQuery } from "@repo/query-hook";
import { useDeleteZoneMutation } from "@repo/query-hook";
import { useQueryClient } from "@tanstack/react-query";
import DeleteZoneModal from "./DeleteZoneModal";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ZonesTable() {
    const { data: zones = [], isLoading } = useZonesQuery();
    const { mutate, isPending } = useDeleteZoneMutation();
    const queryClient = useQueryClient();
    const router = useRouter();

    const [selectedZone, setSelectedZone] = useState<any>(null);

    if (isLoading) {
        return <div>Loading zones...</div>;
    }

    return (
        <div className="space-y-4">
            {/* TABLE */}
            <div className="border rounded">
                <div className="grid grid-cols-3 p-3 font-semibold border-b">
                    <div>Name</div>
                    <div>Notes</div>
                    <div className="text-right">Actions</div>
                </div>

                {zones.map((zone: any) => (
                    <div
                        key={zone.id}
                        className="grid grid-cols-3 p-3 border-b items-center"
                    >
                        {/* CLICKABLE NAME */}
                        <div
                            className="cursor-pointer text-blue-600"
                            onClick={() => router.push(`/zones/${zone.id}`)}
                        >
                            {zone.name}
                        </div>

                        <div>{zone.notes || "-"}</div>

                        <div className="flex justify-end">
                            <button
                                className="text-red-600"
                                onClick={() => setSelectedZone(zone)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* MODAL */}
            {selectedZone && (
                <DeleteZoneModal
                    open={!!selectedZone}
                    zone={selectedZone}
                    loading={isPending}
                    onClose={() => setSelectedZone(null)}
                    onConfirm={() => {
                        mutate(
                            { id: selectedZone.id },
                            {
                                onSuccess: () => {
                                    toast.success("Zone deleted successfully!!!");
                                    queryClient.invalidateQueries({ queryKey: ["zones"] });
                                    setSelectedZone(null);
                                },
                                onError: (error) => {
                                    toast.error(error.message || "Failed to delete zone!!!");   
                                }
                            }
                        );
                    }}
                />
            )}
        </div>
    );
}