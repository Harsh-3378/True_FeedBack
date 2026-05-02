import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { NextRequest, NextResponse } from "next/server";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

const groq = createOpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});

export const runtime = "edge";

export async function POST(request: NextRequest) {
  try {
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as single string. Each question should be separated by a '||'.These questions are for an anonymous social messaging platform, like Qooh.md, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What is a hobby you have recently started?||If you could have dinner with any historical figure, who would it be?||What is a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    const result = streamText({
      model: groq("llama-3.1-8b-instant"),
      prompt,
      //   maxTokens: 400,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Error in suggest-messages route:", error);
    return NextResponse.json(
      { message: "An error occurred while generating suggestions." },
      { status: 500 },
    );
  }
}
