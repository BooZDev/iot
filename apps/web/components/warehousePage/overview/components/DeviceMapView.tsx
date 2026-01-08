import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Polygon,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import { ScrollShadow, Button, Switch, Chip, Divider } from "@heroui/react";
import L from "leaflet";
import {
  Device,
  DeviceWithSubDevices,
  Warehouse,
  DeviceType,
  DeviceState,
  SubDeviceStatus,
} from "../../../../types/device";
import DeviceCard from "./DeviceCard";
import MapBounds from "./MapBounds";

interface DeviceMapViewProps {
  warehouse: Warehouse | undefined;
  devices: DeviceWithSubDevices[];
  selectedDevice: string | null;
  isAddingDevice: boolean;
  tempMarker: [number, number] | null;
  onDeviceClick: (device: Device) => void;
  onMapClick: (lat: number, lng: number) => void;
  onEditDevice: (device: Device) => void;
  onEditSubDevice: (subDevice: any) => void;
  onOpenSubDeviceModal: (deviceId: string) => void;
  onToggleSubDevice: (subDeviceId: string, currentStatus: SubDeviceStatus) => void;
  toggleSubDeviceMutation: any;
  setMapRef: (map: L.Map | null) => void;
}

const gatewayIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const sensorIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const otherIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const rfidIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const getDeviceIcon = (type: DeviceType) => {
  switch (type) {
    case DeviceType.GATEWAY:
      return gatewayIcon;
    case DeviceType.ENV_SENSOR:
      return sensorIcon;
    case DeviceType.RFID_READER:
      return rfidIcon;
    case DeviceType.OTHER:
      return otherIcon;
    default:
      return otherIcon;
  }
};

const getDeviceTypeLabel = (type: DeviceType) => {
  const labels: Record<DeviceType, string> = {
    [DeviceType.GATEWAY]: "Gateway",
    [DeviceType.ENV_SENSOR]: "Cảm biến môi trường",
    [DeviceType.RFID_READER]: "Đầu đọc RFID",
    [DeviceType.OTHER]: "Node điều khiển",
  };
  return labels[type];
};

const getDeviceStateColor = (state: DeviceState) => {
  const colors: Record<
    DeviceState,
    "success" | "danger" | "warning" | "default"
  > = {
    [DeviceState.ACTIVE]: "success",
    [DeviceState.INACTIVE]: "danger",
    [DeviceState.MAINTENANCE]: "warning",
    [DeviceState.UNAUTHORIZED]: "default",
  };
  return colors[state];
};

const getDeviceStateLabel = (state: DeviceState) => {
  const labels: Record<DeviceState, string> = {
    [DeviceState.ACTIVE]: "Hoạt động",
    [DeviceState.INACTIVE]: "Không hoạt động",
    [DeviceState.MAINTENANCE]: "Bảo trì",
    [DeviceState.UNAUTHORIZED]: "Chưa xác thực",
  };
  return labels[state];
};

const getSubDeviceInfo = (type: number) => {
  const info: Record<number, { name: string; icon: string; color: string }> = {
    1: { name: "Quạt thông gió", icon: "🌀", color: "primary" },
    2: { name: "Đèn chiếu sáng", icon: "💡", color: "warning" },
    3: { name: "Điều hòa", icon: "❄️", color: "secondary" },
    4: { name: "Máy sưởi", icon: "🔥", color: "danger" },
    5: { name: "Máy tạo ẩm", icon: "💧", color: "success" },
    6: { name: "Máy hút ẩm", icon: "💨", color: "default" },
  };
  return info[type] || { name: "Unknown", icon: "❓", color: "default" };
};

function MapClickHandler({
  onMapClick,
  isAddingDevice,
}: {
  onMapClick: (lat: number, lng: number) => void;
  isAddingDevice: boolean;
}) {
  useMapEvents({
    click(e) {
      if (isAddingDevice) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
}

export default function DeviceMapView({
  warehouse,
  devices,
  selectedDevice,
  isAddingDevice,
  tempMarker,
  onDeviceClick,
  onMapClick,
  onEditDevice,
  onEditSubDevice,
  onOpenSubDeviceModal,
  onToggleSubDevice,
  toggleSubDeviceMutation,
  setMapRef,
}: DeviceMapViewProps) {
  const devicesWithLocations = devices.filter(
    (d) => d.locationsInWarehouse?.length === 2
  );

  const polygonPositions: [number, number][] =
    warehouse?.locations?.map(([lng, lat]) => [lat, lng]) || [];

  return (
    <div className="grid grid-cols-12 gap-0">
      {/* Sidebar */}
      <div className="col-span-3 bg-default-50 border-r border-divider">
        {isAddingDevice && (
          <div className="p-3 bg-primary-50 border-b border-primary">
            <p className="text-sm font-semibold text-primary">
              📍 Click vào bản đồ để đặt thiết bị
            </p>
          </div>
        )}
        <ScrollShadow className="h-[600px]">
          <div className="p-3 space-y-2">
            {devicesWithLocations.map((device) => (
              <DeviceCard
                key={device._id}
                device={device}
                isSelected={selectedDevice === device._id}
                onDeviceClick={onDeviceClick}
                onEditDevice={onEditDevice}
                onEditSubDevice={onEditSubDevice}
                onOpenSubDeviceModal={onOpenSubDeviceModal}
              />
            ))}
          </div>
        </ScrollShadow>
      </div>

      {/* Map */}
      <div className="col-span-9 h-[600px]">
        <MapContainer
          center={[21.0047, 105.8469]}
          zoom={13}
          style={{
            height: "100%",
            width: "100%",
            cursor: isAddingDevice ? "crosshair" : "grab",
          }}
          ref={setMapRef}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapClickHandler
            onMapClick={onMapClick}
            isAddingDevice={isAddingDevice}
          />

          {polygonPositions.length > 0 && (
            <Polygon
              positions={polygonPositions}
              pathOptions={{
                color: "#006FEE",
                fillColor: "#006FEE",
                fillOpacity: 0.1,
                weight: 2,
                dashArray: "5, 5",
              }}
            />
          )}

          {/* Temporary marker when adding device */}
          {tempMarker && (
            <Marker
              position={tempMarker}
              icon={
                new L.Icon({
                  iconUrl:
                    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
                  shadowUrl:
                    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                  popupAnchor: [1, -34],
                  shadowSize: [41, 41],
                })
              }
            >
              <Popup>
                <div className="text-center">
                  <p className="font-semibold">Vị trí thiết bị mới</p>
                </div>
              </Popup>
            </Marker>
          )}

          {devicesWithLocations.map((device) => {
            const [lng, lat] = device.locationsInWarehouse;
            return (
              <Marker
                key={device._id}
                position={[lat, lng]}
                icon={getDeviceIcon(device.type)}
                eventHandlers={{
                  click: () => onDeviceClick(device),
                }}
              >
                <Popup maxWidth={400}>
                  <div className="p-3 min-w-[350px]">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-lg">{device.name}</h3>
                        <p className="text-xs text-default-500">
                          {getDeviceTypeLabel(device.type)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          color="primary"
                          variant="flat"
                          isIconOnly
                          onPress={() => onEditDevice(device)}
                        >
                          ✏️
                        </Button>
                        <Chip
                          size="sm"
                          color={getDeviceStateColor(device.state)}
                          variant="flat"
                        >
                          {getDeviceStateLabel(device.state)}
                        </Chip>
                      </div>
                    </div>

                    <Divider />

                    <div className="my-3 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-default-500">MAC:</span>
                        <span className="font-mono text-xs">{device.mac}</span>
                      </div>
                      {device.deviceCode && (
                        <div className="flex justify-between">
                          <span className="text-default-500">Mã:</span>
                          <span className="font-medium">{device.deviceCode}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-default-500">Tọa độ:</span>
                        <span className="text-xs font-mono">
                          {lat.toFixed(6)}, {lng.toFixed(6)}
                        </span>
                      </div>
                    </div>

                    {(device.type === DeviceType.OTHER ||
                      device.type === DeviceType.RFID_READER) && (
                        <>
                          <Divider />
                          <Button
                            size="sm"
                            color="primary"
                            variant="flat"
                            className="w-full mt-2"
                            onPress={() => onOpenSubDeviceModal(device._id)}
                          >
                            ➕ Thêm thiết bị con
                          </Button>
                        </>
                      )}

                    {device.subDevices && device.subDevices.length > 0 && (
                      <>
                        <Divider className="my-3" />
                        <div>
                          <h4 className="text-sm font-semibold mb-3">
                            Thiết bị con ({device.subDevices.length})
                          </h4>
                          <div className="space-y-2">
                            {device.subDevices.map((sub) => {
                              const info = getSubDeviceInfo(sub.type);
                              return (
                                <div
                                  key={sub._id}
                                  className="p-3 rounded-lg border border-default-200 bg-default-50"
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 flex-1">
                                      <span className="text-2xl">{info.icon}</span>
                                      <div className="flex-1">
                                        <p className="font-medium text-sm">
                                          {sub.name}
                                        </p>
                                        <p className="text-xs text-default-500">
                                          {sub.code}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Button
                                        size="sm"
                                        color="primary"
                                        variant="light"
                                        isIconOnly
                                        onPress={() => onEditSubDevice(sub)}
                                      >
                                        ✏️
                                      </Button>
                                      <Switch
                                        size="sm"
                                        isSelected={
                                          sub.status === SubDeviceStatus.ON
                                        }
                                        onValueChange={() =>
                                          onToggleSubDevice(sub._id, sub.status)
                                        }
                                        isDisabled={
                                          toggleSubDeviceMutation.isPending
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {warehouse && devicesWithLocations.length > 0 && (
            <MapBounds
              locations={warehouse.locations}
              devices={devicesWithLocations}
            />
          )}
        </MapContainer>
      </div>
    </div>
  );
}