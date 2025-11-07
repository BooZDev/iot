"use client";

import { Card, CardBody, CardHeader } from "@heroui/react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import CustomTooltip from "./CustomTooltip";

export default function TempHumCharts() {
  return (
    <div className="col-start-3 col-end-6">
      <Card className="border border-divider h-full">
        <CardHeader>
          <h3 className="text-lg font-medium mb-3">
            Đồ thị Nhệt độ, độ ẩm
          </h3>
        </CardHeader>
        <CardBody className="flex flex-col">
          <div className="w-full h-full font-bold">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={[
                  { time: "10:00", temp: 22, hum: 55 },
                  { time: "11:00", temp: 23, hum: 57 },
                  { time: "12:00", temp: 24, hum: 60 },
                  { time: "13:00", temp: 25, hum: 62 },
                  { time: "14:00", temp: 26, hum: 65 },
                  { time: "15:00", temp: 27, hum: 67 },
                  { time: "16:00", temp: 28, hum: 70 },
                  { time: "17:00", temp: 27, hum: 68 },
                  { time: "18:00", temp: 26, hum: 66 },
                  { time: "19:00", temp: 25, hum: 64 },
                  { time: "20:00", temp: 24, hum: 62 },
                  { time: "21:00", temp: 23, hum: 60 },
                  { time: "22:00", temp: 22, hum: 58 },
                ]}
                margin={{ top: 0, right: 5, left: 5, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--heroui-divider))"
                />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 12 }}
                  stroke="hsl(var(--heroui-default-400))"
                  tickLine={{ stroke: "hsl(var(--heroui-divider))" }}
                />
                <YAxis
                  yAxisId="temp"
                  domain={[0, 40]}
                  tick={{ fontSize: 12 }}
                  stroke="hsl(var(--heroui-default-400))"
                  tickLine={{ stroke: "hsl(var(--heroui-divider))" }}
                  label={{
                    value: "°C",
                    position: "insideLeft",
                    angle: -90,
                    style: {
                      textAnchor: "middle",
                      fill: "hsl(var(--heroui-primary))",
                    },
                  }}
                />
                <YAxis
                  yAxisId="hum"
                  orientation="right"
                  domain={[30, 90]}
                  tick={{ fontSize: 12 }}
                  stroke="hsl(var(--heroui-default-400))"
                  tickLine={{ stroke: "hsl(var(--heroui-divider))" }}
                  label={{
                    value: "%",
                    position: "insideRight",
                    angle: -90,
                    style: {
                      textAnchor: "middle",
                      fill: "hsl(var(--heroui-secondary))",
                    },
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  yAxisId="temp"
                  type="monotone"
                  dataKey="temp"
                  stroke="hsl(var(--heroui-primary))"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{
                    r: 6,
                    stroke: "hsl(var(--heroui-primary))",
                    strokeWidth: 2,
                    fill: "hsl(var(--heroui-content1))",
                  }}
                  animationDuration={500}
                />
                <Line
                  yAxisId="hum"
                  type="monotone"
                  dataKey="hum"
                  stroke="hsl(var(--heroui-secondary))"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{
                    r: 6,
                    stroke: "hsl(var(--heroui-secondary))",
                    strokeWidth: 2,
                    fill: "hsl(var(--heroui-content1))",
                  }}
                  animationDuration={500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
