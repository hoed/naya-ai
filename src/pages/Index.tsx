import { useState, useEffect } from "react";
import NayaAvatar, { AvatarState } from "@/components/NayaAvatar";
import ChatBox from "@/components/ChatBox";
import VoiceControl from "@/components/VoiceControl";
import { useNayaChat } from "@/hooks/useNayaChat";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

const Index = () => {
  const [avatarState, setAvatarState] = useState<AvatarState>("idle");
  const {
    messages,
    isLoading,
    isListening,
    sendMessage,
    startConversation,
    stopConversation,
    clearMessages
  } = useNayaChat();

  // Update avatar state based on listening/processing
  useEffect(() => {
    if (isListening) {
      setAvatarState("listening");
    } else if (isLoading) {
      setAvatarState("talking"); // AI is processing/speaking
    } else {
      setAvatarState("idle");
    }
  }, [isListening, isLoading]);

  const handleListeningChange = (active: boolean) => {
    if (active) {
      startConversation();
    } else {
      stopConversation();
    }
  };

  const handleSendMessage = async (text: string) => {
    try {
      await sendMessage(text);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleClearChat = () => {
    stopConversation();
    clearMessages();
    setAvatarState("idle");
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <header className="flex-none border-b border-border/50 bg-background/80 backdrop-blur-xl z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
              <span className="text-lg font-bold text-primary-foreground">A</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">AISA</h1>
              <p className="text-xs text-muted-foreground">AI Tourist Assistant Sidoarjo</p>
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
      <main className="flex-1 flex flex-col container mx-auto px-4 overflow-hidden">
        {/* Avatar Section - Compact for better visibility */}
        <div className="flex-none flex flex-col items-center justify-center py-4">
          <NayaAvatar state={avatarState} />
        </div>

        {/* Chat Section - Flexible but contained */}
        <div className="flex-1 flex flex-col min-h-0 mb-4 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <ChatBox messages={messages} isLoading={isLoading} />
          </div>

          {/* Voice & Text Control */}
          <div className="flex-none border-t border-border/50 bg-card/80 backdrop-blur-sm p-4">
            <VoiceControl
              onSendMessage={handleSendMessage}
              onListeningChange={handleListeningChange}
              isProcessing={isLoading}
              externalIsListening={isListening}
            />
          </div>
        </div>
      </main>

      {/* Footer - Subtle */}
      <footer className="flex-none pb-2 text-center">
        <p className="text-[10px] text-muted-foreground">
          Didukung oleh ElevenLabs & Gemini • Dinas Pariwisata Sidoarjo
        </p>
      </footer>
    </div>
  );
};

export default Index;


