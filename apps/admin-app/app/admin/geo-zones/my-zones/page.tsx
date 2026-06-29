"use client";

import { useGetMyZone } from "@repo/query-hook";
import { useEffect, useMemo, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, Layers, ChevronRight } from "lucide-react";
import type { FeatureCollection, Geometry } from "geojson";
import AnimateLoader from "@repo/ui/animateLoader";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

interface Zone {
  id: string;
  name: string;
  notes: string | null;
  isActive: boolean;
  geom: any;
  createdAt: string;
}

export default function MyZones() {
  const { data, isLoading, isError, error } = useGetMyZone();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [hoveredZoneName, setHoveredZoneName] = useState<string | null>(null);
  const router = useRouter();

  const zones: Zone[] = useMemo(() => {
    return data?.zones || [];
  }, [data?.zones]);

  // 🗺️ 1. Core Map Initialization
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [85.324, 27.7172],
      zoom: 11,
    });

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // 🎨 2. Syncing Layer Source Payload
  useEffect(() => {
    const map = mapRef.current;
    if (!map || zones.length === 0) return;

    const syncLayers = () => {
      const features = zones.map((z) => ({
        type: "Feature",
        id: z.id,
        geometry: z.geom,
        properties: {
          id: z.id,
          name: z.name,
          notes: z.notes || "",
        },
      }));

      const geojson: FeatureCollection<Geometry> = {
        type: "FeatureCollection",
        features: features as any,
      };

      const existingSource = map.getSource("agent-zones") as mapboxgl.GeoJSONSource;

      if (existingSource) {
        existingSource.setData(geojson);
      } else {
        map.addSource("agent-zones", {
          type: "geojson",
          data: geojson,
        });

        map.addLayer({
          id: "zones-fill",
          type: "fill",
          source: "agent-zones",
          paint: {
            "fill-color": "#3b82f6",
            "fill-opacity": [
              "case",
              ["boolean", ["feature-state", "hover"], false],
              0.35,
              0.15,
            ],
          },
        });

        map.addLayer({
          id: "zones-stroke",
          type: "line",
          source: "agent-zones",
          paint: {
            "line-color": "#2563eb",
            "line-width": 2,
          },
        });

        map.addLayer({
          id: "zones-labels",
          type: "symbol",
          source: "agent-zones",
          layout: {
            "text-field": ["get", "name"],
            "text-size": 13,
            "text-justify": "center",
            "text-anchor": "center",
          },
          paint: {
            "text-color": "#1e3a8a",
            "text-halo-color": "#ffffff",
            "text-halo-width": 2,
          },
        });

        try {
          const coordinates = zones.flatMap((z) => z.geom.coordinates[0][0]);
          if (coordinates.length > 0) {
            const initialCoord = coordinates[0] as [number, number];
            const bounds = coordinates.reduce(
              (bnds, coord) => bnds.extend(coord as [number, number]),
              new mapboxgl.LngLatBounds(initialCoord, initialCoord)
            );
            map.fitBounds(bounds, { padding: 40, maxZoom: 14 });
          }
        } catch (err) {
          console.error("Bounding framework processing error:", err);
        }

        let hoveredFeatureId: string | null = null;

        map.on("mousemove", "zones-fill", (e) => {
          if (e.features && e.features.length > 0) {
            map.getCanvas().style.cursor = "pointer";
            const featId = e.features?.[0]?.id?.toString() || e.features?.[0]?.properties?.id;
            const featName = e.features?.[0]?.properties?.name;

            if (featName) setHoveredZoneName(featName);

            if (hoveredFeatureId !== featId && featId) {
              if (hoveredFeatureId) {
                map.setFeatureState({ source: "agent-zones", id: hoveredFeatureId }, { hover: false });
              }
              hoveredFeatureId = featId;
              map.setFeatureState({ source: "agent-zones", id: featId }, { hover: true });
            }
          }
        });

        map.on("mouseleave", "zones-fill", () => {
          map.getCanvas().style.cursor = "";
          setHoveredZoneName(null);
          if (hoveredFeatureId) {
            map.setFeatureState({ source: "agent-zones", id: hoveredFeatureId }, { hover: false });
            hoveredFeatureId = null;
          }
        });

        map.on("click", "zones-fill", (e) => {
          if (e.features && e.features.length > 0) {
            const zoneId = e.features[0]?.properties?.id;
            if (zoneId) {
              router.push(`/admin/geo-zones/${zoneId}`);
            }
          }
        });
      }
    };

    if (!map.isStyleLoaded()) {
      map.once("load", syncLayers);
    } else {
      syncLayers();
    }
  }, [zones, router]);

  if (isError) return <div className="p-8 text-center text-red-500 text-sm">Error: {error?.message || "Failed to load mapping data"}</div>;

  return (
    // 📱 Changed layout layout parameters to properly isolate scrolling
    <div className="flex flex-col xl:flex-row h-screen xl:h-[calc(100vh-64px)] w-full overflow-y-auto xl:overflow-hidden bg-white dark:bg-secondary-950">
      
      {/* 🗺️ Map Canvas Section (Takes top priority on mobile) */}
      <div className="w-full xl:flex-1 h-[45vh] xl:h-full relative order-1 xl:order-2 shrink-0">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 dark:bg-secondary-950/70 z-10 backdrop-blur-xs">
            <AnimateLoader />
          </div>
        )}
        <div ref={mapContainerRef} className="w-full h-full" />

        {hoveredZoneName && (
          <div className="hidden md:block absolute top-4 left-4 bg-secondary-900/90 text-white backdrop-blur px-3 py-1.5 rounded-xl text-xs font-bold pointer-events-none shadow-lg tracking-wide border border-white/10">
            Sector Highlighted: <span className="text-blue-400">{hoveredZoneName}</span>
          </div>
        )}
      </div>

      {/* 📋 Zone Grid List Section */}
      <div className="w-full xl:w-96 border-t xl:border-t-0 xl:border-r border-secondary-200 dark:border-secondary-800 flex flex-col order-2 xl:order-1 bg-secondary-50/50 dark:bg-secondary-900/20 p-4 shrink-0">
        <div className="pb-4 border-b border-secondary-200 dark:border-secondary-800 bg-transparent mb-4">
          <h1 className="text-base md:text-lg font-bold flex items-center gap-2 text-secondary-900 dark:text-white">
            <Layers className="w-5 h-5 text-blue-500" />
            My Zones
          </h1>
          <p className="text-xs text-secondary-500 mt-0.5">
            {isLoading ? "Fetching assigned records..." : `Managing ${zones.length} active sectors.`}
          </p>
        </div>

        {/* 🚀 THE FIXED GRID LAYOUT SYSTEM */}
        <div className="flex-1 xl:overflow-y-auto">
          {isLoading ? (
            <div className="h-24 flex items-center justify-center"><AnimateLoader /></div>
          ) : (
            // 🎯 Mobile: 1 Column list layout | Desktop/Tablet: grid-cols-3 grid block
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-1 gap-3">
              {zones.map((zone) => (
                <Link
                  key={zone.id}
                  href={`/admin/geo-zones/${zone.id}`}
                  className="block p-4 bg-white dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-800 hover:border-blue-500 dark:hover:border-blue-500 rounded-xl transition shadow-sm hover:shadow-md group"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-sm text-secondary-800 dark:text-secondary-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                      {zone.name}
                    </h3>
                    <ChevronRight className="w-4 h-4 text-secondary-400 transition-transform group-hover:translate-x-0.5" />
                  </div>
                  {zone.notes && (
                    <p className="text-xs text-secondary-500 mt-1 line-clamp-2">
                      {zone.notes}
                    </p>
                  )}
                  <div className="mt-3 text-[11px] font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    Open properties &rarr;
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}