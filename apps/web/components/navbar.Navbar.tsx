"use client";

import { Navbar as HeroNavbar, NavbarBrand, NavbarContent, NavbarItem, Avatar, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@heroui/react";
import { ThemeSwitcher } from "./themeSwitcher/ThemeSwitcher";
import { GiHamburgerMenu } from "react-icons/gi";

interface NavbarProps {
  onMenuToggle: () => void;
}

export default function Navbar({ onMenuToggle }: NavbarProps) {
  return (
    <HeroNavbar maxWidth="full" className="border-b border-divider">
      <NavbarBrand className="gap-3">
        <Button
          isIconOnly
          variant="light"
          className="md:hidden flex items-center justify-center"
          onPress={onMenuToggle}
        >
          <GiHamburgerMenu className="text-primary-500" size={24} />
        </Button>
        <div className="flex items-center gap-2">
          {/* <Icon icon="lucide:leaf" className="text-primary text-xl" /> */}
          <p className="font-semibold text-inherit hidden sm:block">BioHerb Smart Warehouse</p>
          <p className="font-semibold text-inherit block sm:hidden">BioHerb</p>
        </div>
      </NavbarBrand>

      <NavbarContent justify="end" className="gap-4">
        <NavbarItem>
          <ThemeSwitcher />
        </NavbarItem>
        <NavbarItem>
          <Button
            isIconOnly
            variant="light"
            aria-label="Notifications"
            className="relative"
          >
            {/* <Icon icon="lucide:bell" width={20} /> */}
            <span className="absolute top-1 right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-danger"></span>
            </span>
          </Button>
        </NavbarItem>
        <NavbarItem>
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="primary"
                name="John Doe"
                size="sm"
                src="https://img.heroui.chat/image/avatar?w=150&h=150&u=1"
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="User Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">john.doe@bioherb.com</p>
              </DropdownItem>
              <DropdownItem key="settings">My Settings</DropdownItem>
              <DropdownItem key="team">Team Settings</DropdownItem>
              <DropdownItem key="analytics">Analytics</DropdownItem>
              <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
              <DropdownItem key="logout" color="danger">
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
      </NavbarContent>
    </HeroNavbar>
  )
}