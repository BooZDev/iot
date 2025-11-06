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
    id: "inventory",
    href: "/inventory",
    label: "Nhà kho",
    Icon: <MdOutlineInventory2 />,
  }
]