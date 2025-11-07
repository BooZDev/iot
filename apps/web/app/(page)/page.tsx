import AlertsTable from "../../components/dashboard/alertsTable/AlertsTable";
import DeviceControls from "../../components/dashboard/deviceControls/DeviceControls";
import SensorCards from "../../components/dashboard/sensorCards/SensorCards";
import TempHumCharts from "../../components/dashboard/tempHumCharts/TempHumCharts";

export default function Page() {
  return (
    <div className="grid gap-6">
      <SensorCards />
      <div className="grid grid-cols-5 gap-6">
        <DeviceControls />
        <TempHumCharts />
      </div>
      <div className="grid grid-cols-5 gap-6">
        <AlertsTable />
      </div>
    </div>
  );
}
