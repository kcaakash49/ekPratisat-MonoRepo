"use client";

import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { useEffect, useRef, useState } from "react";
import { useCreateZoneMutation, useZonesQuery } from "@repo/query-hook";
import * as turf from "@turf/turf";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import type { FeatureCollection, Geometry } from "geojson";
import AnimateLoader from "@repo/ui/animateLoader";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;
type PolygonFeature = GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>;
type CleanFeatureCollection = GeoJSON.FeatureCollection<
  GeoJSON.Polygon | GeoJSON.MultiPolygon
>;

export default function GeoZoneCreator() {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const drawRef = useRef<MapboxDraw | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const queryClient = useQueryClient();
  const { mutate, isPending: saving } = useCreateZoneMutation();
  const { data: zones = [], isLoading } = useZonesQuery();

  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [hasOverlap, setHasOverlap] = useState(false);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [85.324, 27.7172], // default
      zoom: 11,
    });



    const draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: { polygon: true, trash: true },
      defaultMode: "draw_polygon",
    });

    map.addControl(draw);
    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    mapRef.current = map;
    drawRef.current = draw;

    map.on("load", async () => {
      map.on("draw.create", handleOverlapCheck);
      map.on("draw.update", handleOverlapCheck);
      map.on("draw.delete", () => {
        setHasOverlap(false);
      });
    });

    return () => {
      map.remove();
      mapRef.current = null;
      drawRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const update = () => {
      const features = zones.map((z: any) => ({
        type: "Feature",
        geometry: z.geom,
        properties: {
          id: z.id,
          name: z.name,
        },
      }));

      const geojson: FeatureCollection<Geometry> = {
        type: "FeatureCollection",
        features,
      };

      const existingSource = map.getSource("zones") as mapboxgl.GeoJSONSource;

      if (existingSource) {
        existingSource.setData(geojson);
      } else {
        map.addSource("zones", {
          type: "geojson",
          data: geojson,
        });

        map.addLayer({
          id: "zones-fill",
          type: "fill",
          source: "zones",
          paint: {
            "fill-color": "#3b82f6",
            "fill-opacity": 0.2,
          },
        });

        map.addLayer({
          id: "zones-outline",
          type: "line",
          source: "zones",
          paint: {
            "line-color": "#1d4ed8",
            "line-width": 2,
          },
        });

        map.addLayer({
          id: "zones-label",
          type: "symbol",
          source: "zones",
          layout: {
            "text-field": ["get", "name"],
            "text-size": 12,
          },
          paint: {
            "text-color": "#111827",
          },
        });
      }
    };

    if (!map.isStyleLoaded()) {
      map.once("load", update);
    } else {
      update();
    }
  }, [zones]);

  // if (isLoading) {
  //   return (
  //     <div className="flex justify-center items-center h-full w-full">
  //       <AnimateLoader />
  //     </div>
  //   )
  // }

  const handleOverlapCheck = () => {
    const draw = drawRef.current;
    const map = mapRef.current;

    if (!draw || !map) return;

    const drawn = draw.getAll();
    if (!drawn.features.length) {
      setHasOverlap(false);
      return;
    }
    const drawnFeature = drawn.features?.[0];

    if (!drawnFeature || !drawnFeature.geometry) return;

    if (
      drawnFeature.geometry.type !== "Polygon" &&
      drawnFeature.geometry.type !== "MultiPolygon"
    ) {
      return;
    }

    const drawnGeom = turf.feature(drawnFeature.geometry);

    const source = map.getSource("zones") as any;
    if (!source) return;

    const existing = source._data; // geojson

    let overlap = false;

    for (const zone of existing.features) {
      if (turf.booleanIntersects(drawnGeom, zone)) {
        overlap = true;
        break;
      }
    }

    setHasOverlap(overlap);
  };


  // const onSave = async () => {
  //   const draw = drawRef.current;
  //   if (!draw) return;

  //   const fc = draw.getAll(); // FeatureCollection
  //   if (!name.trim()) return alert("Zone name is required.");
  //   if (!fc.features.length) return alert("Draw at least one polygon.");

  //   // Optional: ensure only polygon/multipolygon included
  //   const bad = fc.features.find(
  //     (f) => f.geometry.type !== "Polygon" && f.geometry.type !== "MultiPolygon"
  //   );
  //   if (bad) return alert("Only polygons are allowed.");

  //   mutate({name, notes, featureCollection: fc}, {
  //     onSuccess: (data) => {
  //       toast.success(data.message)
  //     }
  //   })
  // };
  const getFirstRing = (
    geometry: GeoJSON.Polygon | GeoJSON.MultiPolygon
  ): number[][] | null => {
    if (geometry.type === "Polygon") {
      return geometry.coordinates?.[0] ?? null;
    }

    if (geometry.type === "MultiPolygon") {
      return geometry.coordinates?.[0]?.[0] ?? null;
    }

    return null;
  };

  const validateAndCleanFeatures = (
    rawFeatures: GeoJSON.Feature[]
  ): {
    ok: boolean;
    message?: string;
    cleaned?: CleanFeatureCollection;
  } => {
    const polygonFeatures = rawFeatures.filter((f): f is PolygonFeature => {
      return (
        !!f.geometry &&
        (f.geometry.type === "Polygon" || f.geometry.type === "MultiPolygon")
      );
    });

    if (polygonFeatures.length === 0) {
      return { ok: false, message: "Draw at least one polygon" };
    }

    const cleanedFeatures: PolygonFeature[] = [];

    for (const feature of polygonFeatures) {
      const ring = getFirstRing(feature.geometry);

      if (!ring || ring.length < 4) {
        continue;
      }

      try {
        const turfFeature = turf.feature(feature.geometry);

        // Degenerate / straight-line / almost-zero area shape
        const area = turf.area(turfFeature);
        if (area <= 0) {
          continue;
        }

        // Raise this if needed for your real-world scale
        if (area < 100) {
          return {
            ok: false,
            message: "Polygon is too small or invalid",
          };
        }

        // Bounding box sanity check to reject flat line-like polygons
        const bbox = turf.bbox(turfFeature);
        const width = Math.abs(bbox[2] - bbox[0]);
        const height = Math.abs(bbox[3] - bbox[1]);

        if (width === 0 || height === 0) {
          return {
            ok: false,
            message: "Polygon is a straight line (invalid shape)",
          };
        }
        if (bbox[0] === bbox[2] || bbox[1] === bbox[3]) {
          return {
            ok: false,
            message: "Polygon shape is invalid",
          };
        }

        const kinks = turf.kinks(turfFeature);
        if (kinks.features.length > 0) {
          return { ok: false, message: "Polygon is self-intersecting" };
        }

        // Self-intersection / invalid topology
        const isValid = turf.booleanValid(turfFeature);
        if (!isValid) {
          return {
            ok: false,
            message: "Polygon is self-intersecting or invalid",
          };
        }

        cleanedFeatures.push({
          type: "Feature",
          geometry: feature.geometry,
          properties: {},
        });
      } catch {
        return { ok: false, message: "Invalid polygon geometry" };
      }
    }

    if (cleanedFeatures.length === 0) {
      return { ok: false, message: "Draw a valid polygon" };
    }

    return {
      ok: true,
      cleaned: {
        type: "FeatureCollection",
        features: cleanedFeatures,
      },
    };
  };

  const onSave = () => {
    const draw = drawRef.current;
    if (!draw) return;

    if (!name.trim()) {
      toast.error("Zone name is required");
      return;
    }

    const featureCollection = draw.getAll();

    if (!featureCollection?.features?.length) {
      toast.error("Draw at least one polygon");
      return;
    }

    const validated = validateAndCleanFeatures(
      featureCollection.features as GeoJSON.Feature[]
    );

    if (!validated.ok || !validated.cleaned) {
      toast.error(validated.message || "Invalid polygon");
      return;
    }

    mutate(
      {
        name: name.trim(),
        notes: notes.trim(),
        featureCollection: validated.cleaned,
      },
      {
        onSuccess: (data: any) => {
          toast.success(data?.message || "Zone created successfully");
          draw.deleteAll();
          setName("");
          setNotes("");
          queryClient.invalidateQueries({ queryKey: ["zones"] });
        },
        onError: (error: any) => {
          const message =
            error?.response?.data?.error ||
            error?.message ||
            "Failed to create zone";
          toast.error(message);
        },
      }
    );
  };
  return (
    <div className="grid gap-3">
      <div className="grid gap-2">
        <input
          className="border rounded p-2"
          placeholder="Zone name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          className="border rounded p-2"
          placeholder="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <button
          className="border rounded p-2"
          onClick={onSave}
          disabled={saving || hasOverlap}
        >
          {saving ? "Saving..." : "Save Zone"}
        </button>
      </div>
      {hasOverlap && (
        <p className="text-red-500 text-sm">
          Zone overlaps with existing zone
        </p>
      )}

      <div className="relative h-[520px] w-full rounded border">

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10">
            <AnimateLoader />
          </div>
        )}

        <div ref={containerRef} className="h-full w-full" />
      </div>
    </div>
  );
}