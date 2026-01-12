import { Avatar, Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FaCalendar, FaEdit, FaEnvelope, FaUser } from "react-icons/fa";
import api from "../../../libs/api";

interface UserProfile {
  code?: string;
  username?: string;
  email?: string;
  fullName?: string;
  dateOfBirth?: string;
  avatarUrl?: string;
}

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: UserProfile | null;
}

export default function EditProfileModal({ isOpen, onClose, userData }: EditProfileModalProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<UserProfile>({
    code: '',
    username: '',
    email: '',
    fullName: '',
    dateOfBirth: '',
    avatarUrl: '',
  });

  useEffect(() => {
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
    mutationFn: async (data: UserProfile) => {
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