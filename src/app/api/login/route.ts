import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function toB64(s: string) {
  return Buffer.from(s, "utf-8").toString("base64");
}

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Faltan datos" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    const incomingHash = toB64(password);
    if (incomingHash !== user.password) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: "Error interno" },
      { status: 500 }
    );
  }
}
