"use client";

import React, { useState } from 'react';
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
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  useDisclosure,
} from "@heroui/react";
import { ThemeSwitcher } from "../themeSwitcher/ThemeSwitcher";
import { GiHamburgerMenu } from "react-icons/gi";
import useSidebarStore from "../../stores/UseSidebarStore";
import { FaBell, FaEdit, FaKey, FaUser, FaEnvelope, FaCalendar } from "react-icons/fa";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../app/api/api';

// Edit Profile Modal Component
function EditProfileModal({ isOpen, onClose, userData }) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    code: '',
    username: '',
    email: '',
    fullName: '',
    dateOfBirth: '',
    avatarUrl: '',
  });

  React.useEffect(() => {
    if (userData) {
      setFormData({
        code: userData.code || '',
        username: userData.username || '',
        email: userData.email || '',
        fullName: userData.fullName || '',
        dateOfBirth: userData.dateOfBirth ? userData.dateOfBirth.split('T')[0] : '',
        avatarUrl: userData.avatarUrl || '',
      });
    }
  }, [userData]);

  const mutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.patch('/users', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      onClose();
      alert('✅ Cập nhật thông tin thành công!');
    },
    onError: (error) => {
      alert('❌ Lỗi: ' + error.message);
    },
  });

  const handleSubmit = () => {
    const submitData = {
      code: formData.code,
      username: formData.username,
      email: formData.email,
      fullName: formData.fullName,
      dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString() : undefined,
      avatarUrl: formData.avatarUrl,
    };
    mutation.mutate(submitData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader>
          <div className="flex items-center gap-2">
            <FaEdit className="text-primary" />
            <span>Chỉnh sửa thông tin cá nhân</span>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="flex flex-col gap-4">
            <div className="flex justify-center mb-2">
              <Avatar
                src={formData.avatarUrl}
                className="w-24 h-24"
                name={formData.fullName}
                isBordered
                color="primary"
              />
            </div>

            <Input
              label="Mã nhân viên"
              placeholder="Nhập mã nhân viên"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              startContent={<FaUser className="text-default-400" />}
              variant="bordered"
            />

            <Input
              label="Tên đăng nhập"
              placeholder="Nhập tên đăng nhập"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              startContent={<FaUser className="text-default-400" />}
              variant="bordered"
            />

            <Input
              label="Email"
              type="email"
              placeholder="Nhập email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              startContent={<FaEnvelope className="text-default-400" />}
              variant="bordered"
            />

            <Input
              label="Họ và tên"
              placeholder="Nhập họ và tên"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              startContent={<FaUser className="text-default-400" />}
              variant="bordered"
            />

            <Input
              label="Ngày sinh"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              startContent={<FaCalendar className="text-default-400" />}
              variant="bordered"
            />

            <Input
              label="URL Avatar"
              placeholder="Nhập URL avatar"
              value={formData.avatarUrl}
              onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
              variant="bordered"
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Hủy
          </Button>
          <Button
            color="primary"
            onPress={handleSubmit}
            isLoading={mutation.isPending}
          >
            Lưu thay đổi
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

// Change Password Modal Component
function ChangePasswordModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.patch('/users/repassword', data);
      return response.data;
    },
    onSuccess: () => {
      onClose();
      setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setError('');
      alert('✅ Đổi mật khẩu thành công!');
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const handleSubmit = () => {
    setError('');

    if (!formData.oldPassword) {
      setError('Vui lòng nhập mật khẩu hiện tại!');
      return;
    }

    if (!formData.newPassword) {
      setError('Vui lòng nhập mật khẩu mới!');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Mật khẩu mới không khớp!');
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự!');
      return;
    }

    mutation.mutate({
      oldPassword: formData.oldPassword,
      newPassword: formData.newPassword,
    });
  };

  React.useEffect(() => {
    if (!isOpen) {
      setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setError('');
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalContent>
        <ModalHeader>
          <div className="flex items-center gap-2">
            <FaKey className="text-warning" />
            <span>Đổi mật khẩu</span>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="flex flex-col gap-4">
            {error && (
              <div className="p-3 bg-danger-50 dark:bg-danger-900/20 text-danger rounded-lg text-sm border border-danger-200 dark:border-danger-800">
                {error}
              </div>
            )}

            <Input
              label="Mật khẩu hiện tại"
              type="password"
              placeholder="Nhập mật khẩu hiện tại"
              value={formData.oldPassword}
              onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })}
              variant="bordered"
              isRequired
            />

            <Input
              label="Mật khẩu mới"
              type="password"
              placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
              value={formData.newPassword}
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              variant="bordered"
              isRequired
            />

            <Input
              label="Xác nhận mật khẩu mới"
              type="password"
              placeholder="Nhập lại mật khẩu mới"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              variant="bordered"
              isRequired
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Hủy
          </Button>
          <Button
            color="primary"
            onPress={handleSubmit}
            isLoading={mutation.isPending}
          >
            Đổi mật khẩu
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

// Main Navbar Component
export default function Navbar() {
  const { toggleSidebar } = useSidebarStore();
  const editModal = useDisclosure();
  const passwordModal = useDisclosure();

  // Fetch user profile
  const { data: userData, isLoading, error } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const response = await api.get('/users/profile');
      return response.data;
    },
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleLogout = () => {
    // Implement logout logic here
    if (window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
      // Clear tokens, redirect to login, etc.
      console.log('Logging out...');
      // Example: 
      // localStorage.removeItem('token');
      // router.push('/login');
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