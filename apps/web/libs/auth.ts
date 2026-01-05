"use server";

import { createSession } from "./session";
import { redirect } from "next/navigation";

export async function login(email: string, password: string) {
  const res = await fetch("http://localhost:5001/auth/login", {
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

  redirect("/");
}
