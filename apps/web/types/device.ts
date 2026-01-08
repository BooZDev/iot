// types/device.ts
export enum DeviceState {
  ACTIVE = "active",
  INACTIVE = "inactive",
  MAINTENANCE = "maintenance",
  UNAUTHORIZED = "unauthorized",
}

export enum DeviceType {
  GATEWAY = "gateway",
  ENV_SENSOR = "envSensor",
  OTHER = "other",
  RFID_READER = "rfidReader",
}

export enum SubDeviceState {
  ACTIVE = "active",
  INACTIVE = "inactive",
  MAINTENANCE = "maintenance",
}

export enum SubDeviceStatus {
  ON = 1,
  OFF = 0,
}

export interface Device {
  _id: string;
  deviceCode?: string;
  name: string;
  mac: string;
  type: DeviceType;
  state: DeviceState;
  locationsInWarehouse: [number, number]; // [lng, lat]
  warehouseId: string;
  gatewayId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SubDevice {
  _id: string;
  code: string;
  name: string;
  type: number; // 1-6
  status: SubDeviceStatus;
  state: SubDeviceState;
  deviceId: string;
  value?: number;
  createdAt: string;
  updatedAt: string;
}

export interface DeviceWithSubDevices extends Device {
  subDevices?: SubDevice[];
}

export interface Warehouse {
  _id: string;
  warehouseCode: string;
  name: string;
  type: string;
  locations: [number, number][];
  description?: [string, string];
  address?: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDeviceDto {
  deviceCode: string;
  name: string;
  type: DeviceType;
  mac: string;
  warehouseId: string;
  gatewayId?: string | null;
}

export interface CreateSubDeviceDto {
  code: string;
  name: string;
  type: number;
  deviceId: string;
}
