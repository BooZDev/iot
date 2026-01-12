import { LuArrowLeftRight, LuClipboardList, LuLayoutDashboard, LuPackage } from 'react-icons/lu';
import { MdOutlineInventory2 } from 'react-icons/md';
import { GrOverview } from "react-icons/gr";
import { IoGameControllerOutline } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { MdDeviceHub } from "react-icons/md";


export type SideLink = {
  id?: string;
  href?: string;
  label: string;
  Icon: React.ReactNode;
  onClick?: () => void;
}

export const sideLinks: SideLink[] = [
  {
    id: "dashboard",
    href: "/",
    label: "Dashboard",
    Icon: <LuLayoutDashboard />,
  },
  {
    id: "overview",
    href: "/overview",
    label: "Tổng quan",
    Icon: <GrOverview />,
  },
  {
    id: "devices",
    href: "/devices",
    label: "Thiết bị",
    Icon: <MdDeviceHub />,
  },
  {
    id: "controls",
    href: "/controls",
    label: "Điều khiển",
    Icon: <IoGameControllerOutline />,
  },
  {
    id: "employees",
    href: "/employees",
    label: "Nhân viên",
    Icon: <FaRegUser />,
  },
  {
    id: "products",
    href: "/products",
    label: "Sản phẩm",
    Icon: <LuPackage />,
  },
  {
    id: "product-manage",
    href: "/product-manage",
    label: "Quản lý sản phẩm",
    Icon: <LuClipboardList />,
  },
  {
    id: "inventory-transaction",
    href: "/inventory-transaction",
    label: "Giao dịch kho",
    Icon: <LuArrowLeftRight />,
  }
]