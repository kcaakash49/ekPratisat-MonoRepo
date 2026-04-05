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

    if (zones.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
                <div className="text-2xl font-semibold text-gray-800">
                    No zones found
                </div>

                <p className="text-gray-500 max-w-sm">
                    You haven’t created any geo zones yet. Start by creating your first zone
                    to manage area-based assignments.
                </p>

                <button
                    onClick={() => router.push("/admin/geo-zones")}
                    className="px-5 py-2 rounded-lg bg-black text-white hover:opacity-90 transition"
                >
                    Create your first zone
                </button>
            </div>
        );
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
                            onClick={() => router.push(`/admin/geo-zones/${zone.id}`)}
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