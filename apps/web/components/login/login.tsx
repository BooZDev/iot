"use client";

import { Button, Form, Input } from "@heroui/react";
import { login } from "../../libs/auth";

export default function LoginPage() {
  return <Form action={login} className="flex flex-col gap-4 w-80 items-center bg-white/20 p-6 rounded-lg shadow-cyan-950 shadow-lg">
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
  </Form>
}