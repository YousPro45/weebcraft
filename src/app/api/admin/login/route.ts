import { NextResponse } from "next/server";
import { createToken, ADMIN_COOKIE } from "@/lib/admin-auth";

// Credentials — set ADMIN_USER and ADMIN_PASSWORD in Vercel env vars.
// The defaults below let you log in locally with zero configuration.
const VALID_USER = process.env.ADMIN_USER     ?? "admin";
const VALID_PASS = process.env.ADMIN_PASSWORD ?? "webcraftmaroc2025";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (
      typeof username !== "string" ||
      typeof password !== "string" ||
      username.trim() !== VALID_USER ||
      password !== VALID_PASS
    ) {
      // Same generic message for wrong user or wrong password (no info leak)
      return NextResponse.json(
        { error: "Identifiants incorrects." },
        { status: 401 }
      );
    }

    const token = createToken(username.trim());

    const response = NextResponse.json({ success: true });
    response.cookies.set(ADMIN_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 h
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }
}
