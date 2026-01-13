"use server";

import { redirect } from "next/navigation";
import { createRfSession, createSession } from "./session";

export async function login(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  const url = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001";

  const res = await fetch(`${url}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });

  if (!res.ok) {
    const error = await res.json();
    return { error };
  }

  const data = await res.json();

  await createSession({
    user: { id: data.id },
    accessToken: data.accessToken,
  });

  await createRfSession({
    refreshToken: data.refreshToken,
  });

  redirect("/");
}
