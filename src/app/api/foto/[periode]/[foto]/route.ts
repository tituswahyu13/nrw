import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
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
    const inputBuffer = Buffer.from(arrayBuffer);

    const { searchParams } = new URL(request.url);
    const widthParam = searchParams.get("w");
    const width = widthParam ? parseInt(widthParam, 10) : null;

    if (width && width > 50 && width <= 1600) {
      const resizedBuffer = await sharp(inputBuffer)
        .rotate()
        .resize({ width, withoutEnlargement: true })
        .jpeg({ quality: 80, progressive: true })
        .toBuffer();

      return new NextResponse(new Uint8Array(resizedBuffer), {
        headers: {
          "Content-Type": "image/jpeg",
          "Cache-Control": "private, max-age=604800, stale-while-revalidate=2592000",
        },
      });
    }

    const orientedBuffer = await sharp(inputBuffer)
      .rotate()
      .jpeg({ quality: 90, progressive: true })
      .toBuffer();

    return new NextResponse(new Uint8Array(orientedBuffer), {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "private, max-age=604800, stale-while-revalidate=2592000",
      },
    });
  } catch (err) {
    console.error("Error fetching or processing photo:", err);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
