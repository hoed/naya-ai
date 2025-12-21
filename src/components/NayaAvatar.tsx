import { useEffect, useState } from "react";

export type AvatarState = "idle" | "listening" | "talking";

interface NayaAvatarProps {
  state: AvatarState;
}

const NayaAvatar = ({ state }: NayaAvatarProps) => {
  const [eyeBlink, setEyeBlink] = useState(false);

  // Eye blink animation
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setEyeBlink(true);
      setTimeout(() => setEyeBlink(false), 150);
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, []);

  const getStateClass = () => {
    switch (state) {
      case "listening":
        return "naya-avatar-listening";
      case "talking":
        return "naya-avatar-talking";
      default:
        return "naya-avatar-idle";
    }
  };

  const getMouthPath = () => {
    switch (state) {
      case "talking":
        // Animated mouth shapes for talking
        return "M 85 140 Q 100 155 115 140";
      case "listening":
        return "M 85 140 Q 100 145 115 140";
      default:
        return "M 85 140 Q 100 148 115 140";
    }
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* Glow effect */}
      <div
        className={`absolute -inset-4 rounded-full blur-2xl transition-opacity duration-500 ${
          state === "listening" ? "opacity-60" : state === "talking" ? "opacity-80" : "opacity-30"
        }`}
        style={{
          background: "linear-gradient(135deg, hsl(174 72% 40% / 0.4), hsl(187 72% 50% / 0.3))",
        }}
      />

      {/* Avatar container */}
      <div
        className={`naya-avatar ${getStateClass()} relative z-10 flex h-48 w-48 items-center justify-center shadow-2xl md:h-64 md:w-64`}
      >
        {/* SVG Avatar */}
        <svg
          viewBox="0 0 200 200"
          className="h-full w-full"
          style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.1))" }}
        >
          {/* Background circle */}
          <defs>
            <linearGradient id="avatarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(174 72% 50%)" />
              <stop offset="100%" stopColor="hsl(187 72% 60%)" />
            </linearGradient>
            <linearGradient id="hairGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2D1B69" />
              <stop offset="100%" stopColor="#1a0f40" />
            </linearGradient>
            <linearGradient id="skinGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFE4D0" />
              <stop offset="100%" stopColor="#F5D5C0" />
            </linearGradient>
          </defs>

          {/* Hair back */}
          <ellipse cx="100" cy="95" rx="70" ry="75" fill="url(#hairGradient)" />

          {/* Face */}
          <ellipse cx="100" cy="105" rx="55" ry="60" fill="url(#skinGradient)" />

          {/* Hair front - bangs */}
          <path
            d="M 45 85 Q 55 50 100 45 Q 145 50 155 85 Q 150 70 130 65 Q 100 55 70 65 Q 50 70 45 85"
            fill="url(#hairGradient)"
          />

          {/* Hair sides */}
          <ellipse cx="40" cy="110" rx="18" ry="35" fill="url(#hairGradient)" />
          <ellipse cx="160" cy="110" rx="18" ry="35" fill="url(#hairGradient)" />

          {/* Eyebrows */}
          <path
            d="M 65 88 Q 78 84 85 88"
            stroke="#4A3728"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 115 88 Q 122 84 135 88"
            stroke="#4A3728"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />

          {/* Eyes */}
          <g className="transition-all duration-150">
            {/* Left eye */}
            <ellipse
              cx="75"
              cy="105"
              rx="12"
              ry={eyeBlink ? 1 : 10}
              fill="white"
              className="transition-all duration-100"
            />
            {!eyeBlink && (
              <>
                <circle cx="75" cy="105" r="6" fill="#2D1B69" />
                <circle cx="73" cy="103" r="2" fill="white" />
              </>
            )}

            {/* Right eye */}
            <ellipse
              cx="125"
              cy="105"
              rx="12"
              ry={eyeBlink ? 1 : 10}
              fill="white"
              className="transition-all duration-100"
            />
            {!eyeBlink && (
              <>
                <circle cx="125" cy="105" r="6" fill="#2D1B69" />
                <circle cx="123" cy="103" r="2" fill="white" />
              </>
            )}
          </g>

          {/* Blush */}
          <ellipse cx="60" cy="120" rx="10" ry="5" fill="#FFB5B5" opacity="0.4" />
          <ellipse cx="140" cy="120" rx="10" ry="5" fill="#FFB5B5" opacity="0.4" />

          {/* Nose */}
          <path
            d="M 100 110 L 100 122 Q 95 125 100 125 Q 105 125 100 125"
            stroke="#E5B5A0"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />

          {/* Mouth */}
          <path
            d={getMouthPath()}
            stroke="#E07070"
            strokeWidth="3"
            fill={state === "talking" ? "#FF9090" : "none"}
            strokeLinecap="round"
            className="transition-all duration-100"
          />

          {/* Earrings */}
          <circle cx="38" cy="115" r="4" fill="#FFD700" />
          <circle cx="162" cy="115" r="4" fill="#FFD700" />
        </svg>
      </div>

      {/* Status indicator */}
      <div className="mt-4 flex items-center gap-2">
        <div
          className={`h-3 w-3 rounded-full transition-all duration-300 ${
            state === "listening"
              ? "animate-pulse bg-red-500"
              : state === "talking"
                ? "animate-pulse bg-primary"
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
