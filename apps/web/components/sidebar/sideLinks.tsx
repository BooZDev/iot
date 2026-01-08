import { LuLayoutDashboard } from 'react-icons/lu';
import { MdOutlineInventory2 } from 'react-icons/md';

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
    Icon: <MdOutlineInventory2 />,
  },
  {
    id: "controls",
    href: "/controls",
    label: "Điều khiển",
    Icon: <MdOutlineInventory2 />,
  }
]