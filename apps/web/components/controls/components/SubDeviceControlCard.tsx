import { useState } from "react";
import {
  Card,
  CardBody,
  Switch,
  Slider,
  Button,
  Chip,
  Input,
} from "@heroui/react";
import { SubDeviceStatus } from "../../../types/device";

interface SubDeviceControlCardProps {
  subDevice: any;
  deviceId: string;
  onToggleStatus: (subDeviceId: string, currentStatus: SubDeviceStatus) => void;
  onControlValue: (
    deviceId: string,
    actuatorType: number,
    status: SubDeviceStatus,
    value: number
  ) => void;
  isUpdating: boolean;
}

const getSubDeviceInfo = (type: number) => {
  const info: Record<
    number,
    {
      name: string;
      icon: string;
      color: string;
      unit: string;
      min: number;
      max: number;
      step: number;
    }
  > = {
    1: {
      name: "Quạt thông gió",
      icon: "🌀",
      color: "primary",
      unit: "%",
      min: 0,
      max: 100,
      step: 10,
    },
    2: {
      name: "Đèn chiếu sáng",
      icon: "💡",
      color: "warning",
      unit: "%",
      min: 0,
      max: 100,
      step: 10,
    },
    3: {
      name: "Điều hòa",
      icon: "❄️",
      color: "secondary",
      unit: "°C",
      min: 16,
      max: 30,
      step: 1,
    },
    4: {
      name: "Máy sưởi",
      icon: "🔥",
      color: "danger",
      unit: "°C",
      min: 18,
      max: 35,
      step: 1,
    },
    5: {
      name: "Máy tạo ẩm",
      icon: "💧",
      color: "success",
      unit: "%",
      min: 30,
      max: 80,
      step: 5,
    },
    6: {
      name: "Máy hút ẩm",
      icon: "💨",
      color: "default",
      unit: "%",
      min: 30,
      max: 70,
      step: 5,
    },
  };
  return (
    info[type] || {
      name: "Unknown",
      icon: "❓",
      color: "default",
      unit: "",
      min: 0,
      max: 100,
      step: 1,
    }
  );
};

export default function SubDeviceControlCard({
  subDevice,
  deviceId,
  onToggleStatus,
  onControlValue,
  isUpdating,
}: SubDeviceControlCardProps) {
  const info = getSubDeviceInfo(subDevice.type);
  const [localValue, setLocalValue] = useState(subDevice.value || info.min);
  const [isEditing, setIsEditing] = useState(false);

  const isOn = subDevice.status === SubDeviceStatus.ON;

  const handleValueChange = (value: number | number[]) => {
    const numValue = Array.isArray(value) ? value[0] : value;
    setLocalValue(numValue);
  };

  const handleApplyValue = () => {
    onControlValue(subDevice._id, subDevice.type, subDevice.status, localValue);
    setIsEditing(false);
  };

  const handleQuickSet = (value: number) => {
    setLocalValue(value);
    onControlValue(subDevice._id, subDevice.type, subDevice.status, value);
  };

  return (
    <Card
      className={`border-2 transition-all ${isOn
        ? `border-${info.color} bg-${info.color}-50/30`
        : "border-default-200 bg-default-50"
        }`}
    >
      <CardBody className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{info.icon}</div>
            <div>
              <h4 className="font-bold text-lg">{subDevice.name}</h4>
              <p className="text-xs text-default-500">{subDevice.code}</p>
            </div>
          </div>
          <Switch
            size="lg"
            isSelected={isOn}
            onValueChange={() => onToggleStatus(subDevice._id, subDevice.status, subDevice.type)}
            isDisabled={isUpdating}
            color={info.color as any}
          />
        </div>

        {/* Type Badge */}
        <Chip size="sm" variant="flat" color={info.color as any}>
          {info.name}
        </Chip>

        {/* Current Value Display */}
        {isOn && (
          <>
            <div className="p-3 bg-default-100 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-default-600">Giá trị hiện tại:</span>
                <span className="text-2xl font-bold text-primary">
                  {subDevice.value || localValue}
                  {info.unit}
                </span>
              </div>
              {subDevice.value !== undefined && (
                <p className="text-xs text-default-500">
                  Cập nhật lần cuối:{" "}
                  {subDevice.updatedAt
                    ? new Date(subDevice.updatedAt).toLocaleString("vi-VN")
                    : "—"}
                </p>
              )}
            </div>

            {/* Control Slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Điều chỉnh:</span>
                <span className="text-sm text-default-500">
                  {info.min}
                  {info.unit} - {info.max}
                  {info.unit}
                </span>
              </div>

              <Slider
                size="lg"
                step={info.step}
                minValue={info.min}
                maxValue={info.max}
                value={localValue}
                onChange={handleValueChange}
                color={info.color as any}
                className="max-w-full"
                marks={[
                  { value: info.min, label: `${info.min}${info.unit}` },
                  {
                    value: (info.min + info.max) / 2,
                    label: `${((info.min + info.max) / 2).toFixed(0)}${info.unit}`,
                  },
                  { value: info.max, label: `${info.max}${info.unit}` },
                ]}
              />

              {/* Value Input */}
              <div className="flex gap-2">
                <Input
                  size="sm"
                  type="number"
                  value={localValue.toString()}
                  onValueChange={(val) => {
                    const num = parseInt(val) || info.min;
                    setLocalValue(Math.min(Math.max(num, info.min), info.max));
                  }}
                  endContent={<span className="text-xs">{info.unit}</span>}
                  className="flex-1"
                />
                <Button
                  size="sm"
                  color="primary"
                  onPress={handleApplyValue}
                  isLoading={isUpdating}
                >
                  Áp dụng
                </Button>
              </div>

              {/* Quick Set Buttons */}
              <div className="flex gap-2 flex-wrap">
                <Button
                  size="sm"
                  variant="flat"
                  color="default"
                  onPress={() => handleQuickSet(info.min)}
                  isDisabled={isUpdating}
                >
                  Min ({info.min}
                  {info.unit})
                </Button>
                <Button
                  size="sm"
                  variant="flat"
                  color="primary"
                  onPress={() =>
                    handleQuickSet(Math.round((info.min + info.max) / 2))
                  }
                  isDisabled={isUpdating}
                >
                  Mid (
                  {Math.round((info.min + info.max) / 2)}
                  {info.unit})
                </Button>
                <Button
                  size="sm"
                  variant="flat"
                  color="success"
                  onPress={() => handleQuickSet(info.max)}
                  isDisabled={isUpdating}
                >
                  Max ({info.max}
                  {info.unit})
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Off State */}
        {!isOn && (
          <div className="text-center py-4">
            <p className="text-default-400">Thiết bị đang tắt</p>
            <p className="text-xs text-default-300 mt-1">
              Bật để điều khiển
            </p>
          </div>
        )}

        {/* Status Indicator */}
        <div className="flex items-center gap-2 justify-between pt-2 border-t border-divider">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${isOn ? "bg-success animate-pulse" : "bg-default-300"
                }`}
            />
            <span className="text-xs text-default-500">
              {isOn ? "Đang hoạt động" : "Tắt"}
            </span>
          </div>
          <Chip
            size="sm"
            variant="dot"
            color={isOn ? "success" : "default"}
          >
            {isOn ? "ON" : "OFF"}
          </Chip>
        </div>
      </CardBody>
    </Card>
  );
}