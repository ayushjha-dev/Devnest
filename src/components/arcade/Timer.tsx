import React, { useEffect, useState } from "react";

interface TimerProps {
  duration: number; // in seconds
  onComplete?: () => void;
  paused?: boolean;
}

export const Timer: React.FC<TimerProps> = ({ duration, onComplete, paused = false }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (paused || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onComplete?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, onComplete, paused]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const percentage = (timeLeft / duration) * 100;

  const getColor = () => {
    if (percentage > 50) return "#4AFFB0";
    if (percentage > 20) return "#5ED4FF";
    return "#FF6B81";
  };

  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm" style={{ color: "#9AA3B2" }}>
          Time Remaining
        </span>
        <span
          className="arcade-mono text-lg font-bold"
          style={{ color: getColor() }}
        >
          {minutes}:{seconds.toString().padStart(2, "0")}
        </span>
      </div>
      <div className="glass-progress-track">
        <div
          className="glass-progress-fill"
          style={{
            width: `${percentage}%`,
            background: `linear-gradient(90deg, ${getColor()} 0%, ${getColor()}88 100%)`,
          }}
        />
      </div>
    </div>
  );
};
