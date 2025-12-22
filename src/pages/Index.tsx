import { useState, useEffect, useRef } from "react";
import NayaAvatar, { AvatarState } from "@/components/NayaAvatar";
import ChatBox from "@/components/ChatBox";
import VoiceControl from "@/components/VoiceControl";
import { useNayaChat } from "@/hooks/useNayaChat";
import { Button } from "@/components/ui/button";
import { RotateCcw, Volume2, VolumeX, Sparkles } from "lucide-react";

const Index = () => {
  const [avatarState, setAvatarState] = useState<AvatarState>("idle");
  const [hasStarted, setHasStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
      setAvatarState("talking");
    } else {
      setAvatarState("idle");
    }
  }, [isListening, isLoading]);

  const handleStart = () => {
    setHasStarted(true);
    if (audioRef.current) {
      audioRef.current.play().catch(err => console.log("Autoplay blocked:", err));
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

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
    <div className="relative h-screen flex flex-col bg-background text-foreground overflow-hidden selection:bg-primary/20">
      <audio ref={audioRef} src="/opening_sidoarjo.mp3" loop />

      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/10 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-primary/5 blur-[100px]" />

        {/* Particle effect */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/10 blur-sm animate-[float-particle_8s_infinite]"
            style={{
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 1.5}s`,
              animationDuration: `${10 + Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      {/* Start Overlay */}
      {!hasStarted && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-xl transition-all duration-1000">
          <div className="max-w-md w-full p-10 rounded-[2.5rem] bg-card/60 border border-white/20 shadow-[0_32px_128px_rgba(0,0,0,0.5)] text-center space-y-8 animate-in fade-in zoom-in-95 slide-in-from-bottom-10 duration-1000">
            <div className="relative mx-auto w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
              <Sparkles className="w-12 h-12" />
              <div className="absolute -inset-2 rounded-3xl bg-primary/20 blur-xl animate-pulse -z-10" />
            </div>

            <div className="space-y-4">
              <h2 className="text-4xl font-extrabold tracking-tighter text-gradient pb-1">Halo Sidoarjo!</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Siap menjelajahi keindahan Sidoarjo bersama <span className="text-foreground font-semibold">AISA</span>?
              </p>
            </div>

            <Button
              size="lg"
              onClick={handleStart}
              className="group relative w-full h-16 rounded-2xl text-xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_20px_40px_-12px_rgba(20,184,166,0.3)] hover:shadow-[0_20px_40px_-12px_rgba(20,184,166,0.5)] transition-all duration-300 active:scale-[0.98] overflow-hidden"
            >
              <span className="relative z-10">Mulai Petualangan</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </Button>

            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50 font-bold">
              Powered by Advanced AI Technology
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className={`relative flex-none border-b border-white/10 bg-background/40 backdrop-blur-2xl z-50 transition-all duration-500 ${!hasStarted ? 'opacity-0 -translate-y-4' : 'opacity-100 translate-y-0'}`}>
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 shadow-lg group-hover:scale-110 transition-transform">
              <span className="text-lg font-bold text-primary-foreground">A</span>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">AISA</h1>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Sidoarjo Tourism AI</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMute}
              className="rounded-full hover:bg-white/10"
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearChat}
              className="h-9 px-4 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/10 border border-transparent hover:border-white/10 transition-all"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Mulai Ulang
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={`relative flex-1 flex flex-col container mx-auto px-4 overflow-hidden z-10 transition-all duration-1000 delay-300 ${!hasStarted ? 'opacity-0' : 'opacity-100'}`}>
        {/* Avatar Section */}
        <div className="flex-none flex flex-col items-center justify-center py-6">
          <NayaAvatar state={avatarState} />
        </div>

        {/* Chat Section */}
        <div className="flex-1 flex flex-col min-h-0 mb-6 rounded-[2rem] border border-white/10 bg-card/30 backdrop-blur-xl shadow-2xl overflow-hidden transition-all duration-500 hover:border-white/20">
          <div className="flex-1 overflow-hidden">
            <ChatBox messages={messages} isLoading={isLoading} />
          </div>

          {/* Voice & Text Control */}
          <div className="flex-none border-t border-white/5 bg-white/5 backdrop-blur-md p-6">
            <VoiceControl
              onSendMessage={handleSendMessage}
              onListeningChange={handleListeningChange}
              isProcessing={isLoading}
              externalIsListening={isListening}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`relative flex-none pb-4 text-center transition-all duration-1000 delay-500 ${!hasStarted ? 'opacity-0' : 'opacity-100'}`}>
        <p className="text-[10px] text-muted-foreground font-medium flex items-center justify-center gap-1.5 opacity-60">
          <span>&copy; 2025</span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
          <span>Handcrafted with precision for Sidoarjo Tourism</span>
        </p>
      </footer>
    </div>
  );
};

export default Index;


