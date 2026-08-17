import Link from "next/link";
import React from "react";
import { Star } from "lucide-react";

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
      <div className="glass-card p-6 cursor-pointer group relative hover:border-primary transition-all">
        {featured && (
          <div className="absolute top-4 right-4">
            <span className="glass-pill text-xs text-primary border border-primary">
              Featured
            </span>
          </div>
        )}

        <div className="flex items-start gap-4 mb-4">
          <div className="text-4xl">{icon}</div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-1">{name}</h3>
            <p className="text-sm text-muted-foreground">
              {description}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            {[...Array(3)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < difficulty ? "fill-primary text-primary" : "text-muted-foreground"}`}
              />
            ))}
          </div>

          <span className="glass-pill text-xs">{estimatedTime}</span>
        </div>

        <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
          Play Now
        </button>
      </div>
    </Link>
  );
};
