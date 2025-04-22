import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { content } = await req.json();

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that summarizes text in 2-3 sentences.",
        },
        {
          role: "user",
          content: `Summarize this note: ${content}`,
        },
      ],
      temperature: 0.5,
      max_tokens: 300,
    }),
  });

  const data = await res.json();

  return NextResponse.json({
    summary: data.choices?.[0]?.message?.content || "No summary returned.",
  });
}
