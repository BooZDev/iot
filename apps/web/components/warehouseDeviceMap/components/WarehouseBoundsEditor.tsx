import { useEffect, useState, useRef } from "react";
import L, { LatLngExpression } from "leaflet";
import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";
import { Card, CardBody, Button, Chip } from "@heroui/react";

interface Warehouse {
  _id: string;
  name: string;
  locations?: number[][];
}

interface WarehouseBoundsEditorProps {
  map: L.Map;
  warehouse: Warehouse | null;
  onSave: (warehouseId: string, locations: number[][]) => Promise<void>;
  isLoading: boolean;
}

export default function WarehouseBoundsEditor({
  map,
  warehouse,
  onSave,
  isLoading,
}: WarehouseBoundsEditorProps) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPoints, setCurrentPoints] = useState<[number, number][]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  const polygonRef = useRef<L.Polygon | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const drawingMarkersRef = useRef<L.Marker[]>([]);
  const tempLineRef = useRef<L.Polyline | null>(null);

  // Clear all drawing markers and lines
  const clearDrawingMarkers = () => {
    drawingMarkersRef.current.forEach((marker) => map.removeLayer(marker));
    drawingMarkersRef.current = [];
    if (tempLineRef.current) {
      map.removeLayer(tempLineRef.current);
      tempLineRef.current = null;
    }
  };

  // Clear all markers
  const clearMarkers = () => {
    markersRef.current.forEach((marker) => map.removeLayer(marker));
    markersRef.current = [];
  };

  // Clear polygon
  const clearPolygon = () => {
    if (polygonRef.current) {
      map.removeLayer(polygonRef.current);
      polygonRef.current = null;
    }
  };

  // Draw existing polygon
  useEffect(() => {
    clearPolygon();
    clearMarkers();

    if (warehouse?.locations && warehouse.locations.length > 0 && !isDrawing) {
      // Draw polygon
      const latLngs = warehouse.locations.map((coord) => [
        coord[1],
        coord[0],
      ]) as [number, number][];

      const polygon = L.polygon(latLngs, {
        color: "#0070f3",
        fillColor: "#0070f3",
        fillOpacity: 0.2,
        weight: 2,
      }).addTo(map);

      polygonRef.current = polygon;

      // Draw markers for each point
      warehouse.locations.forEach((coord, index) => {
        if (coord && coord.length === 2 && coord[0] !== undefined && coord[1] !== undefined) {
          const marker = L.marker([coord[1], coord[0]], {
            icon: L.divIcon({
              className: "custom-marker",
              html: `<div style="background: #0070f3; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">${index + 1
                }</div>`,
              iconSize: [24, 24],
              iconAnchor: [12, 12],
            }),
          }).addTo(map);
          markersRef.current.push(marker);
        }
      });

      // Fit bounds to show entire polygon
      map.fitBounds(polygon.getBounds(), { padding: [50, 50] });
    }
  }, [warehouse, map, isDrawing]);

  // Handle map clicks when drawing
  useEffect(() => {
    if (!isDrawing) return;

    const handleMapClick = (e: L.LeafletMouseEvent) => {
      const newPoint: [number, number] = [e.latlng.lat, e.latlng.lng];
      const newPoints = [...currentPoints, newPoint];
      setCurrentPoints(newPoints);

      // Add marker for this point
      const marker = L.marker(newPoint, {
        icon: L.divIcon({
          className: "custom-marker",
          html: `<div style="background: #ff6b35; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.4);">${newPoints.length}</div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        }),
      }).addTo(map);

      drawingMarkersRef.current.push(marker);

      // Draw temporary line
      if (newPoints.length > 1) {
        if (tempLineRef.current) {
          map.removeLayer(tempLineRef.current);
        }
        tempLineRef.current = L.polyline(newPoints, {
          color: "#ff6b35",
          weight: 2,
          dashArray: "5, 5",
        }).addTo(map);
      }
    };

    map.on("click", handleMapClick);

    return () => {
      map.off("click", handleMapClick);
    };
  }, [isDrawing, currentPoints, map]);

  // Start drawing mode
  const handleStartDrawing = () => {
    setIsDrawing(true);
    setCurrentPoints([]);
    setHasChanges(false);
    clearPolygon();
    clearMarkers();
    clearDrawingMarkers();
  };

  // Complete polygon
  const handleCompletePolygon = () => {
    if (currentPoints.length < 3) {
      alert("Cần ít nhất 3 điểm để tạo polygon!");
      return;
    }

    // Close the polygon by adding first point at the end
    const closedPoints = [...currentPoints, currentPoints[0]];

    // Draw the completed polygon
    clearDrawingMarkers();
    if (tempLineRef.current) {
      map.removeLayer(tempLineRef.current);
      tempLineRef.current = null;
    }

    const polygon = L.polygon(closedPoints.filter((point): point is [number, number] => !!point), {
      color: "#ff6b35",
      fillColor: "#ff6b35",
      fillOpacity: 0.2,
      weight: 2,
    }).addTo(map);

    polygonRef.current = polygon;

    // Add numbered markers
    closedPoints.forEach((point, index) => {
      if (index < closedPoints.length - 1) {
        // Don't add marker for the closing point
        const marker = L.marker(point as LatLngExpression, {
          icon: L.divIcon({
            className: "custom-marker",
            html: `<div style="background: #ff6b35; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">${index + 1
              }</div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
          }),
        }).addTo(map);

        markersRef.current.push(marker);
      }
    });

    setIsDrawing(false);
    setHasChanges(true);
  };

  // Cancel drawing
  const handleCancelDrawing = () => {
    setIsDrawing(false);
    setCurrentPoints([]);
    setHasChanges(false);
    clearDrawingMarkers();

    // Restore original polygon if exists
    if (warehouse?.locations && warehouse.locations.length > 0) {
      const latLngs = warehouse.locations.map((coord) => [
        coord[1],
        coord[0],
      ]) as [number, number][];

      const polygon = L.polygon(latLngs, {
        color: "#0070f3",
        fillColor: "#0070f3",
        fillOpacity: 0.2,
        weight: 2,
      }).addTo(map);

      polygonRef.current = polygon;

      warehouse.locations.forEach((coord, index) => {
        const marker = L.marker([coord[1] as number, coord[0] as number], {
          icon: L.divIcon({
            className: "custom-marker",
            html: `<div style="background: #0070f3; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">${index + 1
              }</div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
          }),
        }).addTo(map);

        markersRef.current.push(marker);
      });
    }
  };

  // Save polygon
  const handleSave = async () => {
    if (!warehouse || currentPoints.length < 3) return;

    // Convert to [lng, lat] format and close the polygon
    const locations = [
      ...currentPoints.map((point) => [point[1], point[0]]),
      currentPoints[0] ? [currentPoints[0][1], currentPoints[0][0]] : [0, 0], // Close polygon
    ];

    await onSave(warehouse._id, locations);
    setHasChanges(false);

    // Update to show saved state
    clearPolygon();
    clearMarkers();

    const polygon = L.polygon(currentPoints, {
      color: "#0070f3",
      fillColor: "#0070f3",
      fillOpacity: 0.2,
      weight: 2,
    }).addTo(map);

    polygonRef.current = polygon;

    currentPoints.forEach((point, index) => {
      const marker = L.marker(point, {
        icon: L.divIcon({
          className: "custom-marker",
          html: `<div style="background: #0070f3; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">${index + 1
            }</div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        }),
      }).addTo(map);

      markersRef.current.push(marker);
    });
  };

  // Clear polygon from warehouse
  const handleClearPolygon = () => {
    if (!warehouse) return;
    if (!confirm("Bạn có chắc muốn xóa polygon này?")) return;

    onSave(warehouse._id, []);
    setCurrentPoints([]);
    setHasChanges(false);
    clearPolygon();
    clearMarkers();
    clearDrawingMarkers();
  };

  if (!warehouse) return null;

  return (
    <Card className="absolute top-4 left-4 z-1000 w-80 shadow-lg">
      <CardBody className="p-4">
        <h3 className="font-bold mb-3 flex items-center gap-2">
          <span>📍</span>
          <span>Vẽ polygon nhà kho</span>
        </h3>

        <div className="space-y-3">
          {/* Status */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-default-600">Trạng thái:</span>
            {isDrawing ? (
              <Chip size="sm" color="warning">
                🎨 Đang vẽ ({currentPoints.length} điểm)
              </Chip>
            ) : hasChanges ? (
              <Chip size="sm" color="danger">
                ⚠️ Chưa lưu
              </Chip>
            ) : warehouse.locations && warehouse.locations.length > 0 ? (
              <Chip size="sm" color="success">
                ✅ Đã lưu
              </Chip>
            ) : (
              <Chip size="sm" color="default">
                Chưa có polygon
              </Chip>
            )}
          </div>

          {/* Instructions */}
          {isDrawing && (
            <Card className="bg-primary-50 border-none">
              <CardBody className="p-3">
                <p className="text-xs text-primary-700">
                  <strong>Hướng dẫn:</strong>
                  <br />
                  1. Click trên bản đồ để đặt điểm
                  <br />
                  2. Cần tối thiểu 3 điểm
                  <br />
                  3. Click &quot;Hoàn thành&quot; để đóng polygon
                </p>
              </CardBody>
            </Card>
          )}

          {/* Actions */}
          <div className="space-y-2">
            {!isDrawing && !hasChanges && (
              <>
                <Button
                  color="primary"
                  fullWidth
                  onPress={handleStartDrawing}
                  startContent={<span>✏️</span>}
                >
                  {warehouse.locations && warehouse.locations.length > 0
                    ? "Vẽ lại polygon"
                    : "Bắt đầu vẽ"}
                </Button>
                {warehouse.locations && warehouse.locations.length > 0 && (
                  <Button
                    color="danger"
                    variant="flat"
                    fullWidth
                    onPress={handleClearPolygon}
                    startContent={<span>🗑️</span>}
                  >
                    Xóa polygon
                  </Button>
                )}
              </>
            )}

            {isDrawing && (
              <>
                <Button
                  color="success"
                  fullWidth
                  onPress={handleCompletePolygon}
                  isDisabled={currentPoints.length < 3}
                  startContent={<span>✅</span>}
                >
                  Hoàn thành ({currentPoints.length} điểm)
                </Button>
                <Button
                  color="danger"
                  variant="flat"
                  fullWidth
                  onPress={handleCancelDrawing}
                  startContent={<span>❌</span>}
                >
                  Hủy
                </Button>
              </>
            )}

            {hasChanges && !isDrawing && (
              <>
                <Button
                  color="primary"
                  fullWidth
                  onPress={handleSave}
                  isLoading={isLoading}
                  startContent={<span>💾</span>}
                >
                  Lưu polygon
                </Button>
                <Button
                  color="danger"
                  variant="flat"
                  fullWidth
                  onPress={handleCancelDrawing}
                  startContent={<span>↩️</span>}
                >
                  Hoàn tác
                </Button>
              </>
            )}
          </div>

          {/* Info */}
          {warehouse.locations && warehouse.locations.length > 0 && !isDrawing && (
            <Card className="bg-success-50 border-none">
              <CardBody className="p-3">
                <p className="text-xs text-success-700">
                  ✅ Polygon có <strong>{warehouse.locations.length} điểm</strong>
                </p>
              </CardBody>
            </Card>
          )}
        </div>
      </CardBody>
    </Card>
  );
}