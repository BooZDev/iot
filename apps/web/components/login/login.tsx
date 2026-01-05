"use client";

import { Button, Form, Input } from "@heroui/react";
import { useState } from "react";
import { login } from "../../libs/auth";

export default function LoginPage() {
  const [error, setError] = useState<{ message: string } | null>(null);

  interface FormDataEntries {
    email: string;
    password: string;
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: FormDataEntries = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    const res = await login(data.email, data.password);

    if (res && 'error' in res) {
      setError(res.error);
      return;
    }

  }

  return <Form onSubmit={onSubmit} className="flex flex-col gap-4 w-80 items-center bg-white/20 p-6 rounded-lg shadow-cyan-950 shadow-lg">
    <div>
      <h2 className="text-2xl font-bold mb-2">Login</h2>
    </div>
    <Input
      isRequired
      errorMessage="Vui lòng nhập email hợp lệ"
      label="Email"
      labelPlacement="outside"
      name="email"
      placeholder="Nhập email của bạn"
      type="email"
    />
    <Input
      isRequired
      errorMessage="Vui lòng nhập mật khẩu"
      label="Password"
      labelPlacement="outside"
      name="password"
      placeholder="Nhập mật khẩu của bạn"
      type="password"
    />
    <div className="flex gap-4 mt-4">
      <Button type="submit">Login</Button>
      <Button type="reset" variant="flat">Reset</Button>
    </div>
    {error && (
      <div className="text-small text-red-400 mt-4">
        * {error.message}
      </div>
    )}
  </Form>
}