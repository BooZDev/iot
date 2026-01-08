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
import CustomLegend from "./CustomLengend";
import { useQuery } from "@tanstack/react-query";
import api from "../../../app/api/api";
import { usePathname } from "next/navigation";
import { transformApiData } from "../../../libs/transformApiData";
import { useState } from "react";

export default function TempHumCharts({ params }: { params?: { warehouseId: string } }) {
  const [data, setData] = useState<Array<{ time: string; temp: number; hum: number }>>([]);


  const warehouseId = params?.warehouseId || usePathname().split("/")[2];

  const data24h = useQuery({
    queryKey: ['tempHum24h'],
    queryFn: async () => {
      const response = await api.get(`data/hourly-avg-last-24h/${warehouseId}`);
      setData(transformApiData(response.data));
      return response.data;
    }
  })


  return (
    <div className="col-start-3 col-end-6">
      <Card className="border border-divider h-full">
        <CardHeader>
          <h3 className="text-lg font-medium mb-3">Đồ thị Nhệt độ, độ ẩm</h3>
        </CardHeader>
        <CardBody className="flex flex-col">
          <div className="w-full h-full font-bold">
            <ResponsiveContainer width="100%" height="100%" className={"aspect-[9/4]"}>
              <LineChart
                data={data}
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

                <Legend
                  verticalAlign="bottom"
                  height={36}
                  content={(props) => <CustomLegend {...(props as { payload: [{ dataKey: string; value: string }] })} />}
                />

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
