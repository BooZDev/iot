"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Image } from "@heroui/react";
import SidebarItem from "./SiderbarItem";
import { sideLinks } from "./sideLinks";
import useSidebarStore from "../../stores/UseSidebarStore";
import { FiHelpCircle } from 'react-icons/fi';
import { BiLogOut } from 'react-icons/bi';

export default function Sidebar() {
  const isOpen = useSidebarStore((state) => state.isOpen);
  const parentWidth = isOpen ? 240 : 60;

  return (
    <motion.div
      initial={{ width: parentWidth }} animate={{ width: parentWidth }} transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`bg-content1 border-r border-divider full overflow-hidden md:block relative`}
    >
      <div className="flex flex-col h-screen p-4 fixed top-0 left-0 w-[inherit] max-h-screen">
        <Link href={"/"} className="flex items-center justify-center mb-8 mt-2">
          <Image src="/images/logo.webp" alt="Logo" width={30} height={30} />
          {isOpen && <span className="ml-2 text-xl font-bold text-blue-500">SynapseWare</span>}
        </Link>

        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {sideLinks.map((item) => (
            <SidebarItem
              key={item.id}
              Icon={item.Icon}
              href={item.href}
              label={item.label}
            />
          ))}
        </div>

        <div className="mt-auto pt-4 border-t border-divider">
          <SidebarItem Icon={<FiHelpCircle />} label="Help & Support" />
          <SidebarItem
            Icon={<BiLogOut />}
            href="/api/signout"
            label="Sign Out"
          />
        </div>
      </div>
    </motion.div>
  )
}