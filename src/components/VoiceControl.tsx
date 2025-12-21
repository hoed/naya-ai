import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, MicOff, Send, Volume2, VolumeX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VoiceControlProps {
  onSendMessage: (message: string) => void;
  onListeningChange: (isListening: boolean) => void;
  isProcessing?: boolean;
  externalIsListening?: boolean;
}

const VoiceControl = ({
  onSendMessage,
  onListeningChange,
  isProcessing,
  externalIsListening = false,
}: VoiceControlProps) => {
  const [inputText, setInputText] = useState("");
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);
  const { toast } = useToast();

  const isListening = externalIsListening;

  const toggleListening = () => {
    if (isListening) {
      onListeningChange(false);
    } else {
      onListeningChange(true);
      toast({
        title: "Menghubungkan...",
        description: "Menghubungkan ke agen AISA",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && !isProcessing) {
      onSendMessage(inputText.trim());
      setInputText("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="w-full space-y-3">
      {/* Voice toggle */}
      <div className="flex justify-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsSpeechEnabled(!isSpeechEnabled)}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          {isSpeechEnabled ? (
            <>
              <Volume2 className="mr-1 h-3 w-3" />
              Suara Aktif
            </>
          ) : (
            <>
              <VolumeX className="mr-1 h-3 w-3" />
              Suara Nonaktif
            </>
          )}
        </Button>
      </div>

      {/* Input area */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isListening ? "Agen sedang mendengarkan..." : "Ketik pesan..."}
            disabled={isProcessing}
            className="pr-12 h-12 rounded-full border-2 border-border/50 bg-card/80 backdrop-blur-sm focus:border-primary transition-all"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!inputText.trim() || isProcessing}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-primary hover:bg-primary/90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {/* Mic button */}
        <Button
          type="button"
          onClick={toggleListening}
          disabled={isProcessing}
          className={`mic-button h-12 w-12 ${isListening ? "active bg-destructive hover:bg-destructive/90" : ""}`}
        >
          {isListening ? (
            <MicOff className="h-5 w-5 text-primary-foreground" />
          ) : (
            <Mic className="h-5 w-5 text-primary-foreground" />
          )}
        </Button>
      </form>

      {/* Listening indicator */}
      {isListening && (
        <div className="flex items-center justify-center gap-2 animate-fade-in">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-4 w-1 rounded-full bg-destructive animate-pulse"
                style={{
                  animationDelay: `${i * 100}ms`,
                  height: `${12 + Math.random() * 12}px`,
                }}
              />
            ))}
          </div>
          <span className="text-sm text-destructive font-medium">Agen AISA Aktif</span>
        </div>
      )}
    </div>
  );
};

export default VoiceControl;

