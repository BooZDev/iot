/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Card,
  CardBody,
  Progress,
  Chip,
} from "@heroui/react";
import * as XLSX from "xlsx";
import { Role } from "../EmployeesPage";

interface ImportExcelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (employees: any[]) => void;
  isLoading: boolean;
}

export default function ImportExcelModal({
  isOpen,
  onClose,
  onImport,
  isLoading,
}: ImportExcelModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      parseExcelFile(selectedFile);
    }
  };

  const parseExcelFile = async (file: File) => {
    setIsProcessing(true);
    setErrors([]);
    setParsedData([]);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = firstSheetName ? workbook.Sheets[firstSheetName] : undefined;
      if (!worksheet) {
        throw new Error("No valid worksheet found in the Excel file.");
      }
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const validationErrors: string[] = [];
      const employees: any[] = [];

      jsonData.forEach((row: any, index: number) => {
        const rowNum = index + 2; // +2 because Excel is 1-indexed and has header

        // Validate required fields
        if (!row.code) {
          validationErrors.push(`Dòng ${rowNum}: Thiếu mã nhân viên`);
        }
        if (!row.username) {
          validationErrors.push(`Dòng ${rowNum}: Thiếu tên đăng nhập`);
        }
        if (!row.email) {
          validationErrors.push(`Dòng ${rowNum}: Thiếu email`);
        }
        if (!row.password) {
          validationErrors.push(`Dòng ${rowNum}: Thiếu mật khẩu`);
        }

        // Validate email format
        if (row.email && !/\S+@\S+\.\S+/.test(row.email)) {
          validationErrors.push(`Dòng ${rowNum}: Email không hợp lệ`);
        }

        // Validate password length
        if (row.password && row.password.length < 6) {
          validationErrors.push(
            `Dòng ${rowNum}: Mật khẩu phải có ít nhất 6 ký tự`
          );
        }

        // Parse roles
        let roles: Role[] = [Role.STAFF];
        if (row.role) {
          const roleStr = row.role.toString().toUpperCase();
          if (roleStr.includes("ADMIN")) roles.push(Role.ADMIN);
          if (roleStr.includes("MANAGER")) roles.push(Role.MANAGER);
          if (roleStr.includes("STAFF")) {
            if (!roles.includes(Role.STAFF)) roles.push(Role.STAFF);
          }
        }

        // Parse date of birth
        let dateOfBirth = undefined;
        if (row.dateOfBirth) {
          try {
            // Excel dates are stored as numbers
            if (typeof row.dateOfBirth === "number") {
              const excelDate = XLSX.SSF.parse_date_code(row.dateOfBirth);
              dateOfBirth = new Date(
                excelDate.y,
                excelDate.m - 1,
                excelDate.d
              ).toISOString();
            } else {
              dateOfBirth = new Date(row.dateOfBirth).toISOString();
            }
          } catch (error) {
            validationErrors.push(
              `Dòng ${rowNum}: Ngày sinh không hợp lệ`
            );
          }
        }

        if (validationErrors.length === 0 || validationErrors.length < 5) {
          employees.push({
            code: row.code?.toString(),
            username: row.username?.toString(),
            email: row.email?.toString(),
            password: row.password?.toString(),
            fullName: row.fullName?.toString() || "",
            dateOfBirth,
            avatarUrl: row.avatarUrl?.toString() || "",
            role: roles,
            warehouseId: row.warehouseId?.toString() || undefined,
          });
        }
      });

      setErrors(validationErrors);
      setParsedData(employees);
    } catch (error) {
      setErrors(["Lỗi đọc file: " + (error as Error).message]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImport = () => {
    if (parsedData.length > 0) {
      onImport(parsedData);
    }
  };

  const handleDownloadTemplate = () => {
    // Create template data
    const template = [
      {
        code: "NV001",
        username: "johndoe",
        email: "john@example.com",
        password: "123456",
        fullName: "Nguyễn Văn A",
        dateOfBirth: "1990-01-15",
        avatarUrl: "https://example.com/avatar.jpg",
        role: "STAFF",
        warehouseId: "",
      },
      {
        code: "NV002",
        username: "janedoe",
        email: "jane@example.com",
        password: "123456",
        fullName: "Trần Thị B",
        dateOfBirth: "1992-05-20",
        avatarUrl: "",
        role: "ADMIN,MANAGER",
        warehouseId: "",
      },
    ];

    // Create workbook and worksheet
    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Employees");

    // Set column widths
    ws["!cols"] = [
      { wch: 10 }, // code
      { wch: 15 }, // username
      { wch: 25 }, // email
      { wch: 10 }, // password
      { wch: 20 }, // fullName
      { wch: 12 }, // dateOfBirth
      { wch: 30 }, // avatarUrl
      { wch: 15 }, // role
      { wch: 25 }, // warehouseId
    ];

    // Download file
    XLSX.writeFile(wb, "employee_template.xlsx");
  };

  const handleClose = () => {
    setFile(null);
    setParsedData([]);
    setErrors([]);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="3xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader>
          <h3 className="text-xl font-bold">📥 Import nhân viên từ Excel</h3>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            {/* Instructions */}
            <Card className="border border-divider bg-primary-50">
              <CardBody className="p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <span>ℹ️</span>
                  <span>Hướng dẫn</span>
                </h4>
                <ul className="text-sm space-y-1 text-default-700">
                  <li>1. Tải file mẫu Excel bên dưới</li>
                  <li>2. Điền thông tin nhân viên vào file</li>
                  <li>3. Upload file để kiểm tra</li>
                  <li>4. Nhấn Import để thêm vào hệ thống</li>
                </ul>
              </CardBody>
            </Card>

            {/* Download Template */}
            <Card className="border border-divider">
              <CardBody className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold mb-1">📄 File mẫu Excel</h4>
                    <p className="text-sm text-default-500">
                      Tải xuống file mẫu để điền thông tin
                    </p>
                  </div>
                  <Button
                    color="primary"
                    variant="flat"
                    onPress={handleDownloadTemplate}
                  >
                    ⬇️ Tải file mẫu
                  </Button>
                </div>
              </CardBody>
            </Card>

            {/* Required Fields */}
            <Card className="border border-divider">
              <CardBody className="p-4">
                <h4 className="font-semibold mb-3">📋 Các trường bắt buộc:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Chip size="sm" color="danger" variant="flat">
                      Bắt buộc
                    </Chip>
                    <span>code (Mã NV)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Chip size="sm" color="danger" variant="flat">
                      Bắt buộc
                    </Chip>
                    <span>username</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Chip size="sm" color="danger" variant="flat">
                      Bắt buộc
                    </Chip>
                    <span>email</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Chip size="sm" color="danger" variant="flat">
                      Bắt buộc
                    </Chip>
                    <span>password</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Chip size="sm" color="default" variant="flat">
                      Tùy chọn
                    </Chip>
                    <span>fullName</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Chip size="sm" color="default" variant="flat">
                      Tùy chọn
                    </Chip>
                    <span>dateOfBirth</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Chip size="sm" color="default" variant="flat">
                      Tùy chọn
                    </Chip>
                    <span>avatarUrl</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Chip size="sm" color="default" variant="flat">
                      Tùy chọn
                    </Chip>
                    <span>role (mặc định: STAFF)</span>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* File Upload */}
            <Card className="border-2 border-dashed border-primary">
              <CardBody className="p-6">
                <div className="text-center">
                  <div className="mb-4">
                    <span className="text-6xl">📁</span>
                  </div>
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileChange}
                    className="hidden"
                    id="excel-upload"
                  />
                  <label htmlFor="excel-upload">
                    <Button as="span" color="primary" className="cursor-pointer">
                      📤 Chọn file Excel
                    </Button>
                  </label>
                  {file && (
                    <p className="text-sm text-default-500 mt-2">
                      File đã chọn: <strong>{file.name}</strong>
                    </p>
                  )}
                </div>
              </CardBody>
            </Card>

            {/* Processing */}
            {isProcessing && (
              <Card className="border border-divider">
                <CardBody className="p-4">
                  <p className="text-sm mb-2">Đang xử lý file...</p>
                  <Progress
                    isIndeterminate
                    color="primary"
                    size="sm"
                    aria-label="Processing"
                  />
                </CardBody>
              </Card>
            )}

            {/* Errors */}
            {errors.length > 0 && (
              <Card className="border border-danger bg-danger-50">
                <CardBody className="p-4">
                  <h4 className="font-semibold text-danger mb-2 flex items-center gap-2">
                    <span>⚠️</span>
                    <span>Lỗi ({errors.length})</span>
                  </h4>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {errors.map((error, index) => (
                      <p key={index} className="text-sm text-danger">
                        • {error}
                      </p>
                    ))}
                  </div>
                </CardBody>
              </Card>
            )}

            {/* Preview */}
            {parsedData.length > 0 && (
              <Card className="border border-success bg-success-50">
                <CardBody className="p-4">
                  <h4 className="font-semibold text-success mb-2 flex items-center gap-2">
                    <span>✅</span>
                    <span>Sẵn sàng import ({parsedData.length} nhân viên)</span>
                  </h4>
                  <div className="max-h-60 overflow-y-auto">
                    <div className="space-y-2">
                      {parsedData.slice(0, 5).map((emp, index) => (
                        <div
                          key={index}
                          className="p-2 bg-white text-black rounded text-sm flex justify-between items-center"
                        >
                          <div>
                            <span className="font-semibold">{emp.fullName || emp.username}</span>
                            <span className="text-default-500 ml-2">({emp.code})</span>
                          </div>
                          <div className="flex gap-1">
                            {emp.role.map((r: Role) => (
                              <Chip key={r} color="primary" size="sm" variant="solid">
                                {r}
                              </Chip>
                            ))}
                          </div>
                        </div>
                      ))}
                      {parsedData.length > 5 && (
                        <p className="text-center text-sm text-default-500">
                          ... và {parsedData.length - 5} nhân viên khác
                        </p>
                      )}
                    </div>
                  </div>
                </CardBody>
              </Card>
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={handleClose}>
            Hủy
          </Button>
          <Button
            color="primary"
            onPress={handleImport}
            isLoading={isLoading}
            isDisabled={parsedData.length === 0 || errors.length > 0}
          >
            📥 Import {parsedData.length > 0 && `(${parsedData.length})`}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}