import { useEffect, useState } from "react";
import { useTranslation } from "@/lib/i18n";

interface VoiceFactCheckProps {
  onTranscript: (text: string) => void;
  isProcessing?: boolean;
}

export default function VoiceFactCheck({ onTranscript, isProcessing }: VoiceFactCheckProps) {
  const { language } = useTranslation();
  const [isListening, setIsListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const [interimText, setInterimText] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setSupported(false);
      }
    }
  }, []);

  const startListening = () => {
    if (typeof window === "undefined") return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Голосовой ввод не поддерживается вашим браузером. Используйте Google Chrome или Safari.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;

      // Select speech lang based on active i18n
      recognition.lang = language === "uz" ? "uz-UZ" : language === "en" ? "en-US" : "ru-RU";

      recognition.onstart = () => {
        setIsListening(true);
        setInterimText("");
      };

      recognition.onresult = (event: any) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInterimText(transcript);
        if (event.results[0].isFinal) {
          onTranscript(transcript);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const buttonText = {
    ru: isListening ? "Слушаю вас… Говорите фразу гида" : "🎙️ Голосовая проверка факта (Voice Check)",
    uz: isListening ? "Tinglamoqdaman… Gid aytgan so'zlarni ayting" : "🎙️ Ovozli fakt tekshiruvi (Voice Check)",
    en: isListening ? "Listening… Speak what the guide said" : "🎙️ Voice Fact-Check (Tap to Speak)",
  };

  const tipText = {
    ru: "Нажмите микрофон и надиктуйте 5–10 секунд того, что рассказал гид на экскурсии",
    uz: "Mikrofonni bosing va ekskursiyada gid aytgan gaplarni 5-10 soniya davomida ayting",
    en: "Tap the mic and speak for 5-10 seconds what the tour guide claimed on the spot",
  };

  return (
    <div className="bg-paper border border-majolica/30 rounded-2xl p-5 mb-6 shadow-xs">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all ${
              isListening
                ? "bg-brick text-paper animate-ping"
                : "bg-majolica text-paper shadow-md hover:scale-105"
            }`}
          >
            {isListening ? "⏹️" : "🎙️"}
          </div>
          <div>
            <h3 className="font-display text-base font-bold text-night">{buttonText[language]}</h3>
            <p className="text-xs text-night/70 font-light">{tipText[language]}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={startListening}
          disabled={isListening || isProcessing}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm shrink-0 ${
            isListening
              ? "bg-brick text-paper animate-pulse"
              : "bg-majolica hover:bg-majolica/90 text-paper hover:shadow-md"
          }`}
        >
          {isListening ? "Запись…" : "Включить микрофон"}
        </button>
      </div>

      {interimText && (
        <div className="mt-4 p-3 bg-white rounded-xl border border-majolica/20 text-sm text-night italic animate-fade-in">
          🗣️ &quot;{interimText}&quot;
        </div>
      )}
    </div>
  );
}
