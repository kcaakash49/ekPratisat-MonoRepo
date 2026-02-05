"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export default function PropertyMap({ lat, lng }: { lat: number; lng: number }) {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (!MAPBOX_TOKEN) return;
    if (!containerRef.current) return;
    if (mapRef.current) return;

    (mapboxgl as any).accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: 15,
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    markerRef.current = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map);

    mapRef.current = map;

    return () => {
      markerRef.current?.remove();
      markerRef.current = null;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  // If lat/lng changes (unlikely here), update marker + center
  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.setCenter([lng, lat]);
    markerRef.current?.setLngLat([lng, lat]);
  }, [lat, lng]);

  if (!MAPBOX_TOKEN) {
    return (
      <div className="p-3 rounded border border-red-300 bg-red-50 text-red-700">
        Map is not configured. Set <code>NEXT_PUBLIC_MAPBOX_TOKEN</code>.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-secondary-200 dark:border-secondary-700 overflow-hidden bg-secondary-50 dark:bg-secondary-800">
      <div ref={containerRef} className="h-[320px] w-full" />
    </div>
  );
}