import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== "string" || !text.trim()) {
      return NextResponse.json({ error: "text is required" }, { status: 400 });
    }

    const apiKey = process.env.MURF_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "MURF_API_KEY not configured" }, { status: 500 });
    }

    const response = await fetch("https://api.murf.ai/v1/speech/stream", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: text.trim(),
        voiceId: process.env.MURF_VOICE_ID ?? "en-US-marcus",
        model: "FALCON",
        locale: "en-US",
        format: "WAV",
        sampleRate: 24000,
        channelType: "MONO",
        style: "Conversation",
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      console.error("[murf-tts] API error:", response.status, body);
      return NextResponse.json(
        { error: "TTS service error", detail: body },
        { status: response.status }
      );
    }

    const audioBuffer = await response.arrayBuffer();

    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/wav",
        "Content-Length": String(audioBuffer.byteLength),
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[murf-tts] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
