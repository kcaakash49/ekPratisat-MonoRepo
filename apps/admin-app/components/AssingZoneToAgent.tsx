"use client";

import { useState, useMemo, useEffect } from "react";
import {
    useAssignZoneToAgentMutation,
    useZonesQuery,
} from "@repo/query-hook";
import { useQueryClient } from "@tanstack/react-query";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@repo/ui/dialog";
import { toast } from "sonner";

interface Props {
    agentId: string;
}

interface Zone {
    id: string;
    name: string;
    notes?: string | null;
    geom: GeoJSON.GeoJSON;

}

export default function AssignZoneToAgent({ agentId }: Props) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
    const [debouncedSearch, setDebouncedSearch] = useState(search);
    const { mutate, isPending } = useAssignZoneToAgentMutation();
    const queryClient = useQueryClient();

    const { data: zones = [], isLoading } = useZonesQuery();

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 300);

        return () => clearTimeout(timer);
    }, [search]);


    // 🔍 filter zones (frontend search)
    const filteredZones = useMemo(() => {
        return zones.filter((z: Zone) =>
            z.name.toLowerCase().includes(debouncedSearch.toLowerCase())
        );
    }, [zones, debouncedSearch]);

    const handleAssign = () => {
        if (!selectedZoneId) return;

        mutate(
            {
                agentId,
                zoneId: selectedZoneId,
            },
            {
                onSuccess: () => {
                    toast.success("Zone assigned successfully!");
                    queryClient.invalidateQueries({
                        queryKey: ["agent-detail", agentId]
                    })
                    setOpen(false);
                    setSelectedZoneId(null);
                    setSearch("");
                },
            }
        );
    };

    return (
        <>
            {/* Trigger */}
            <button
                onClick={() => setOpen(true)}
                className="w-full flex items-center gap-3 p-3 text-left hover:bg-secondary-50 dark:hover:bg-secondary-700 rounded-lg transition-colors group"
            >
                <svg
                    className="w-5 h-5 text-green-500 group-hover:text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                <div>
                    <div className="font-medium">Assign Zone</div>
                    <div className="text-sm text-gray-500">
                        Select a zone to assign
                    </div>
                </div>
            </button>

            {/* Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Assign Zone</DialogTitle>
                    </DialogHeader>

                    {/* Search */}
                    <input
                        type="text"
                        placeholder="Search zones..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2"
                    />

                    {/* Zone List */}
                    <div className="max-h-60 overflow-y-auto border rounded-lg">
                        {isLoading ? (
                            <div className="p-4 text-sm text-gray-500">
                                Loading zones...
                            </div>
                        ) : filteredZones.length === 0 ? (
                            <div className="p-4 text-sm text-gray-500">
                                No zones found
                            </div>
                        ) : (
                            filteredZones.map((zone: Zone) => (
                                <div
                                    key={zone.id}
                                    onClick={() => setSelectedZoneId(zone.id)}
                                    className={`p-3 cursor-pointer text-sm flex justify-between ${selectedZoneId === zone.id
                                            ? "bg-blue-50"
                                            : "hover:bg-gray-50"
                                        }`}
                                >
                                    <span>{zone.name}</span>

                                    {selectedZoneId === zone.id && (
                                        <span className="text-blue-600 text-xs">Selected</span>
                                    )}
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    <DialogFooter>
                        <button
                            onClick={() => setOpen(false)}
                            className="px-4 py-2 text-sm border rounded-lg"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={handleAssign}
                            disabled={!selectedZoneId || isPending}
                            className="px-4 py-2 text-sm bg-black text-white rounded-lg disabled:opacity-50"
                        >
                            {isPending ? "Assigning..." : "Assign"}
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}