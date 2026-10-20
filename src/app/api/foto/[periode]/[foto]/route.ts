import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { periode: string; foto: string } }
) {
  const user = await getCurrentUser();
  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { periode, foto } = params;

  if (!/^\d{6}$/.test(periode) || !/^[0-9A-Za-z._-]+$/.test(foto)) {
    return new NextResponse("Invalid parameters", { status: 400 });
  }

  const cleanFoto = foto.replace(/\.jpg$/i, "");
  const baseUrl = process.env.ANDROID_URL || "http://192.168.8.11/simpam/bacamtr/meterair";
  const targetUrl = `${baseUrl}/${periode}/${cleanFoto}.jpg`;

  try {
    const upstreamRes = await fetch(targetUrl, {
      cache: "force-cache",
    });

    if (!upstreamRes.ok) {
      return new NextResponse("Photo not found", { status: 404 });
    }

    const arrayBuffer = await upstreamRes.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "private, max-age=604800, stale-while-revalidate=2592000",
      },
    });
  } catch (err) {
    console.error("Error fetching photo:", err);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
