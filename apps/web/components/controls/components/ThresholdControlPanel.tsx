import { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Button,
  Input,
  Switch,
  Divider,
} from "@heroui/react";
import { DeviceWithSubDevices } from "../../../types/device";
import api from "../../../libs/api";

interface ThresholdControlPanelProps {
  device: DeviceWithSubDevices;
  onUpdateThreshold: (
    deviceId: string,
    threshold: {
      temp_lo: number;
      temp_hi: number;
      hum_lo: number;
      hum_hi: number;
      gas_hi: number;
      light_lo: number;
      light_hi: number;
    }
  ) => void;
  isLoading: boolean;
}

export default function ThresholdControlPanel({
  device,
  onUpdateThreshold,
  isLoading,
}: ThresholdControlPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [thresholdData, setThresholdData] = useState({
    temperature: {
      enabled: false,
      min: 18,
      max: 30,
    },
    humidity: {
      enabled: false,
      min: 40,
      max: 70,
    },
    gas: {
      enabled: false,
      max: 1000,
    },
    light: {
      enabled: false,
      min: 200,
      max: 800,
    },
  });

  useEffect(() => {
    const fetchThreshold = async () => {
      if (!device.warehouseId) return;

      try {
        const response = await api.get(`/threshold/${device.warehouseId}`);

        if (response.data) {
          const t = response.data.thresholds;
          setThresholdData({
            temperature: {
              enabled: t.temp_lo !== -99 || t.temp_hi !== 200,
              min: t.temp_lo !== -99 ? t.temp_lo : 18,
              max: t.temp_hi !== 200 ? t.temp_hi : 30,
            },
            humidity: {
              enabled: t.hum_lo !== -1 || t.hum_hi !== 101,
              min: t.hum_lo !== -1 ? t.hum_lo : 40,
              max: t.hum_hi !== 101 ? t.hum_hi : 70,
            },
            gas: {
              enabled: t.gas_hi !== 1000,
              max: t.gas_hi !== 1000 ? t.gas_hi : 1000,
            },
            light: {
              enabled: t.light_lo !== -100 || t.light_hi !== 3000,
              min: t.light_lo !== -100 ? t.light_lo : 200,
              max: t.light_hi !== 3000 ? t.light_hi : 800,
            },
          });
        }
      } catch (error) {
        console.error("Failed to fetch threshold:", error);
      }
    };

    fetchThreshold();
  }, [device.warehouseId]);

  const handleSaveThreshold = () => {
    const packet = {
      temp_lo: thresholdData.temperature.enabled
        ? thresholdData.temperature.min
        : -99,
      temp_hi: thresholdData.temperature.enabled
        ? thresholdData.temperature.max
        : 200,
      hum_lo: thresholdData.humidity.enabled ? thresholdData.humidity.min : -1,
      hum_hi: thresholdData.humidity.enabled ? thresholdData.humidity.max : 101,
      gas_hi: thresholdData.gas.enabled ? thresholdData.gas.max : 1000,
      light_lo: thresholdData.light.enabled ? thresholdData.light.min : -100,
      light_hi: thresholdData.light.enabled ? thresholdData.light.max : 3000,
    };
    onUpdateThreshold(device._id, packet);
  };

  const handleResetThreshold = () => {
    setThresholdData({
      temperature: {
        enabled: false,
        min: 18,
        max: 30,
      },
      humidity: {
        enabled: false,
        min: 40,
        max: 70,
      },
      gas: {
        enabled: false,
        max: 1000,
      },
      light: {
        enabled: false,
        min: 200,
        max: 800,
      },
    });
  };

  return (
    <Card className="border border-primary">
      <CardBody className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚙️</span>
            <div>
              <h4 className="font-bold">Cấu hình ngưỡng cảnh báo</h4>
              <p className="text-xs text-default-500">
                Thiết lập ngưỡng tự động điều khiển thiết bị
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="flat"
            onPress={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Thu gọn ▲" : "Mở rộng ▼"}
          </Button>
        </div>

        {isExpanded && (
          <div className="space-y-4">
            <Divider />

            {/* Temperature Threshold */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🌡️</span>
                  <span className="font-semibold">Nhiệt độ (°C)</span>
                </div>
                <Switch
                  size="sm"
                  isSelected={thresholdData.temperature.enabled}
                  onValueChange={(checked) =>
                    setThresholdData({
                      ...thresholdData,
                      temperature: {
                        ...thresholdData.temperature,
                        enabled: checked,
                      },
                    })
                  }
                />
              </div>
              {thresholdData.temperature.enabled && (
                <div className="grid grid-cols-2 gap-3 pl-8">
                  <Input
                    size="sm"
                    type="number"
                    label="Tối thiểu"
                    value={thresholdData.temperature.min.toString()}
                    onValueChange={(val) =>
                      setThresholdData({
                        ...thresholdData,
                        temperature: {
                          ...thresholdData.temperature,
                          min: parseFloat(val) || 0,
                        },
                      })
                    }
                    endContent="°C"
                  />
                  <Input
                    size="sm"
                    type="number"
                    label="Tối đa"
                    value={thresholdData.temperature.max.toString()}
                    onValueChange={(val) =>
                      setThresholdData({
                        ...thresholdData,
                        temperature: {
                          ...thresholdData.temperature,
                          max: parseFloat(val) || 0,
                        },
                      })
                    }
                    endContent="°C"
                  />
                </div>
              )}
            </div>

            <Divider />

            {/* Humidity Threshold */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">💧</span>
                  <span className="font-semibold">Độ ẩm (%)</span>
                </div>
                <Switch
                  size="sm"
                  isSelected={thresholdData.humidity.enabled}
                  onValueChange={(checked) =>
                    setThresholdData({
                      ...thresholdData,
                      humidity: {
                        ...thresholdData.humidity,
                        enabled: checked,
                      },
                    })
                  }
                />
              </div>
              {thresholdData.humidity.enabled && (
                <div className="grid grid-cols-2 gap-3 pl-8">
                  <Input
                    size="sm"
                    type="number"
                    label="Tối thiểu"
                    value={thresholdData.humidity.min.toString()}
                    onValueChange={(val) =>
                      setThresholdData({
                        ...thresholdData,
                        humidity: {
                          ...thresholdData.humidity,
                          min: parseFloat(val) || 0,
                        },
                      })
                    }
                    endContent="%"
                  />
                  <Input
                    size="sm"
                    type="number"
                    label="Tối đa"
                    value={thresholdData.humidity.max.toString()}
                    onValueChange={(val) =>
                      setThresholdData({
                        ...thresholdData,
                        humidity: {
                          ...thresholdData.humidity,
                          max: parseFloat(val) || 0,
                        },
                      })
                    }
                    endContent="%"
                  />
                </div>
              )}
            </div>

            <Divider />

            {/* Light Threshold */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">💡</span>
                  <span className="font-semibold">Ánh sáng (lux)</span>
                </div>
                <Switch
                  size="sm"
                  isSelected={thresholdData.light.enabled}
                  onValueChange={(checked) =>
                    setThresholdData({
                      ...thresholdData,
                      light: {
                        ...thresholdData.light,
                        enabled: checked,
                      },
                    })
                  }
                />
              </div>
              {thresholdData.light.enabled && (
                <div className="grid grid-cols-2 gap-3 pl-8">
                  <Input
                    size="sm"
                    type="number"
                    label="Tối thiểu"
                    value={thresholdData.light.min.toString()}
                    onValueChange={(val) =>
                      setThresholdData({
                        ...thresholdData,
                        light: {
                          ...thresholdData.light,
                          min: parseFloat(val) || 0,
                        },
                      })
                    }
                    endContent="lux"
                  />
                  <Input
                    size="sm"
                    type="number"
                    label="Tối đa"
                    value={thresholdData.light.max.toString()}
                    onValueChange={(val) =>
                      setThresholdData({
                        ...thresholdData,
                        light: {
                          ...thresholdData.light,
                          max: parseFloat(val) || 0,
                        },
                      })
                    }
                    endContent="lux"
                  />
                </div>
              )}
            </div>

            <Divider />

            {/* Gas Threshold */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🌫️</span>
                  <span className="font-semibold">Khí gas (ppm)</span>
                </div>
                <Switch
                  size="sm"
                  isSelected={thresholdData.gas.enabled}
                  onValueChange={(checked) =>
                    setThresholdData({
                      ...thresholdData,
                      gas: {
                        ...thresholdData.gas,
                        enabled: checked,
                      },
                    })
                  }
                />
              </div>
              {thresholdData.gas.enabled && (
                <div className="pl-8">
                  <Input
                    size="sm"
                    type="number"
                    label="Tối đa"
                    value={thresholdData.gas.max.toString()}
                    onValueChange={(val) =>
                      setThresholdData({
                        ...thresholdData,
                        gas: {
                          ...thresholdData.gas,
                          max: parseFloat(val) || 0,
                        },
                      })
                    }
                    endContent="ppm"
                  />
                </div>
              )}
            </div>

            <Divider />

            {/* Action Buttons */}
            <div className="flex gap-2 justify-end pt-2">
              <Button
                size="sm"
                variant="flat"
                onPress={handleResetThreshold}
                isDisabled={isLoading}
              >
                Đặt lại
              </Button>
              <Button
                size="sm"
                color="primary"
                onPress={handleSaveThreshold}
                isLoading={isLoading}
              >
                💾 Lưu ngưỡng
              </Button>
            </div>

            <div className="p-3 bg-warning-50 rounded-lg">
              <p className="text-xs text-warning-600">
                ⚠️ Lưu ý: Khi ngưỡng được kích hoạt, hệ thống sẽ tự động điều
                chỉnh các thiết bị con để duy trì các giá trị trong phạm vi đã
                thiết lập.
              </p>
              <p className="text-xs text-warning-600 mt-1">
                📝 Giá trị mặc định (disabled): temp_lo=-99, temp_hi=200,
                hum_lo=-1, hum_hi=101, gas_hi=1000, light_lo=-100, light_hi=3000
              </p>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
}