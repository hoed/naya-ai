import { useEffect, useState } from "react";

export type AvatarState = "idle" | "listening" | "talking";

interface NayaAvatarProps {
  state: AvatarState;
}

const NayaAvatar = ({ state }: NayaAvatarProps) => {
  const getStateClass = () => {
    switch (state) {
      case "listening":
        return "naya-avatar-listening border-accent shadow-[0_0_30px_rgba(234,88,12,0.3)] scale-105";
      case "talking":
        return "naya-avatar-talking border-primary shadow-[0_0_40px_rgba(20,184,166,0.4)]";
      default:
        return "naya-avatar-idle border-white/20 shadow-xl";
    }
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* Background Pulsing Glow */}
      <div
        className={`absolute -inset-8 rounded-full blur-3xl transition-all duration-1000 ${
          state === "listening" ? "opacity-40 bg-accent" : 
          state === "talking" ? "opacity-50 bg-primary" : "opacity-20 bg-primary/30"
        }`}
      />
      
      {/* Animated Rings for Listening State */}
      {state === "listening" && (
        <>
          <div className="absolute inset-0 rounded-full border-2 border-accent/30 animate-ping" />
          <div className="absolute -inset-4 rounded-full border border-accent/20 animate-pulse delay-75" />
        </>
      )}

      {/* Avatar Container */}
      <div
        className={`relative z-10 h-64 w-64 md:h-80 md:w-80 overflow-hidden rounded-full border-4 transition-all duration-700 ease-in-out ${getStateClass()}`}
      >
        <img
          src="/images/aisa_avatar.png"
          alt="AISA Avatar"
          className={`h-full w-full object-cover transition-all duration-700 ${
            state === "talking" ? "scale-110 rotate-1" : 
            state === "listening" ? "scale-105 grayscale-[20%]" : "scale-100"
          }`}
        />

        {/* Dynamic Light Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none transition-opacity duration-1000 ${state !== "idle" ? "opacity-100" : "opacity-0"}`} />
      </div>

      {/* Elegant Status indicator */}
      <div className="mt-8 flex flex-col items-center gap-2">
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 shadow-sm">
          <div
            className={`h-2 w-2 rounded-full transition-all duration-500 ${
              state === "listening"
                ? "bg-accent shadow-[0_0_10px_rgba(234,88,12,0.8)]"
                : state === "talking"
                  ? "bg-primary shadow-[0_0_10px_rgba(20,184,166,0.8)]"
                  : "bg-white/40"
            }`}
          />
          <span className="text-xs font-medium tracking-widest uppercase text-foreground/80">
            {state === "idle" && "Standby"}
            {state === "listening" && "Listening"}
            {state === "talking" && "Speaking"}
          </span>
        </div>
        
        <p className="text-sm text-muted-foreground italic transition-all duration-500 animate-in fade-in slide-in-from-bottom-2">
          {state === "idle" && "Bagaimana saya bisa membantu hari ini?"}
          {state === "listening" && "Saya mendengarkan Anda..."}
          {state === "talking" && "Sidoarjo memiliki banyak pesona..."}
        </p>
      </div>
    </div>
  );
};

export default NayaAvatar;
