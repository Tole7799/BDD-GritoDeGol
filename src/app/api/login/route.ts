import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const toB64 = (s: string) => Buffer.from(s, "utf-8").toString("base64");

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ success: false }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ success: false }, { status: 401 });

    if (toB64(password) !== user.password)
      return NextResponse.json({ success: false }, { status: 401 });

    const res = NextResponse.json({ success: true });
    res.cookies.set("userEmail", user.email, {
      httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 8,
    });
    return res;
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
