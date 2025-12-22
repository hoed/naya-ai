import { useState, useCallback, useEffect } from "react";
import { Message } from "@/components/ChatBox";
import { useConversation } from "@elevenlabs/react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { saveMessage, getHistory, clearHistory as dbClearHistory } from "@/lib/db";

const AGENT_ID = import.meta.env.VITE_ELEVENLABS_AGENT_ID;
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const SIDOARJO_TOURISM_PROMPT = `Kamu adalah AISA, asisten virtual resmi dari Pemerintah Kabupaten Sidoarjo. 

TUGAS ANDA:
- Memberikan informasi lengkap tentang objek wisata di Sidoarjo (seperti Lumpur Lapindo sebagai wisata edukasi, Candi Pari, Candi Sumur, Pulau Lusi, Kerajinan Tas Tanggulangin, Batik Jetis, dan kuliner khas seperti Kupang Lontong).
- Menjelaskan agenda pariwisata dan budaya di Sidoarjo.
- Melayani pertanyaan wisatawan dengan ramah, sopan, dan informatif menggunakan Bahasa Indonesia yang baik atau dialek lokal yang sopan jika diperlukan.
- Selalu mempromosikan keindahan dan keramahan Sidoarjo.
- Menjelaskan layanan setiap dinas di Kabupaten Sidoarjo
- Menjelaskan alur pengurusan dokumen (KTP, KK, Akta, dll)
- Menjelaskan tugas dan fungsi setiap dinas
- Mengarahkan masyarakat ke bagian atau sekretariat terkait
- Membantu membuat permohonan atau pengajuan resmi

Jika masyarakat ingin bertemu pejabat:
- Jelaskan prosedur resmi, hubungkan dengan no telp setiap kantor dinas
- Arahkan ke sekretariat atau sistem pengajuan
- Gunakan bahasa sopan, netral, dan administratif

KEPRIBADIAN:
- Ramah, hangat, dan sangat mengenal kota Sidoarjo.
- Profesional namun tetap akrab.
- Sesuai etika pelayanan publik.

Jika ditanya hal di luar pariwisata Sidoarjo, arahkan kembali dengan sopan ke topik pariwisata Sidoarjo.`;

interface UseNayaChatReturn {
  messages: Message[];
  isLoading: boolean;
  isListening: boolean;
  sendMessage: (text: string) => Promise<string>;
  startConversation: () => Promise<void>;
  stopConversation: () => Promise<void>;
  clearMessages: () => void;
}

export const useNayaChat = (): UseNayaChatReturn => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize Gemini
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || "");

  // Voice Conversation (ElevenLabs)
  const conversation = useConversation({
    onMessage: (message) => {
      console.log("ElevenLabs Message:", message);
      if (message.source === "ai" || message.source === "user") {
        const newMessage: Message = {
          id: `el-${Date.now()}-${Math.random()}`,
          role: message.source === "ai" ? "assistant" : "user",
          content: message.message,
          timestamp: new Date(),
        };

        setMessages((prev) => {
          // Check for duplication with recent Gemini/UI manual messages
          const isDuplicate = prev.some(m =>
            m.content === newMessage.content &&
            m.role === newMessage.role &&
            (Math.abs(Date.now() - m.timestamp.getTime()) < 3000)
          );
          if (isDuplicate) return prev;
          return [...prev, newMessage];
        });

        saveMessage(newMessage.role, newMessage.content).catch(console.error);
      }
    },
    onError: (error) => {
      console.error("ElevenLabs Error:", error);
      setIsLoading(false);
    },
    onConnect: () => {
      console.log("Connected to ElevenLabs");
      setIsLoading(false);
    },
    onDisconnect: () => {
      console.log("Disconnected from ElevenLabs");
      setIsLoading(false);
    },
  });

  // Load history from Neon DB on mount
  useEffect(() => {
    const loadHistory = async () => {
      const history = await getHistory();
      if (history && history.length > 0) {
        setMessages(history.map((h: any) => ({
          id: `hist-${h.id}`,
          role: h.role,
          content: h.content,
          timestamp: new Date(h.created_at)
        })));
      }
    };
    loadHistory();
  }, []);

  const startConversation = useCallback(async () => {
    setIsLoading(true);
    try {
      await conversation.startSession({
        agentId: AGENT_ID,
        // @ts-ignore
        options: {
          overrides: {
            agent: {
              prompt: {
                prompt: SIDOARJO_TOURISM_PROMPT,
              },
            },
          },
        }
      });
    } catch (error) {
      console.error("Failed to start ElevenLabs session:", error);
      setIsLoading(false);
    }
  }, [conversation]);

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  // Chat Conversation (Gemini)
  const sendMessage = useCallback(async (text: string): Promise<string> => {
    if (!text.trim()) return "";

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    saveMessage("user", text).catch(console.error);

    try {
      if (!GEMINI_API_KEY) {
        throw new Error("Gemini API Key missing");
      }

      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        systemInstruction: SIDOARJO_TOURISM_PROMPT,
      });



      // Prepare history for Gemini
      const chatHistory = messages.map(m => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      }));

      const chat = model.startChat({
        history: chatHistory,
      });

      const assistantId = `assistant-${Date.now()}`;
      setMessages((prev) => [
        ...prev,
        {
          id: assistantId,
          role: "assistant",
          content: "",
          timestamp: new Date(),
        },
      ]);

      const result = await chat.sendMessageStream(text);
      let assistantContent = "";

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        assistantContent += chunkText;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: assistantContent } : m
          )
        );
      }

      saveMessage("assistant", assistantContent).catch(console.error);
      return assistantContent;
    } catch (error: any) {
      console.error("Gemini Chat Error:", error);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content: `Maaf, terjadi kesalahan saat memproses chat (${error.message}).`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev.filter(m => m.content !== ""), errorMessage]);
      return "";
    } finally {
      setIsLoading(false);
    }
  }, [messages, genAI]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    dbClearHistory();
  }, []);

  return {
    messages,
    isLoading: isLoading || conversation.status === "connecting",
    isListening: conversation.status === "connected",
    sendMessage,
    startConversation,
    stopConversation,
    clearMessages
  };
};
