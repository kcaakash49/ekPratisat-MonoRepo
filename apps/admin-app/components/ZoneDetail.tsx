"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { useZoneQueryById } from "@repo/query-hook";
import Link from "next/link";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN as string;

interface PropertyPoint {
  id: string;
  title: string;
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

export default function ZoneDetail({ id }: {id:string}) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);

  const {data: zone, isLoading, error} = useZoneQueryById(id);



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
      zone.properties.forEach((property:PropertyPoint) => {
        const popup = new mapboxgl.Popup({ offset: 25 }).setText(
          property.title
        );

        new mapboxgl.Marker({ color: "#ef4444" })
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

  if(error) {
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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            {zone.name}
          </h1>
          {zone.notes && (
            <p className="text-gray-500 mt-1 max-w-xl">{zone.notes}</p>
          )}
        </div>

        <button className="px-4 py-2 rounded-lg border hover:bg-gray-50 transition">
          Edit Zone
        </button>
      </div>

      {/* Stats */}
      <div className="flex gap-4">
        <div className="px-4 py-3 bg-white border rounded-xl shadow-sm">
          <div className="text-sm text-gray-500">Properties</div>
          <div className="text-xl font-semibold">
            {zone.properties.length}
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="rounded-2xl overflow-hidden border shadow-sm">
        <div ref={mapRef} className="w-full h-[520px]" />
      </div>

      {/* Property list */}
      {zone.properties.length > 0 && (
        <div className="bg-white border rounded-2xl shadow-sm">
          <div className="p-4 border-b font-medium">Properties in this zone</div>

          <div className="divide-y">
            {zone.properties.map((property: PropertyPoint) => (
              <div
                key={property.id}
                className="p-4 flex justify-between items-center hover:bg-gray-50"
              >
                <Link href={`/admin/property/${property.id}`} className="font-medium text-gray-800 hover:underline hover:text-blue-600">
                  {property.title}
                </Link>

                <div className="text-sm text-gray-500">
                  {property.lat.toFixed(4)}, {property.lng.toFixed(4)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
