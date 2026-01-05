"use server";

import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

export type Session = {
  user: {
    id: string;
  };
  accessToken: string;
  // refreshToken: string;
};

const secresKey = process.env.SESSION_SECRET_KEY;
const encodeedKey = new TextEncoder().encode(secresKey);

export async function createSession(payload: Session) {
  const exporedAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  const session = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodeedKey);

  const cookieStore = await cookies();
  cookieStore.set({
    name: "session",
    value: session,
    httpOnly: true,
    secure: true,
    expires: exporedAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  if (!session) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(session as string, encodeedKey, {
      algorithms: ["HS256"],
    });

    return payload as Session;
  } catch (err) {
    console.error("Lỗi xác thực phiên:", err);
    return null;
  }
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}
