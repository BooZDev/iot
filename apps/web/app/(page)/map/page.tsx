"use client";

import dynamic from "next/dynamic";

const WarehouseDeviceMap = dynamic(
  () => import("../../../components/warehouseDeviceMap/WarehouseDeviceMap"),
  { ssr: false }
);

export default function Page() {
  return <div><WarehouseDeviceMap /></div>;
}