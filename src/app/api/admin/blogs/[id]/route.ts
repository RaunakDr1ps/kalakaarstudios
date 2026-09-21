import { NextResponse } from "next/server";

const CRM_API_URL = (
  process.env.NEXT_PUBLIC_CRM_API_URL ??
  "https://crm.kalakaarstudios.co.in/api"
).replace(/\/+$/, "");

const ADMIN_KEY =
  process.env.ADMIN_KEY ||
  process.env.NEXT_PUBLIC_ADMIN_KEY ||
  "kalakaar_super_secret_key_2026_xyz";

async function proxyUpdate(req: Request, id: string) {
  const body = await req.text();
  try {
    const res = await fetch(`${CRM_API_URL}/blogs/${encodeURIComponent(id)}`, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": ADMIN_KEY,
      },
      body,
      cache: "no-store",
    });
    const text = await res.text();
    return new NextResponse(text, {
      status: res.status,
      headers: { "Content-Type": res.headers.get("content-type") ?? "application/json" },
    });
  } catch (err) {
    console.error(
      `[admin-blogs] Proxy ${req.method} failed for ${id}: ${
        err instanceof Error ? err.message : "unknown error"
      }`
    );
    return NextResponse.json({ success: false, error: "CRM request failed." }, { status: 502 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return proxyUpdate(req, id);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return proxyUpdate(req, id);
}