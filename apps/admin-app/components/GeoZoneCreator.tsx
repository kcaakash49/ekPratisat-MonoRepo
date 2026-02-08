"use client";

import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { useEffect, useRef, useState } from "react";
import { useCreateZoneMutation } from "@repo/query-hook";
import { toast } from "sonner";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

export default function GeoZoneCreator() {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const drawRef = useRef<MapboxDraw | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const {mutate, isPending:saving} = useCreateZoneMutation();

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

    return () => {
      map.remove();
      mapRef.current = null;
      drawRef.current = null;
    };
  }, []);

  const onSave = async () => {
    const draw = drawRef.current;
    if (!draw) return;

    const fc = draw.getAll(); // FeatureCollection
    if (!name.trim()) return alert("Zone name is required.");
    if (!fc.features.length) return alert("Draw at least one polygon.");

    // Optional: ensure only polygon/multipolygon included
    const bad = fc.features.find(
      (f) => f.geometry.type !== "Polygon" && f.geometry.type !== "MultiPolygon"
    );
    if (bad) return alert("Only polygons are allowed.");

    mutate({name, notes, featureCollection: fc}, {
      onSuccess: (data) => {
        toast.success(data.message)
      }
    })
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
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Zone"}
        </button>
      </div>

      <div ref={containerRef} className="h-[520px] w-full rounded border" />
    </div>
  );
}