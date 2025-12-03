import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function Index() {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [animateElements, setAnimateElements] = useState(false);

  useEffect(() => {
    setAnimateElements(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-secondary/5 rounded-full blur-3xl opacity-40" />
        <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-cyan-500/3 rounded-full blur-3xl opacity-20" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="py-4 md:py-8 px-4 sm:px-6 lg:px-8 border-b border-cyan-500/20">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/60 border-2 border-cyan-400">
                  <span className="text-primary-foreground font-bold text-lg md:text-2xl font-poppins">
                    K
                  </span>
                </div>
                <div>
                  <h1 className="text-xl md:text-3xl font-bold font-poppins text-cyan-400 neon-text">
                    KBC Quiz
                  </h1>
                  <p className="text-xs md:text-sm text-cyan-400/60">
                    Test Your Knowledge
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="max-w-3xl w-full text-center">
            {/* Large Circular KBC Wheel Logo */}
            <div className={cn(
              "mb-8 md:mb-16 transform transition-all duration-1000",
              animateElements ? "scale-100 opacity-100" : "scale-50 opacity-0"
            )}>
              <div className="flex justify-center relative">
                {/* Outer rotating ring */}
                <div className="absolute inset-0 animate-rotate-360 opacity-30">
                  <div className="absolute inset-0 border-4 border-transparent border-t-cyan-500 border-r-cyan-500 rounded-full" />
                </div>

                {/* Main wheel */}
                <div className="relative w-48 h-48 md:w-64 md:h-64">
                  {/* Outer glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-full blur-3xl animate-pulse-gold" />

                  {/* Main circle with gradient */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-700 p-1 shadow-2xl shadow-cyan-500/70">
                    {/* Inner white circle */}
                    <div className="absolute inset-1 rounded-full bg-card flex flex-col items-center justify-center">
                      {/* KBC Text */}
                      <div className="text-center">
                        <p className="text-xs md:text-sm font-bold text-cyan-400 tracking-widest mb-1">
                          KAUN BANEGA
                        </p>
                        <h2 className="text-3xl md:text-5xl font-bold font-poppins bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-1">
                          ₹
                        </h2>
                        <p className="text-xs md:text-sm font-bold text-cyan-400 tracking-widest">
                          CROREPATI
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Decorative corners */}
                  <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-cyan-500 rounded-tl-lg animate-neon-glow" />
                  <div className="absolute -top-4 -right-4 w-8 h-8 border-t-2 border-r-2 border-cyan-500 rounded-tr-lg animate-neon-glow" />
                  <div className="absolute -bottom-4 -left-4 w-8 h-8 border-b-2 border-l-2 border-cyan-500 rounded-bl-lg animate-neon-glow" />
                  <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-cyan-500 rounded-br-lg animate-neon-glow" />
                </div>
              </div>
            </div>

            {/* Main Text */}
            <div className={cn(
              "mb-8 md:mb-12 transform transition-all duration-700 delay-100",
              animateElements ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            )}>
              <h2 className="text-4xl md:text-6xl font-bold font-poppins text-foreground mb-4 leading-tight">
                Who Wants to Be a
                <span className="block text-cyan-400 neon-text mt-2">
                  Millionaire?
                </span>
              </h2>
              <p className="text-base md:text-lg text-cyan-400/70 max-w-lg mx-auto">
                Test your knowledge and climb the ladder of success. Answer questions across
                different difficulty levels, use lifelines, and score points!
              </p>
            </div>

            {/* Stats */}
            <div className={cn(
              "grid grid-cols-3 gap-4 mb-12 md:mb-16 transform transition-all duration-700 delay-200",
              animateElements ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            )}>
              <div className="bg-card/40 backdrop-blur-sm border border-cyan-500/50 rounded-xl p-4 md:p-6 hover:border-cyan-400 transition-all hover:shadow-lg hover:shadow-cyan-500/30">
                <div className="text-2xl md:text-3xl font-bold text-cyan-400 mb-1 font-poppins neon-text">
                  50+
                </div>
                <p className="text-xs md:text-sm text-cyan-400/70">
                  Questions
                </p>
              </div>
              <div className="bg-card/40 backdrop-blur-sm border border-cyan-500/50 rounded-xl p-4 md:p-6 hover:border-cyan-400 transition-all hover:shadow-lg hover:shadow-cyan-500/30">
                <div className="text-2xl md:text-3xl font-bold text-cyan-400 mb-1 font-poppins neon-text">
                  10
                </div>
                <p className="text-xs md:text-sm text-cyan-400/70">
                  Per Level
                </p>
              </div>
              <div className="bg-card/40 backdrop-blur-sm border border-cyan-500/50 rounded-xl p-4 md:p-6 hover:border-cyan-400 transition-all hover:shadow-lg hover:shadow-cyan-500/30">
                <div className="text-2xl md:text-3xl font-bold text-cyan-400 mb-1 font-poppins neon-text">
                  3️⃣
                </div>
                <p className="text-xs md:text-sm text-cyan-400/70">
                  Lifelines
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <div className={cn(
              "transform transition-all duration-700 delay-300",
              animateElements ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            )}>
              <button
                onClick={() => navigate("/quiz")}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={cn(
                  "relative px-8 md:px-14 py-4 md:py-5 rounded-xl font-bold text-lg md:text-xl",
                  "transition-all duration-300 transform",
                  "bg-gradient-to-r from-cyan-500 to-blue-600 text-primary-foreground",
                  "border-2 border-cyan-400",
                  "shadow-lg shadow-cyan-500/60",
                  "hover:shadow-2xl hover:shadow-cyan-500/80",
                  "neon-border-hover",
                  isHovered && "scale-110 -translate-y-1",
                  "active:scale-95 font-poppins"
                )}
              >
                Start Playing Now
                <span className="ml-2 inline-block transition-transform duration-300" style={{
                  transform: isHovered ? "translateX(8px)" : "translateX(0)"
                }}>
                  →
                </span>
              </button>

              <p className="text-sm text-cyan-400/60 mt-6 md:mt-8">
                No registration needed • 100% free • Amazing rewards! 🎁
              </p>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-cyan-500/20 py-6 md:py-8 px-4 sm:px-6 lg:px-8 mt-auto">
          <div className="max-w-6xl mx-auto text-center text-sm text-cyan-400/50">
            <p>© 2024 KBC Quiz. Built with ❤️ for knowledge seekers.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
