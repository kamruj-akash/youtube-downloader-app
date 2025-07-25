// File: youtube-downloader-app/app/api/download/route.ts

import { NextRequest, NextResponse } from "next/server";
import ytdl from "ytdl-core";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");
    const type = searchParams.get("type") || "video";
    const quality = searchParams.get("quality") || "highest";

    if (!url || !ytdl.validateURL(url)) {
      return new NextResponse("Invalid or missing YouTube URL", {
        status: 400,
      });
    }

    const info = await ytdl.getInfo(url);
    const title =
      info.videoDetails.title.replace(/[^\x00-\x7F]/g, "") || "video";
    const fileExtension = type === "audio" ? "mp3" : "mp4";

    const headers = new Headers();
    headers.set(
      "Content-Disposition",
      `attachment; filename="${title}.${fileExtension}"`
    );

    const stream = ytdl(url, {
      filter: type === "audio" ? "audioonly" : "audioandvideo",
      quality: type === "audio" ? "highestaudio" : quality,
    });

    // ytdl-core stream is a Node.js readable stream. We need to convert it to a Web Stream for Next.js Edge/Serverless functions.
    const webStream = new ReadableStream({
      start(controller) {
        stream.on("data", (chunk) => {
          controller.enqueue(chunk);
        });
        stream.on("end", () => {
          controller.close();
        });
        stream.on("error", (err) => {
          console.error("Stream error:", err);
          controller.error(err);
        });
      },
    });

    return new NextResponse(webStream, {
      status: 200,
      headers,
    });
  } catch (err) {
    console.error(err);
    return new NextResponse("Error downloading video.", { status: 500 });
  }
}
