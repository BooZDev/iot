"use client";

import { Card, CardBody, Progress } from "@heroui/react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { io } from "socket.io-client";
import { FaTemperatureHigh } from 'react-icons/fa';
import { WiHumidity } from 'react-icons/wi';
import { GiSmokingOrb } from 'react-icons/gi';
import { MdOutlineWbTwilight } from "react-icons/md";


export default function SensorCards() {
  const [data, setData] = useState<{ temp: number, hum: number, gasValue: number, luxValue: number }>({ temp: 0, hum: 0, gasValue: 0, luxValue: 0 });

  useEffect(() => {
    console.log("Attempting to connect to WebSocket server...");
    const socket = io("https://ws.synapseware.eladev.site", {
      transports: ["websocket"], // ép dùng WebSocket, tránh fallback polling
      reconnection: true,
      reconnectionAttempts: 5,
    });

    socket.on("connect", () => {
      console.log("🟢 Connected to server:", socket.id);
      socket.emit("ping_server", "Hello from Next.js client!");
    });

    socket.on("message", (msg) => {
      setData(msg);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Disconnected from server");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="border border-divider">
        <CardBody className="flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-md bg-primary-100 dark:bg-primary-900/20`}>
                <FaTemperatureHigh className="text-primary-500" size={24} />
              </div>
              <h3 className="text-lg font-medium">Nhiệt độ</h3>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full bg-success-100 text-success-500 dark:bg-success-900/20`}>
              Normal
            </span>
          </div>

          <div className="flex items-end gap-2 mb-3">
            <motion.span
              key={data.temp}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-semibold"
            >
              {data.temp}
            </motion.span>
            <span className="text-default-500">°C</span>
          </div>

          <Progress
            aria-label={`Temperature level`}
            value={(data.temp / 40) * 100}
            color="success"
            className="h-1.5"
          />
        </CardBody>
      </Card>

      <Card className="border border-divider">
        <CardBody>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-md bg-secondary-100 dark:bg-secondary-900/20`}>
                <WiHumidity className="text-secondary-500" size={24} />
              </div>
              <h3 className="text-lg font-medium">Độ ẩm</h3>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full bg-${data.hum > 70 ? "warning" : "success"}-100 text-${data.hum > 70 ? "warning" : "success"}-500 dark:bg-${data.hum > 70 ? "warning" : "success"}-900/20`}>
              Normal
            </span>
          </div>

          <div className="flex items-end gap-2 mb-3">
            <motion.span
              key={data.hum}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-semibold"
            >
              {data.hum}
            </motion.span>
            <span className="text-default-500">%</span>
          </div>

          <Progress
            aria-label={`Độ ẩm`}
            value={data.hum}
            color="success"
            className="h-1.5"
          />
        </CardBody>
      </Card>

      <Card className="border border-divider">
        <CardBody>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-md bg-success-100 dark:bg-success-900/20`}>
                <GiSmokingOrb className="text-success-500" size={24} />
              </div>
              <h3 className="text-lg font-medium">Nồng độ khí Gas/Khói</h3>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full bg-${data.gasValue < 6 || data.gasValue > 7.5 ? "warning" : "success"}-100 text-${data.gasValue < 6 || data.gasValue > 7.5 ? "warning" : "success"}-500 dark:bg-${data.gasValue < 6 || data.gasValue > 7.5 ? "warning" : "success"}-900/20`}>
              {(data.gasValue < 6 || data.gasValue > 7.5 ? "warning" : "success") === "success" ? "Normal" : "Attention"}
            </span>
          </div>

          <div className="flex items-end gap-2 mb-3">
            <motion.span
              key={data.gasValue}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-semibold"
            >
              {data.gasValue}
            </motion.span>
            <span className="text-default-500">ppm</span>
          </div>

          <Progress
            aria-label={`Nồng độ khí Gas/Khói`}
            value={(data.gasValue / 5000) * 100}
            color={(data.gasValue > 1000 ? "warning" : "success") as "success" | "warning" | "danger"}
            className="h-1.5"
          />
        </CardBody>
      </Card>

      <Card className="border border-divider">
        <CardBody>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-md bg-warning-100 dark:bg-warning-900/20`}>
                <MdOutlineWbTwilight className="text-warning-500" size={24} />
              </div>
              <h3 className="text-lg font-medium">Cường độ ánh sáng</h3>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full bg-${data.luxValue > 800 ? "danger" : "success"}-100 text-${data.luxValue > 800 ? "danger" : "success"}-500 dark:bg-${data.luxValue > 800 ? "danger" : "success"}-900/20`}>
              {(data.luxValue > 800 ? "danger" : "success") === "success" ? "Normal" : "Attention"}
            </span>
          </div>

          <div className="flex items-end gap-2 mb-3">
            <motion.span
              key={data.luxValue}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-semibold"
            >
              {data.luxValue.toFixed(2)}
            </motion.span>
            <span className="text-default-500">lux</span>
          </div>

          <Progress
            aria-label={`Cường độ ánh sáng`}
            value={(data.luxValue / 2000) * 100}
            color={(data.luxValue > 800 ? "danger" : "success") as "success" | "warning" | "danger"}
            className="h-1.5"
          />
        </CardBody>
      </Card>
    </div>
  );
}