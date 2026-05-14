import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import type { User } from "@repo/query-hook";

export async function getInitialUser(): Promise<User> {
  const secret = process.env.JWT_SECRET;
  if (!secret) return null;

  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret),
    );

    if (
      typeof payload.userId !== "string" ||
      typeof payload.role !== "string" ||
      typeof payload.name !== "string"
    ) {
      return null;
    }

    return {
      id: payload.userId,
      role: payload.role,
      name: payload.name,
      profileImageUrl:
        typeof payload.profileImageUrl === "string"
          ? payload.profileImageUrl
          : null,
    };
  } catch {
    return null;
  }
}
