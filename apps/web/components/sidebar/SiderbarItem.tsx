import { Button } from "@heroui/react";
import Link from "next/link";
import { SideLink } from "./sideLinks";
import { usePathname } from "next/navigation";

export default function SidebarItem({
  Icon, href, label
}: SideLink) {
  const pathname = usePathname();
  const isActive = href === pathname;

  return (
    <Button
      as={Link}
      href={href || "#"}
      variant={isActive ? "flat" : "light"}
      color={isActive ? "primary" : "default"}
      className={`justify-start w-full text-lg mb-1 ${isActive ? "font-bold" : "font-medium"}`}
      startContent={Icon}
    >
      <span>{label}</span>
    </Button>
  )
}