import { useState } from "react";
import { cn } from "@/lib/utils";
import { HelpCircle, Users, Zap } from "lucide-react";

interface LifelinesProps {
  onLifelineUsed?: (type: "fifty-fifty" | "phone-friend" | "audience-poll") => void;
  usedLifelines?: Set<string>;
}

export function Lifelines({ onLifelineUsed, usedLifelines = new Set() }: LifelinesProps) {
  const [tooltipActive, setTooltipActive] = useState<string | null>(null);

  const lifelines = [
    {
      id: "fifty-fifty",
      label: "50-50",
      icon: Zap,
      description: "Remove 2 wrong options",
      color: "from-cyan-500 to-blue-500",
    },
    {
      id: "phone-friend",
      label: "Call",
      icon: Users,
      description: "Ask a friend",
      color: "from-purple-500 to-pink-500",
    },
    {
      id: "audience-poll",
      label: "Crowd",
      icon: HelpCircle,
      description: "Audience vote",
      color: "from-green-500 to-emerald-500",
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      {lifelines.map((lifeline) => {
        const Icon = lifeline.icon;
        const isUsed = usedLifelines.has(lifeline.id);

        return (
          <div key={lifeline.id} className="relative">
            <button
              onClick={() => !isUsed && onLifelineUsed?.(lifeline.id as any)}
              onMouseEnter={() => !isUsed && setTooltipActive(lifeline.id)}
              onMouseLeave={() => setTooltipActive(null)}
              disabled={isUsed}
              className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center",
                "transition-all duration-300 transform",
                "border-2 border-cyan-500",
                "shadow-lg",
                isUsed
                  ? "bg-muted/30 opacity-40 cursor-not-allowed"
                  : cn(
                      "bg-gradient-to-br",
                      lifeline.color,
                      "hover:shadow-xl hover:shadow-cyan-500/50",
                      "hover:scale-110 active:scale-95",
                      "animate-neon-glow"
                    )
              )}
            >
              <Icon className={cn("w-7 h-7", isUsed ? "text-muted" : "text-white")} />
            </button>

            {/* Tooltip */}
            {tooltipActive === lifeline.id && !isUsed && (
              <div className="absolute left-20 top-1/2 -translate-y-1/2 bg-card border-2 border-cyan-500 rounded-lg px-3 py-2 whitespace-nowrap text-xs font-semibold text-cyan-400 z-50 shadow-lg shadow-cyan-500/30 animate-slide-in-answer">
                {lifeline.description}
              </div>
            )}

            {/* Used indicator */}
            {isUsed && (
              <div className="absolute inset-0 rounded-full flex items-center justify-center bg-black/50">
                <span className="text-xs font-bold text-gray-400">✓</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
