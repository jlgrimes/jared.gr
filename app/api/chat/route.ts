import { NextResponse } from "next/server";
import { model } from "./config";
import { getSystemPrompt } from "./prompts";
import { formatConversationHistory } from "./utils";
import { ChatRequest } from "./types";

export async function POST(req: Request) {
  try {
    const { message, messages = [] } = (await req.json()) as ChatRequest;

    const history = formatConversationHistory(messages);

    const prompt = `
${getSystemPrompt()}

${history}

User: ${message}
Assistant:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Process the response text to ensure markdown links are preserved
    const processedText = text.split("---")[0].trim().replace(/\n/g, "  \n");

    // Return the response
    return NextResponse.json({
      response: [
        {
          role: "assistant",
          content: processedText,
        },
      ],
    });
  } catch (error) {
    console.error("Error generating response:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
