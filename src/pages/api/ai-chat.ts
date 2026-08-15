import type { NextApiRequest, NextApiResponse } from "next";
import { buildSystemPrompt, ChatMessage, UserPageContext } from "@/lib/aiPrompts";

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
  const modelUri = process.env.YANDEX_MODEL_URI || (folderId ? `gpt://${folderId}/alice-ai-llm/latest` : undefined);

  // System prompt assembly
  const systemPromptText = buildSystemPrompt(language, pageContext);

  // Format messages for Yandex Foundation Models Completions API
  const yandexMessages = [
    {
      role: "system",
      text: systemPromptText,
    },
    ...messages.map((m) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      text: m.text,
    })),
  ];

  // If credentials are not configured yet, provide intelligent local fallback
  if (!apiKey || !modelUri) {
    const lastUserMessage = messages[messages.length - 1]?.text?.toLowerCase() || "";
    let reply = "";

    if (lastUserMessage.includes("плов") || lastUserMessage.includes("еда") || lastUserMessage.includes("поесть")) {
      reply = `🥘 **Где поесть лучший плов и национальные блюда:**\n\n` +
        `• **Ташкент**: Легендарный *Besh Qozon* (Ош Маркази у телебашни). Плов готовят к 12:00 в казанах на 3 тонны! Обязательно попробуйте свадебный плов с казы и перепелиными яйцами (~35 000 сум).\n` +
        `• **Самарканд**: *Центр плова на Пенджикентской* или *Osh Markazi*. Самаркандский плов слоеный, не перемешивается и подается с желтой морковью и нутом.\n` +
        `• **Бухара**: *The Plov Lounge* или ресторан *Minzifa* у Ляби-Хауза с видом на старый город.`;
    } else if (lastUserMessage.includes("афросиаб") || lastUserMessage.includes("поезд") || lastUserMessage.includes("билет")) {
      reply = `🚆 **Скоростной поезд Afrosiyob (Афросиаб):**\n\n` +
        `• **Маршруты и время в пути**:\n` +
        `  - Ташкент ↔ Самарканд: **2 часа 15 минут**\n` +
        `  - Ташкент ↔ Бухара: **3 часа 50 минут**\n\n` +
        `• **Где покупать**: Официальный сайт и приложение **railway.uz**.\n` +
        `• 💡 **Важно**: Билеты открываются за **45 дней** до поездки и быстро раскупаются в сезон (весна/осень). Рекомендуем брать заранее!`;
    } else if (lastUserMessage.includes("чарвак") || lastUserMessage.includes("чимган") || lastUserMessage.includes("горы") || lastUserMessage.includes("амирсой")) {
      reply = `🏔️ **Поездка в горы Ташкентской области (Чарвак, Чимган, Амирсой):**\n\n` +
        `• **Расстояние**: ~85–95 км от Ташкента (1 час 15 минут на авто).\n` +
        `• **Чарвак**: Бирюзовое водохранилище, катание на катерах ($15–20/30 мин), пляжи и знаменитый горный шашлык в комплексе «Бочка».\n` +
        `• **Амирсой**: Круглогодичный горный курорт европейского уровня с гондольными подъемниками Doppelmayr на вершину 2290м.\n` +
        `• 🚗 **Как добраться**: Такси Yandex Go (тариф Межгород от 150 000 сум) или индивидуальный трансфер в нашем конструкторе.`;
    } else if (lastUserMessage.includes("бюджет") || lastUserMessage.includes("цена") || lastUserMessage.includes("сколько стоит")) {
      reply = `💰 **Ориентировочный бюджет на поездку по Узбекистану:**\n\n` +
        `• **Бюджетный (Low-Budget)**: ~$30–45 на человека в день (уютные аутентичные гостевые дома, вкусный уличный стритфуд, метро и общественный транспорт).\n` +
        `• **Комфорт (Optimal)**: ~$75–110 в день на человека (отели 3–4* с завтраком, поезд Afrosiyob, индивидуальные экскурсии и рестораны национальной кухни).\n` +
        `• **Премиум**: от $180+ в день (бутик-отели в медресе, персональный минивэн с водителем, топ-гиды с лицензией).`;
    } else {
      reply = `✨ **Здравствуйте! Я DiyorAI — ваш персональный AI-помощник по Узбекистану.**\n\n` +
        `Я могу помочь вам:\n` +
        `• Спланировать маршрут по **Самарканду, Бухаре, Хиве и Ташкенту**;\n` +
        `• Подсказать расписание поездов **Afrosiyob** и трансферов;\n` +
        `• Подобрать лучшие чайханы, рестораны и видовые точки;\n` +
        `• Рассчитать точный бюджет на вашу семью или компанию.\n\n` +
        `*Спросите меня о чем угодно или выберите одну из быстрых подсказок ниже!*`;
    }

    return res.status(200).json({
      reply,
      isDemo: true,
      hint: "Для подключения реальной Alice AI LLM укажите YANDEX_API_KEY и YANDEX_MODEL_URI в .env.local",
    });
  }

  try {
    const yandexUrl = "https://llm.api.cloud.yandex.net/foundationModels/v1/completion";

    const payload = {
      modelUri,
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

    if (folderId) {
      headers["x-folder-id"] = folderId;
    }

    const response = await fetch(yandexUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Yandex LLM API Error:", response.status, errorText);
      return res.status(response.status).json({
        error: "Yandex AI Studio API error",
        details: errorText,
      });
    }

    const data = await response.json();
    const assistantText = data?.result?.alternatives?.[0]?.message?.text || "Извините, не удалось сформировать ответ.";

    return res.status(200).json({
      reply: assistantText,
      isDemo: false,
      usage: data?.result?.usage,
    });
  } catch (error: any) {
    console.error("AI Chat Handler Error:", error);
    return res.status(500).json({
      error: "Internal server error connecting to AI model",
      message: error?.message,
    });
  }
}
