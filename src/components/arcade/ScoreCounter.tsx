import React, { useEffect, useState } from "react";

interface ScoreCounterProps {
  score: number;
  label?: string;
  animate?: boolean;
}

export const ScoreCounter: React.FC<ScoreCounterProps> = ({
  score,
  label = "Score",
  animate = false,
}) => {
  const [displayScore, setDisplayScore] = useState(animate ? 0 : score);

  useEffect(() => {
    if (!animate) {
      setDisplayScore(score);
      return;
    }

    const duration = 1000; // 1 second
    const steps = 30;
    const increment = score / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        setDisplayScore(score);
        clearInterval(interval);
      } else {
        setDisplayScore(Math.floor(increment * currentStep));
      }
    }, duration / steps);

    return () => clearInterval(interval);
  }, [score, animate]);

  return (
    <div className="glass-card p-4 text-center">
      <div className="text-sm mb-1" style={{ color: "#9AA3B2" }}>
        {label}
      </div>
      <div
        className="arcade-mono text-3xl font-bold glow-text animate-count-up"
        key={score}
      >
        {displayScore}
        <span className="text-lg ml-1" style={{ color: "#4AFFB0" }}>
          XP
        </span>
      </div>
    </div>
  );
};
