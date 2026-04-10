import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { buildPrompt } from "@/lib/prompts";

export const runtime = "edge";

function getOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const platform = (formData.get("platform") as string) || "rakuten";
    const category = formData.get("category") as string | null;
    const imageFile = formData.get("image") as File | null;

    if (!imageFile) {
      return NextResponse.json({ error: "画像が必要です" }, { status: 400 });
    }

    // Convert image to base64
    const bytes = await imageFile.arrayBuffer();
    const base64 = btoa(
      new Uint8Array(bytes).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ""
      )
    );
    const mimeType = imageFile.type || "image/jpeg";

    const prompt = buildPrompt(platform, category || undefined);

    const openai = getOpenAI();
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${base64}`,
                detail: "high",
              },
            },
          ],
        },
      ],
    });

    const text = response.choices[0]?.message?.content || "";
    const usage = response.usage;

    return NextResponse.json({
      result: text,
      platform,
      category,
      tokens: usage?.total_tokens || 0,
      model: "gpt-4o",
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "生成に失敗しました";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
