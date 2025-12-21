import { useState, useEffect } from "react";
import NayaAvatar, { AvatarState } from "@/components/NayaAvatar";
import ChatBox from "@/components/ChatBox";
import VoiceControl from "@/components/VoiceControl";
import { useNayaChat } from "@/hooks/useNayaChat";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

const Index = () => {
  const [avatarState, setAvatarState] = useState<AvatarState>("idle");
  const { messages, isLoading, sendMessage, clearMessages } = useNayaChat();
  const { speak, isSpeaking, stop } = useSpeechSynthesis();

  // Update avatar state based on speaking
  useEffect(() => {
    if (isSpeaking) {
      setAvatarState("talking");
    } else if (avatarState === "talking") {
      setAvatarState("idle");
    }
  }, [isSpeaking, avatarState]);

  const handleListeningChange = (isListening: boolean) => {
    if (isListening) {
      stop(); // Stop any ongoing speech when listening
      setAvatarState("listening");
    } else if (avatarState === "listening") {
      setAvatarState("idle");
    }
  };

  const handleSendMessage = async (text: string) => {
    try {
      const response = await sendMessage(text);
      // Speak the response
      if (response) {
        speak(response);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleClearChat = () => {
    stop();
    clearMessages();
    setAvatarState("idle");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
              <span className="text-lg font-bold text-primary-foreground">N</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">Naya</h1>
              <p className="text-xs text-muted-foreground">Customer Service AI</p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearChat}
            className="text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Mulai Ulang
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto flex min-h-screen flex-col px-4 pt-20 pb-4">
        {/* Avatar Section */}
        <div className="flex flex-col items-center justify-center py-6 md:py-8">
          <NayaAvatar state={avatarState} />
        </div>

        {/* Chat Section */}
        <div className="flex-1 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden flex flex-col min-h-[300px] md:min-h-[400px]">
          <div className="flex-1 overflow-hidden">
            <ChatBox messages={messages} isLoading={isLoading} />
          </div>

          {/* Voice Control */}
          <div className="border-t border-border/50 bg-card/80 backdrop-blur-sm p-4">
            <VoiceControl
              onSendMessage={handleSendMessage}
              onListeningChange={handleListeningChange}
              isProcessing={isLoading}
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-4 text-center">
          <p className="text-xs text-muted-foreground">
            Didukung oleh AI • Bahasa Indonesia
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
