import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatBoxProps {
  messages: Message[];
  isLoading?: boolean;
}

const ChatBox = ({ messages, isLoading }: ChatBoxProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <ScrollArea className="h-full w-full" ref={scrollRef}>
      <div className="flex flex-col gap-4 p-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="rounded-full bg-primary/10 p-4 mb-4">
              <svg
                className="h-8 w-8 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <p className="text-muted-foreground">
              Mulai percakapan dengan Naya!
            </p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              Ketik pesan atau tekan tombol mikrofon
            </p>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`flex animate-slide-up ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="flex flex-col gap-1">
              <div
                className={
                  message.role === "user" ? "chat-bubble-user" : "chat-bubble-ai"
                }
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
              </div>
              <span
                className={`text-xs text-muted-foreground/60 ${
                  message.role === "user" ? "text-right" : "text-left"
                }`}
              >
                {formatTime(message.timestamp)}
              </span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start animate-fade-in">
            <div className="chat-bubble-ai">
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default ChatBox;
