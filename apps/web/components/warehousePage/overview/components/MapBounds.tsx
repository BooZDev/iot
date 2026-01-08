import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { Device } from "../../../../types/device";

interface MapBoundsProps {
  locations: [number, number][];
  devices: Device[];
}

export default function MapBounds({ locations, devices }: MapBoundsProps) {
  const map = useMap();

  useEffect(() => {
    const devicePoints = devices
      .filter((d) => d.locationsInWarehouse?.length === 2)
      .map(
        (d) => [d.locationsInWarehouse[1], d.locationsInWarehouse[0]] as [number, number]
      );

    const warehousePoints = locations.map(
      ([lng, lat]) => [lat, lng] as [number, number]
    );
    const allPoints = [...warehousePoints, ...devicePoints];

    if (allPoints.length > 0) {
      const bounds = L.latLngBounds(allPoints);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [locations, devices, map]);

  return null;
}