"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polygon, Popup, LayerGroup, LayersControl, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { OverviewResponse } from "@/lib/api";

// Fix Leaflet's default icon issue with webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface InteractiveMapProps {
  overview: OverviewResponse;
}

// Dummy coordinates to simulate the mine area (PT Kideco Jaya Agung region is around -1.89, 115.82 - East Kalimantan)
// Using an arbitrary bounding area to match the UI shape roughly
const MINE_CENTER: [number, number] = [-1.889, 115.825];

const polygonOpenLand: [number, number][] = [
  [-1.885, 115.82],
  [-1.882, 115.83],
  [-1.889, 115.835],
  [-1.895, 115.832],
  [-1.892, 115.821],
  [-1.885, 115.82],
];

const polygonVeg: [number, number][] = [
  [-1.888, 115.835],
  [-1.885, 115.845],
  [-1.892, 115.843],
  [-1.895, 115.838],
  [-1.888, 115.835],
];

const polygonWater: [number, number][] = [
  [-1.895, 115.825],
  [-1.893, 115.829],
  [-1.897, 115.83],
  [-1.899, 115.826],
  [-1.895, 115.825],
];

export default function InteractiveMap({ overview }: InteractiveMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-full w-full bg-slate-900 flex items-center justify-center text-white">Loading Map...</div>;
  }

  return (
    <div className="absolute inset-0 z-0 h-full w-full">
      <MapContainer
        center={MINE_CENTER}
        zoom={14}
        style={{ height: "100%", width: "100%", zIndex: 0 }}
        zoomControl={false}
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Satellite">
            <TileLayer
              attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Topography">
            <TileLayer
              attribution='&copy; <a href="https://www.opentopomap.org/">OpenTopoMap</a>'
              url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>

          <LayersControl.Overlay checked name="Mine Analytics (Polygons)">
            <LayerGroup>
              <Polygon pathOptions={{ color: "#be8f58", fillColor: "#be8f58", fillOpacity: 0.5, weight: 2 }} positions={polygonOpenLand}>
                <Popup>
                  <strong>Area Tambang Aktif (Open Land)</strong><br />
                  Total Area: {(overview.pie_chart.distribution.area_tambang_aktif / 100 * overview.pie_chart.total_area_ha).toFixed(0)} Ha
                </Popup>
                <Tooltip direction="bottom" offset={[0, 20]} opacity={1} permanent className="map-tooltip-custom bg-slate-900 text-white border-0 shadow-lg px-2 py-1 rounded">
                  Area Tambang Aktif
                </Tooltip>
              </Polygon>

              <Polygon pathOptions={{ color: "#00c16a", fillColor: "#00c16a", fillOpacity: 0.4, weight: 2 }} positions={polygonVeg}>
                <Popup>
                  <strong>Area Revegetasi (Vegetated Area)</strong><br />
                  Revegetasi Rapat: {(overview.pie_chart.distribution.area_vegetasi_rapat / 100 * overview.pie_chart.total_area_ha).toFixed(0)} Ha
                </Popup>
                <Tooltip direction="bottom" offset={[0, 20]} opacity={1} permanent className="map-tooltip-custom bg-slate-900 text-white border-0 shadow-lg px-2 py-1 rounded">
                  Area Revegetasi
                </Tooltip>
              </Polygon>

              <Polygon pathOptions={{ color: "#010a18", fillColor: "#010a18", fillOpacity: 0.7, weight: 2 }} positions={polygonWater}>
                <Popup>
                  <strong>Water Bodies / Void</strong><br />
                  Area Genangan Air
                </Popup>
              </Polygon>
            </LayerGroup>
          </LayersControl.Overlay>
        </LayersControl>
      </MapContainer>
      
      <style jsx global>{`
        .leaflet-container {
          background-color: #081214;
        }
        .map-tooltip-custom {
          background: rgba(15, 23, 43, 0.7) !important;
          color: white !important;
          border: 1px solid rgba(255,255,255,0.2) !important;
          font-weight: 600;
          font-size: 14px;
        }
        .map-tooltip-custom::before {
          display: none;
        }
      `}</style>
    </div>
  );
}
