import { NextResponse } from "next/server";

const CLOUDFLARE_DEPLOY_HOOK_URL =
  process.env.NEXT_PUBLIC_CLOUDFLARE_DEPLOY_HOOK_URL ??
  "https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/3baf262e-475c-4c5b-98d4-1155ff5bae59";

export async function POST() {
  try {
    const res = await fetch(CLOUDFLARE_DEPLOY_HOOK_URL, { method: "POST" });
    if (res.status !== 200 && res.status !== 202) {
      return NextResponse.json(
        { success: false, status: res.status },
        { status: 502 }
      );
    }
  } catch (err) {
    console.error(
      `[redeploy] Deploy hook request failed: ${
        err instanceof Error ? err.message : "unknown error"
      }`
    );
    return NextResponse.json(
      { success: false, error: "Deploy hook request failed." },
      { status: 502 }
    );
  }
  return NextResponse.json({ success: true });
}