import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemName: string;
  itemType: string;
  onConfirm: () => void;
  isLoading: boolean;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  itemName,
  itemType,
  onConfirm,
  isLoading,
}: DeleteConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalContent>
        <ModalHeader>
          <h3 className="text-xl font-bold text-danger">🗑️ Xác nhận xóa</h3>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-3">
            <p className="text-default-700">
              Bạn có chắc chắn muốn xóa {itemType}:
            </p>
            <div className="p-3 bg-danger-50 rounded-lg">
              <p className="font-bold text-danger">{itemName}</p>
            </div>
            <p className="text-sm text-default-500">
              ⚠️ Hành động này không thể hoàn tác!
            </p>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="default" variant="light" onPress={onClose}>
            Hủy
          </Button>
          <Button
            color="danger"
            onPress={onConfirm}
            isLoading={isLoading}
          >
            Xóa
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}