import { useEffect } from "react";
import type { LatLngExpression } from "leaflet";
import { useMap } from "react-leaflet";

const SELECTION_ZOOM_LEVEL = 17;

type MapViewChangerProps = { center: LatLngExpression };

const MapViewChanger = ({ center }: MapViewChangerProps) => {
  const map = useMap();

  useEffect(() => {
    map.setView(center, SELECTION_ZOOM_LEVEL);
  }, [center]);

  return null;
};

export default MapViewChanger;
