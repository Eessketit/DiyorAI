import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import { buildSystemPrompt, ChatMessage, UserPageContext } from "@/lib/aiPrompts";
import { extractTripIntentFromText, generateAiTripPlan } from "@/lib/aiTripExtractor";

interface AiChatRequestBody {
  messages: ChatMessage[];
  pageContext?: UserPageContext;
  language?: "ru" | "uz" | "en";
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  const { messages = [], pageContext, language = "ru" }: AiChatRequestBody = req.body || {};

  if (!messages || messages.length === 0) {
    return res.status(400).json({ error: "Messages array cannot be empty." });
  }

  const apiKey = process.env.YANDEX_API_KEY;
  const folderId = process.env.YANDEX_FOLDER_ID;
  const promptId = process.env.YANDEX_PROMPT_ID || "fvtr09ofbgji99u1j62k";
  const modelUri = process.env.YANDEX_MODEL_URI || (folderId ? `gpt://${folderId}/yandexgpt/latest` : undefined);

  const lastUserMessage = messages[messages.length - 1]?.text || "";

  // Detect language of the query or fallback to interface language
  const lowerText = lastUserMessage.toLowerCase();
  let targetLang = language;

  const isUzbekText = /([a-z]'|[a-z]‘|[a-z]’|salom|qayerda|sayohat|bizga|kerak|kun|byudjet|reja|borish|bormoqchiman|oila|qancha|tatib|shahar|poyezd|yordam|rahmat|assalomu|aleykum)/i.test(lowerText);
  const isEnglishText = /\b(hello|hi|where|how|trip|plan|tour|itinerary|days|budget|family|travel|vacation|uzbekistan|please|tell|what)\b/i.test(lowerText);

  if (isUzbekText) {
    targetLang = "uz";
  } else if (isEnglishText && !/[а-яё]/i.test(lowerText)) {
    targetLang = "en";
  }

  // Extract structured plan intent if user asks for tour/itinerary
  const tripIntent = extractTripIntentFromText(lastUserMessage);
  const tripProposal = tripIntent ? generateAiTripPlan(tripIntent) : undefined;

  // If credentials are missing, return structured fallback with proposal if available
  if (!apiKey) {
    const fallbackGreeting = targetLang === "uz"
      ? "✨ Assalomu alaykum! Men DiyorAI — sizning O'zbekiston bo'yicha shaxsiy AI-yordamchingizman. Siz uchun ajoyib sayohat rejasini tuzdim!"
      : targetLang === "en"
      ? "✨ Hello! I am DiyorAI, your personal Uzbekistan AI travel concierge. I have crafted a great tailor-made itinerary for you!"
      : "✨ Здравствуйте! Я DiyorAI — ваш персональный AI-помощник по Узбекистану. Я составил для вас отличный персонализированный тур!";

    return res.status(200).json({
      reply: fallbackGreeting,
      tripProposal,
      isDemo: true,
    });
  }

  // 1. Try Yandex AI Studio Responses API (Custom Prompt with Alice AI LLM)
  if (apiKey && folderId && promptId) {
    try {
      const client = new OpenAI({
        apiKey,
        baseURL: "https://ai.api.cloud.yandex.net/v1",
        defaultHeaders: {
          "OpenAI-Project": folderId,
        },
      });

      const langPrefix = targetLang === "uz"
        ? `[TIZIM KO'RSATMASI: Javobingizni FAQAT O'ZBEK TILIDA (lotin yozuvida) yozing! Hech qanday ruscha so'z ishlatmang!]`
        : targetLang === "en"
        ? `[SYSTEM INSTRUCTION: Answer EXCLUSIVELY IN ENGLISH! Do not use Russian!]`
        : `[ИНСТРУКЦИЯ: Отвечай на русском языке]`;

      // Assemble contextual input
      let inputWithContext = `${langPrefix}\n\nFoydalanuvchi savoli: ${lastUserMessage}`;
      if (pageContext?.region || pageContext?.totalDays || pageContext?.budgetMaxUsd) {
        inputWithContext = `${langPrefix}\n[Kontekst: Hudud: ${pageContext.region || "O'zbekiston"}, Kunlar: ${pageContext.totalDays || "ko'rsatilmagan"}, Byudjet: $${pageContext.budgetMaxUsd || "ko'rsatilmagan"}]\n\nSavol: ${lastUserMessage}`;
      }

      const response: any = await (client as any).responses.create({
        prompt: {
          id: promptId,
        },
        input: inputWithContext,
      });

      const replyText = response?.output_text || response?.choices?.[0]?.message?.content;
      if (replyText) {
        return res.status(200).json({
          reply: replyText,
          tripProposal,
          isDemo: false,
          source: "yandex_studio_prompt",
        });
      }
    } catch (err: any) {
      console.warn("Yandex Studio Responses API failed, trying Foundation Models API...", err?.message);
    }
  }

  // 2. Fallback to Foundation Models Completions API
  try {
    const yandexUrl = "https://llm.api.cloud.yandex.net/foundationModels/v1/completion";
    const systemPromptText = buildSystemPrompt(targetLang, pageContext);

    const yandexMessages = [
      { role: "system", text: systemPromptText },
      ...messages.map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        text: m.text,
      })),
    ];

    const payload = {
      modelUri: modelUri || `gpt://${folderId}/yandexgpt/latest`,
      completionOptions: {
        stream: false,
        temperature: 0.3,
        maxTokens: "2000",
      },
      messages: yandexMessages,
    };

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Authorization": `Api-Key ${apiKey}`,
    };
    if (folderId) headers["x-folder-id"] = folderId;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    const response = await fetch(yandexUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Yandex API status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const assistantText = data?.result?.alternatives?.[0]?.message?.text || "Извините, не удалось сформировать ответ.";

    return res.status(200).json({
      reply: assistantText,
      tripProposal,
      isDemo: false,
      source: "yandex_foundation_models",
      usage: data?.result?.usage,
    });
  } catch (error: any) {
    console.error("AI Chat Handler Error:", error);
    return res.status(500).json({
      error: "Internal server error connecting to AI model",
      message: error?.message || "Failed to reach AI service",
    });
  }
}
