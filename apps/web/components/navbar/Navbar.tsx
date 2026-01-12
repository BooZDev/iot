"use client";

import {
  Navbar as HeroNavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  useDisclosure,
} from "@heroui/react";
import { ThemeSwitcher } from "../themeSwitcher/ThemeSwitcher";
import { GiHamburgerMenu } from "react-icons/gi";
import useSidebarStore from "../../stores/UseSidebarStore";
import { FaKey, FaUser } from "react-icons/fa";
import { useQuery } from '@tanstack/react-query';
import api from '../../libs/api';
import EditProfileModal from './components/EditProfileModal';
import ChangePasswordModal from './components/ChangePasswordModal';
import axios from "axios";

// Main Navbar Component
export default function Navbar() {
  const { toggleSidebar } = useSidebarStore();
  const editModal = useDisclosure();
  const passwordModal = useDisclosure();

  // Fetch user profile
  const { data: userData } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const response = await api.get('/users/profile');
      return response.data;
    },
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleLogout = async () => {
    if (window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
      await axios.get('/api/signout')
      window.location.href = '/';
    }
  };

  return (
    <>
      <HeroNavbar maxWidth="full" className="border-b border-divider">
        <NavbarBrand className="gap-3">
          <Button
            isIconOnly
            variant="light"
            className="md:hidden flex items-center justify-center"
            onPress={toggleSidebar}
          >
            <GiHamburgerMenu className="text-primary-500" size={24} />
          </Button>
          <div className="flex items-center gap-2">
            <p className="font-semibold text-inherit hidden sm:block">EVBoo Smart Warehouse</p>
            <p className="font-semibold text-inherit block sm:hidden">EVBoo</p>
          </div>
        </NavbarBrand>

        <NavbarContent justify="end" className="gap-4">
          <NavbarItem>
            <ThemeSwitcher />
          </NavbarItem>
          <NavbarItem>
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  isBordered
                  as="button"
                  className="transition-transform hover:scale-110"
                  color="primary"
                  name={userData?.fullName || "User"}
                  size="sm"
                  src={userData?.avatarUrl || "https://img.heroui.chat/image/avatar?w=150&h=150&u=1"}
                  showFallback
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="User Actions" variant="flat">
                <DropdownItem key="profile" className="h-14 gap-2" textValue="Profile info">
                  <p className="font-semibold">Đăng nhập với tư cách</p>
                  <p className="font-semibold text-primary">
                    {userData?.email || 'Loading...'}
                  </p>
                </DropdownItem>
                <DropdownItem
                  key="my-settings"
                  startContent={<FaUser className="text-lg" />}
                  onPress={editModal.onOpen}
                  textValue="My Settings"
                >
                  Thông tin cá nhân
                </DropdownItem>
                <DropdownItem
                  key="change-password"
                  startContent={<FaKey className="text-lg" />}
                  onPress={passwordModal.onOpen}
                  textValue="Change Password"
                >
                  Đổi mật khẩu
                </DropdownItem>
                <DropdownItem key="team" textValue="Team Settings">
                  Cài đặt nhóm
                </DropdownItem>
                <DropdownItem key="analytics" textValue="Analytics">
                  Phân tích
                </DropdownItem>
                <DropdownItem key="help_and_feedback" textValue="Help & Feedback">
                  Trợ giúp & Phản hồi
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  color="danger"
                  onPress={handleLogout}
                  textValue="Log Out"
                >
                  Đăng xuất
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarItem>
        </NavbarContent>
      </HeroNavbar>

      {/* Modals */}
      <EditProfileModal
        isOpen={editModal.isOpen}
        onClose={editModal.onClose}
        userData={userData}
      />

      <ChangePasswordModal
        isOpen={passwordModal.isOpen}
        onClose={passwordModal.onClose}
      />
    </>
  );
}