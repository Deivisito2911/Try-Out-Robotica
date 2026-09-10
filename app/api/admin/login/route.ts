import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const { username, password } = await request.json()
  if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD || username !== process.env.ADMIN_USERNAME || password !== process.env.ADMIN_PASSWORD) return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
  const response = NextResponse.json({ ok: true })
  response.cookies.set("robotics_admin", "authenticated", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 8 })
  return response
}

export async function DELETE() { const response = NextResponse.json({ ok: true }); response.cookies.delete("robotics_admin"); return response }
