"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Input,
  Avatar,
  Chip,
  useDisclosure,
  Tabs,
  Tab,
} from "@heroui/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../libs/api";
import EmployeeTable from "./components/EmployeeTable";
import EmployeeGrid from "./components/EmployeeGrid";
import EmployeeFormModal from "./components/EmployeeFormModal";
import EmployeeDetailModal from "./components/EmployeeDetailModal";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import EmployeeStatsCards from "./components/EmployeeStatsCards";
import ImportExcelModal from "./components/ImportExcelModal";

export enum Role {
  ADMIN = "admin",
  MANAGER = "manager",
  STAFF = "staff",
}

export interface User {
  _id: string;
  code: string;
  username: string;
  email: string;
  dateOfBirth?: Date;
  fullName?: string;
  avatarUrl?: string;
  role: Role[];
  warehouseId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export default function EmployeesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"table" | "grid">("grid");
  const [editingEmployee, setEditingEmployee] = useState<User | null>(null);
  const [viewingEmployee, setViewingEmployee] = useState<User | null>(null);
  const [deletingEmployee, setDeletingEmployee] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const queryClient = useQueryClient();

  // Modals
  const {
    isOpen: isFormModalOpen,
    onOpen: onFormModalOpen,
    onClose: onFormModalClose,
  } = useDisclosure();

  const {
    isOpen: isDetailModalOpen,
    onOpen: onDetailModalOpen,
    onClose: onDetailModalClose,
  } = useDisclosure();

  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onClose: onDeleteModalClose,
  } = useDisclosure();

  const {
    isOpen: isImportModalOpen,
    onOpen: onImportModalOpen,
    onClose: onImportModalClose,
  } = useDisclosure();

  // Fetch all employees
  const { data: employees = [], isLoading } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const response = await api.get("/users/all");
      return response.data as User[];
    },
  });

  // Fetch warehouses for dropdown
  const { data: warehouses = [] } = useQuery({
    queryKey: ["warehouses"],
    queryFn: async () => {
      const response = await api.get("/warehouses");
      return response.data;
    },
  });

  // Create employee mutation
  const createEmployeeMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post("/auth/register", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      onFormModalClose();
      setEditingEmployee(null);
    },
  });

  // Update employee mutation
  const updateEmployeeMutation = useMutation({
    mutationFn: async (data: { userId: string; updates: any }) => {
      const response = await api.put(`/users/${data.userId}`, data.updates);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      onFormModalClose();
      setEditingEmployee(null);
    },
  });

  // Delete employee mutation
  const deleteEmployeeMutation = useMutation({
    mutationFn: async (userId: string) => {
      await api.delete(`/users/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      onDeleteModalClose();
      setDeletingEmployee(null);
    },
  });

  // Bulk import employees mutation
  const bulkImportMutation = useMutation({
    mutationFn: async (employees: any[]) => {
      const results = await Promise.allSettled(
        employees.map((emp) => api.post("/auth/register", emp))
      );
      return results;
    },
    onSuccess: (results) => {
      const succeeded = results.filter((r) => r.status === "fulfilled").length;
      const failed = results.filter((r) => r.status === "rejected").length;

      queryClient.invalidateQueries({ queryKey: ["employees"] });
      onImportModalClose();

      // You can add a toast notification here
      alert(`Import thành công: ${succeeded} nhân viên\nThất bại: ${failed} nhân viên`);
    },
  });

  // Handlers
  const handleAddEmployee = () => {
    setEditingEmployee(null);
    onFormModalOpen();
  };

  const handleEditEmployee = (employee: User) => {
    setEditingEmployee(employee);
    onFormModalOpen();
  };

  const handleViewEmployee = async (employee: User) => {
    try {
      const response = await api.get(`/users/${employee._id}/profile`);
      setViewingEmployee(response.data);
      onDetailModalOpen();
    } catch (error) {
      console.error("Error fetching employee details:", error);
    }
  };

  const handleDeleteEmployee = (employee: User) => {
    setDeletingEmployee({
      id: employee._id,
      name: employee.fullName || employee.username,
    });
    onDeleteModalOpen();
  };

  const handleSaveEmployee = (data: any) => {
    if (editingEmployee) {
      updateEmployeeMutation.mutate({
        userId: editingEmployee._id,
        updates: data,
      });
    } else {
      createEmployeeMutation.mutate(data);
    }
  };

  const handleConfirmDelete = () => {
    if (deletingEmployee) {
      deleteEmployeeMutation.mutate(deletingEmployee.id);
    }
  };

  const handleBulkImport = (employees: any[]) => {
    bulkImportMutation.mutate(employees);
  };

  // Filter employees
  let filteredEmployees = employees.filter(
    (emp) =>
      emp.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (selectedRole !== "all") {
    filteredEmployees = filteredEmployees.filter((emp) =>
      emp.role.includes(selectedRole as Role)
    );
  }

  // Calculate statistics
  const stats = {
    total: employees.length,
    admin: employees.filter((e) => e.role.includes(Role.ADMIN)).length,
    manager: employees.filter((e) => e.role.includes(Role.MANAGER)).length,
    staff: employees.filter((e) => e.role.includes(Role.STAFF)).length,
    active: employees.filter((e) => e.warehouseId).length,
  };

  return (
    <div className="p-6 mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            👥 Quản lý nhân viên
          </h1>
          <p className="text-default-500 mt-1">
            Quản lý thông tin và phân quyền nhân viên
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            color="secondary"
            size="lg"
            variant="flat"
            onPress={onImportModalOpen}
            className="font-semibold"
          >
            📥 Import Excel
          </Button>
          <Button
            color="primary"
            size="lg"
            onPress={handleAddEmployee}
            className="font-semibold"
          >
            ➕ Thêm nhân viên
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <EmployeeStatsCards stats={stats} />

      {/* Main Content */}
      <Card className="border border-divider">
        <CardHeader className="flex flex-col items-start gap-3 pb-0">
          <div className="flex w-full justify-between items-center">
            <Tabs
              selectedKey={viewMode}
              onSelectionChange={(key) => setViewMode(key as "table" | "grid")}
              variant="underlined"
              size="lg"
            >
              <Tab
                key="grid"
                title={
                  <div className="flex items-center gap-2">
                    <span>🎴</span>
                    <span>Lưới</span>
                  </div>
                }
              />
              <Tab
                key="table"
                title={
                  <div className="flex items-center gap-2">
                    <span>📋</span>
                    <span>Bảng</span>
                  </div>
                }
              />
            </Tabs>

            <div className="flex items-center gap-3">
              <Input
                placeholder="Tìm kiếm nhân viên..."
                startContent={<span>🔍</span>}
                value={searchQuery}
                onValueChange={setSearchQuery}
                className="w-80"
                size="sm"
              />
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant={selectedRole === "all" ? "solid" : "flat"}
                  color={selectedRole === "all" ? "primary" : "default"}
                  onPress={() => setSelectedRole("all")}
                >
                  Tất cả
                </Button>
                <Button
                  size="sm"
                  variant={selectedRole === Role.ADMIN ? "solid" : "flat"}
                  color={selectedRole === Role.ADMIN ? "danger" : "default"}
                  onPress={() => setSelectedRole(Role.ADMIN)}
                >
                  Admin
                </Button>
                <Button
                  size="sm"
                  variant={selectedRole === Role.MANAGER ? "solid" : "flat"}
                  color={selectedRole === Role.MANAGER ? "warning" : "default"}
                  onPress={() => setSelectedRole(Role.MANAGER)}
                >
                  Manager
                </Button>
                <Button
                  size="sm"
                  variant={selectedRole === Role.STAFF ? "solid" : "flat"}
                  color={selectedRole === Role.STAFF ? "success" : "default"}
                  onPress={() => setSelectedRole(Role.STAFF)}
                >
                  Staff
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          {viewMode === "table" ? (
            <EmployeeTable
              employees={filteredEmployees}
              warehouses={warehouses}
              isLoading={isLoading}
              onView={handleViewEmployee}
              onEdit={handleEditEmployee}
              onDelete={handleDeleteEmployee}
            />
          ) : (
            <EmployeeGrid
              employees={filteredEmployees}
              warehouses={warehouses}
              isLoading={isLoading}
              onView={handleViewEmployee}
              onEdit={handleEditEmployee}
              onDelete={handleDeleteEmployee}
            />
          )}
        </CardBody>
      </Card>

      {/* Employee Form Modal */}
      <EmployeeFormModal
        isOpen={isFormModalOpen}
        onClose={onFormModalClose}
        employee={editingEmployee}
        warehouses={warehouses}
        onSave={handleSaveEmployee}
        isLoading={
          createEmployeeMutation.isPending || updateEmployeeMutation.isPending
        }
      />

      {/* Employee Detail Modal */}
      <EmployeeDetailModal
        isOpen={isDetailModalOpen}
        onClose={onDetailModalClose}
        employee={viewingEmployee}
        warehouses={warehouses}
        onEdit={() => {
          onDetailModalClose();
          if (viewingEmployee) {
            handleEditEmployee(viewingEmployee);
          }
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={onDeleteModalClose}
        itemName={deletingEmployee?.name || ""}
        itemType="nhân viên"
        onConfirm={handleConfirmDelete}
        isLoading={deleteEmployeeMutation.isPending}
      />

      {/* Import Excel Modal */}
      <ImportExcelModal
        isOpen={isImportModalOpen}
        onClose={onImportModalClose}
        onImport={handleBulkImport}
        isLoading={bulkImportMutation.isPending}
      />
    </div>
  );
}