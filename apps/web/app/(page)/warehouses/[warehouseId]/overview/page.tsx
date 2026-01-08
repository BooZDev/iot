import WarehouseDeviceMap from "../../../../../components/warehousePage/overview/WarehouseDeviceMap";
import api from "../../../../api/api";

export default async function Page({ params }: { params: { warehouseId: string } }) {
  const { warehouseId } = await params;

  const data = await api.get(`/warehouses/${warehouseId}`);

  return (
    <div className="grid gap-6">
      <div className="grid gap-6">
        <div className="mx-8 my-2">
          <h1 className="text-3xl font-bold">
            Tổng quan nhà kho: {data.data.name}
          </h1>
          <p className="mt-2 text-md text-gray-300">
            Quản lý và giám sát các cảm biến trong kho hàng của bạn.
          </p>
        </div>
        <WarehouseDeviceMap warehouseId={warehouseId} />
      </div>
    </div>
  );
}