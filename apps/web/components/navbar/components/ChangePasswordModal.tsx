import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import api from "../../../libs/api";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import { FaKey } from "react-icons/fa";

// Change Password Modal Component
interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: async (data: string) => {
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

    mutation.mutate(formData.newPassword);
  };

  useEffect(() => {
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