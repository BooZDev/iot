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

  return (
    <motion.div
      initial={{ width: isOpen ? 240 : 60 }} animate={{ width: isOpen ? 240 : 60 }} transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`bg-content1 border-r border-divider h-screen overflow-hidden ${isOpen ? "block" : "hidden"} md:block`}
    >
      <div className="flex flex-col h-full p-4">
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
          <SidebarItem Icon={<BiLogOut />} label="Logout" />
        </div>
      </div>
    </motion.div>
  )
}