import { LuLayoutDashboard } from 'react-icons/lu';
import { MdOutlineInventory2 } from 'react-icons/md';
import { GrOverview } from "react-icons/gr";
import { IoGameControllerOutline } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";

export type SideLink = {
  id?: string;
  href?: string;
  label: string;
  Icon: React.ReactNode;
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
    Icon: <MdOutlineInventory2 />,
  },
  {
    id: "devices",
    href: "/devices",
    label: "Thiết bị",
    Icon: <GrOverview />,
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
  }
]