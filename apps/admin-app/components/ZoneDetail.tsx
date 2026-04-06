"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { useZoneQueryById } from "@repo/query-hook";
import Link from "next/link";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN as string;

interface PropertyPoint {
    id: string;
    title: string;
    type: string;
    lat: number;
    lng: number;
}

interface Zone {
    id: string;
    name: string;
    notes?: string | null;
    geom: GeoJSON.GeoJSON;
    properties: PropertyPoint[];
}

export default function ZoneDetail({ id }: { id: string }) {
    const mapRef = useRef<HTMLDivElement | null>(null);
    const mapInstance = useRef<mapboxgl.Map | null>(null);

    const { data: zone, isLoading, error } = useZoneQueryById(id);



    useEffect(() => {
        if (!zone || !mapRef.current || mapInstance.current) return;

        const map = new mapboxgl.Map({
            container: mapRef.current,
            style: "mapbox://styles/mapbox/streets-v12",
            center: [84.124, 28.3949],
            zoom: 6,
        });

        mapInstance.current = map;

        map.on("load", () => {
            // add zone polygon
            map.addSource("zone", {
                type: "geojson",
                data: zone.geom,
            });

            map.addLayer({
                id: "zone-fill",
                type: "fill",
                source: "zone",
                paint: {
                    "fill-color": "#3b82f6",
                    "fill-opacity": 0.2,
                },
            });

            map.addLayer({
                id: "zone-outline",
                type: "line",
                source: "zone",
                paint: {
                    "line-color": "#2563eb",
                    "line-width": 2,
                },
            });

            // add property markers
            zone.properties.forEach((property: PropertyPoint) => {
                // Use setHTML instead of setText
                const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
                    `<div class="mapbox-popup-content">
        <p class="popup-title">${property.title}</p>
     </div>`
                );

                new mapboxgl.Marker({ color: "#ef4444" }) // Your red marker
                    .setLngLat([property.lng, property.lat])
                    .setPopup(popup)
                    .addTo(map);
            });


            // fit bounds to zone
            const bounds = new mapboxgl.LngLatBounds();

            const coords = (zone.geom as any).coordinates.flat(2);
            coords.forEach((coord: [number, number]) => bounds.extend(coord));

            if (!bounds.isEmpty()) {
                map.fitBounds(bounds, { padding: 40, duration: 800 });
            }
        });

        return () => {
            map.remove();
            mapInstance.current = null;
        };
    }, [zone]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="animate-pulse text-gray-500">Loading zone...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="text-red-500">Error loading zone: {error.message}</div>
            </div>
        );
    }

    if (!zone) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="text-gray-500">Zone not found</div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6 bg-secondary-50 dark:bg-secondary-900 min-h-screen transition-colors">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-secondary-900 dark:text-secondary-50 tracking-tight">
                        {zone.name}
                    </h1>
                    {zone.notes && (
                        <p className="text-secondary-500 dark:text-secondary-400 mt-2 max-w-xl leading-relaxed">
                            {zone.notes}
                        </p>
                    )}
                </div>

                <button className="px-5 py-2.5 rounded-xl font-medium border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 text-secondary-700 dark:text-secondary-200 hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-all shadow-sm active:scale-95">
                    Edit Zone
                </button>
            </div>

            {/* Stats */}
            <div className="flex gap-4">
                <div className="px-6 py-4 bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-2xl shadow-sm">
                    <div className="text-xs font-bold uppercase tracking-wider text-secondary-400 dark:text-secondary-500 mb-1">
                        Total Properties
                    </div>
                    <div className="text-3xl font-bold text-primary-600 dark:text-primary-dark-500">
                        {zone.properties.length}
                    </div>
                </div>
            </div>

            {/* Map Container */}
            <div className="rounded-3xl overflow-hidden border border-secondary-200 dark:border-secondary-700 shadow-lg bg-white dark:bg-secondary-800 p-1">
                <div ref={mapRef} className="w-full h-[600px] rounded-[1.4rem]" />
            </div>

            {/* Property list */}
            {zone.properties.length > 0 && (
                <div className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-2xl shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-secondary-100 dark:border-secondary-700 bg-secondary-50/50 dark:bg-secondary-800/50">
                        <h3 className="font-semibold text-secondary-800 dark:text-secondary-100">
                            Properties in this zone
                        </h3>
                    </div>

                    <div className="divide-y divide-secondary-100 dark:divide-secondary-700">
                        {zone.properties.map((property: PropertyPoint) => (
                            <div
                                key={property.id}
                                className="px-6 py-4 flex justify-between items-center hover:bg-primary-50/30 dark:hover:bg-primary-900/10 transition-colors group"
                            >
                                <div className="flex flex-col">
                                    <Link
                                        href={`/admin/property/${property.id}`}
                                        className="font-semibold text-secondary-700 dark:text-secondary-200 group-hover:text-primary-600 dark:group-hover:text-primary-dark-500 transition-colors"
                                    >
                                        {property.title}
                                    </Link>
                                    <span className="text-xs font-medium text-secondary-400 dark:text-secondary-500 uppercase tracking-tighter mt-0.5">
                                        Ref ID: {property.id.slice(0, 8)}
                                    </span>
                                </div>

                                <div className="px-3 py-1 rounded-full text-xs font-bold bg-secondary-100 dark:bg-secondary-700 text-secondary-600 dark:text-secondary-300 uppercase">
                                    {property.type}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>

    );
}
