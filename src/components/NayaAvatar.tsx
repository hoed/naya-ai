import Lottie from "lottie-react";
import nayaIdle from "@/assets/lottie/naya-idle.json";
import nayaListening from "@/assets/lottie/naya-listening.json";
import nayaTalking from "@/assets/lottie/naya-talking.json";

export type AvatarState = "idle" | "listening" | "talking";

interface NayaAvatarProps {
  state: AvatarState;
}

const NayaAvatar = ({ state }: NayaAvatarProps) => {
  const getAnimationData = () => {
    switch (state) {
      case "listening":
        return nayaListening;
      case "talking":
        return nayaTalking;
      default:
        return nayaIdle;
    }
  };

  const getGlowClass = () => {
    switch (state) {
      case "listening":
        return "opacity-70 shadow-[0_0_60px_20px_hsl(0,70%,50%)]";
      case "talking":
        return "opacity-90 shadow-[0_0_80px_25px_hsl(var(--primary))]";
      default:
        return "opacity-40 shadow-[0_0_40px_15px_hsl(var(--primary))]";
    }
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* Animated glow effect */}
      <div
        className={`absolute -inset-8 rounded-full blur-2xl transition-all duration-500 ${getGlowClass()}`}
        style={{
          background: state === "listening" 
            ? "radial-gradient(circle, hsl(0 70% 50% / 0.4), transparent 70%)"
            : "radial-gradient(circle, hsl(var(--primary) / 0.4), transparent 70%)",
        }}
      />

      {/* Avatar container with Lottie animation */}
      <div
        className={`naya-avatar relative z-10 flex h-56 w-56 items-center justify-center md:h-72 md:w-72 transition-transform duration-300 ${
          state === "talking" ? "scale-105" : state === "listening" ? "scale-102" : ""
        }`}
      >
        <Lottie
          animationData={getAnimationData()}
          loop={true}
          autoplay={true}
          style={{ 
            width: "100%", 
            height: "100%",
            filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.15))"
          }}
        />
      </div>

      {/* Status indicator */}
      <div className="mt-6 flex items-center gap-2">
        <div
          className={`h-3 w-3 rounded-full transition-all duration-300 ${
            state === "listening"
              ? "animate-pulse bg-red-500 shadow-[0_0_12px_4px_rgba(239,68,68,0.5)]"
              : state === "talking"
                ? "animate-pulse bg-primary shadow-[0_0_12px_4px_hsl(var(--primary)/0.5)]"
                : "bg-primary/50"
          }`}
        />
        <span className="text-sm font-medium text-muted-foreground">
          {state === "idle" && "Siap membantu"}
          {state === "listening" && "Mendengarkan..."}
          {state === "talking" && "Berbicara..."}
        </span>
      </div>
    </div>
  );
};

export default NayaAvatar;