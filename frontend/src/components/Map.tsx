import { useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import SearchBox from "./SearchBox";
import LocateMeButton from "./LocateMeButton";
import DangerLevelFeedbackCard from "./DangerLevelFeedbackCard";
import MapViewChanger from "./MapViewChanger";
import { DangerInfo } from "@shared/types";
import { fetchDangerLevel } from "../services/danger.service";

const BUCHAREST_CENTER = { lat: 44.432695, lon: 26.104046 };
const INITIAL_ZOOM_LEVEL = 12;

const Map = () => {
  const [markerPosition, setMarkerPosition] = useState<LatLngExpression | null>(
    null,
  );
  const [dangerData, setDangerData] = useState<DangerInfo | null>(null);
  const [locateStatus, setLocateStatus] = useState<
    "idle" | "locating" | "error"
  >("idle");

  const handleSelectSuggestion = async (lat: number, lon: number) => {
    const danger = await fetchDangerLevel(lat, lon);
    setMarkerPosition([lat, lon]);
    setDangerData(danger);
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      setLocateStatus("error");
      return;
    }

    setLocateStatus("locating");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        handleSelectSuggestion(latitude, longitude);
        setLocateStatus("idle");
      },
      (error) => {
        alert("Unable to retrieve your location");
        console.error(error);
        setLocateStatus("error");
      },
    );
  };

  return (
    <>
      <SearchBox
        className="absolute top-3 left-3 z-1000"
        onSelectSuggestion={handleSelectSuggestion}
      />

      <LocateMeButton
        className="absolute right-4 bottom-10 z-1000"
        onLocateMe={handleLocateMe}
        status={locateStatus}
      />

      {dangerData !== null && <DangerLevelFeedbackCard danger={dangerData} />}

      {/* <footer className="absolute bottom-0 z-1000 flex w-full justify-between bg-white/70 px-4 py-2 text-xs text-gray-700">
        <span>
          &copy;{" "}
          <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>{" "}
          contributors
        </span>
      </footer> */}

      <MapContainer
        className="h-dvh"
        center={[BUCHAREST_CENTER.lat, BUCHAREST_CENTER.lon]}
        zoom={INITIAL_ZOOM_LEVEL}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          // url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          // url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {markerPosition && (
          <>
            <MapViewChanger center={markerPosition} />

            <Marker position={markerPosition} />
          </>
        )}
      </MapContainer>
    </>
  );
};

export default Map;
