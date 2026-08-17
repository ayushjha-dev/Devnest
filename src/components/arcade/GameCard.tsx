import Link from "next/link";
import React from "react";

interface GameCardProps {
  id: string;
  name: string;
  icon: string;
  description: string;
  difficulty: number;
  estimatedTime: string;
  featured?: boolean;
}

export const GameCard: React.FC<GameCardProps> = ({
  id,
  name,
  icon,
  description,
  difficulty,
  estimatedTime,
  featured,
}) => {
  return (
    <Link href={`/arcade/game/${id}`}>
      <div className="glass-card p-6 cursor-pointer group relative">
        {featured && (
          <div className="absolute top-4 right-4">
            <span className="glass-pill text-xs" style={{ color: "#4AFFB0" }}>
              ⭐ Featured
            </span>
          </div>
        )}

        <div className="flex items-start gap-4 mb-4">
          <div className="game-icon">{icon}</div>
          <div className="flex-1">
            <h3 className="arcade-title text-xl mb-1">{name}</h3>
            <p className="text-sm" style={{ color: "#9AA3B2" }}>
              {description}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {[...Array(3)].map((_, i) => (
              <span
                key={i}
                className={i < difficulty ? "difficulty-star" : "difficulty-star-empty"}
              >
                ⭐
              </span>
            ))}
          </div>

          <span className="glass-pill text-xs">{estimatedTime}</span>
        </div>

        <div className="mt-4">
          <button className="glass-button w-full">Play Now</button>
        </div>
      </div>
    </Link>
  );
};
