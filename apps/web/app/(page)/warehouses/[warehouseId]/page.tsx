"use server";

import AlertsTable from "../../../../components/dashboard/alertsTable/AlertsTable";
import DeviceControls from "../../../../components/dashboard/deviceControls/DeviceControls";
import SensorCards from "../../../../components/dashboard/sensorCards/SensorCards";
import TempHumCharts from "../../../../components/dashboard/tempHumCharts/TempHumCharts";
import api from "../../../api/api";
import { JoinRoom } from "../../../Providers";

export default async function Page({ params }: { params: { warehouseId: string } }) {
  const { warehouseId } = await params;

  const warehouse = await api.get(`/warehouses/${warehouseId}`);

  return (
    <JoinRoom warehouseId={warehouseId}>
      <div className="grid gap-6">
        <div className="mx-8 my-2">
          <h1 className="text-3xl font-bold">
            {warehouse.data.name} Dashboard
          </h1>
          <p className="mt-2 text-md text-gray-300">
            Quản lý và giám sát các cảm biến trong kho hàng của bạn.
          </p>
        </div>
        <SensorCards />
        <div className="grid grid-cols-5 gap-6">
          <DeviceControls />
          <TempHumCharts />
        </div>
        <div className="grid grid-cols-5 gap-6">
          <AlertsTable />
        </div>
      </div>
    </JoinRoom>
  );
}
