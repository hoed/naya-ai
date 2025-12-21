import { useEffect, useState } from "react";

export type AvatarState = "idle" | "listening" | "talking";

interface NayaAvatarProps {
  state: AvatarState;
}

const NayaAvatar = ({ state }: NayaAvatarProps) => {
  const getStateClass = () => {
    switch (state) {
      case "listening":
        return "aisa-avatar-listening border-destructive";
      case "talking":
        return "aisa-avatar-talking border-primary";
      default:
        return "aisa-avatar-idle border-border/50";
    }
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* Glow effect */}
      <div
        className={`absolute -inset-4 rounded-full blur-2xl transition-opacity duration-500 ${state === "listening" ? "opacity-60" : state === "talking" ? "opacity-80" : "opacity-30"
          }`}
        style={{
          background: state === "listening"
            ? "linear-gradient(135deg, hsl(0 72% 40% / 0.4), hsl(0 72% 50% / 0.3))"
            : "linear-gradient(135deg, hsl(174 72% 40% / 0.4), hsl(187 72% 50% / 0.3))",
        }}
      />

      {/* Avatar Container */}
      <div
        className={`relative z-10 h-64 w-64 md:h-80 md:w-80 overflow-hidden rounded-full border-4 shadow-2xl transition-all duration-500 ${getStateClass()}`}
      >
        <img
          src="/images/aisa_avatar.png"
          alt="AISA Avatar"
          className={`h-full w-full object-cover transition-transform duration-500 ${state === "talking" ? "scale-105" : "scale-100"
            }`}
        />

        {/* State Overlay */}
        {state === "listening" && (
          <div className="absolute inset-0 bg-destructive/10 animate-pulse flex items-center justify-center">
            <div className="h-full w-full border-8 border-destructive/20 rounded-full animate-ping" />
          </div>
        )}
      </div>

      {/* Status indicator */}
      <div className="mt-6 flex items-center gap-2">
        <div
          className={`h-3 w-3 rounded-full transition-all duration-300 ${state === "listening"
              ? "animate-pulse bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"
              : state === "talking"
                ? "animate-pulse bg-primary shadow-[0_0_8px_rgba(20,184,166,0.8)]"
                : "bg-primary/50"
            }`}
        />
        <span className="text-sm font-semibold tracking-wide text-foreground animate-fade-in">
          {state === "idle" && "AISA Siap membantu"}
          {state === "listening" && "AISA Mendengarkan..."}
          {state === "talking" && "AISA Berbicara..."}
        </span>
      </div>
    </div>
  );
};

export default NayaAvatar;
