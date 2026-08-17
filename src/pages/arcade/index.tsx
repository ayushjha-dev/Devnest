import { Layout } from "@/components/Layout";
import { GameCard } from "@/components/arcade/GameCard";
import { Trophy } from "lucide-react";
import Link from "next/link";
import React from "react";
import arcadeGames from "@/data/arcade-games.json";

export default function ArcadeLanding() {
  const { games } = arcadeGames;
  const featuredGames = games.filter((g) => g.featured).sort((a, b) => a.order - b.order);
  const otherGames = games.filter((g) => !g.featured).sort((a, b) => a.order - b.order);

  return (
    <Layout>
      <div className="arcade-container">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="arcade-title text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 glow-text">
              DEVNEST ARCADE
            </h1>
            <p className="text-xl sm:text-2xl mb-8" style={{ color: "#9AA3B2" }}>
              Think you can spot the hacker?
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/arcade/leaderboard">
                <button className="glass-button flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  View Leaderboard
                </button>
              </Link>
            </div>
          </div>

          {/* Featured Games */}
          {featuredGames.length > 0 && (
            <div className="mb-16">
              <h2 className="arcade-title text-2xl sm:text-3xl font-bold mb-8 glow-text-cyan">
                🎮 Featured Games
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredGames.map((game) => (
                  <GameCard
                    key={game.id}
                    id={game.id}
                    name={game.name}
                    icon={game.icon}
                    description={game.description}
                    difficulty={game.difficulty}
                    estimatedTime={game.estimatedTime}
                    featured={game.featured}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Other Games */}
          {otherGames.length > 0 && (
            <div>
              <h2 className="arcade-title text-2xl sm:text-3xl font-bold mb-8">
                More Challenges
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherGames.map((game) => (
                  <GameCard
                    key={game.id}
                    id={game.id}
                    name={game.name}
                    icon={game.icon}
                    description={game.description}
                    difficulty={game.difficulty}
                    estimatedTime={game.estimatedTime}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Info Section */}
          <div className="mt-16 glass-card p-8 text-center">
            <h3 className="arcade-title text-xl font-semibold mb-4">
              How to Play
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm" style={{ color: "#9AA3B2" }}>
              <div>
                <div className="text-3xl mb-2">🎯</div>
                <div className="font-semibold mb-1" style={{ color: "#F5F7FA" }}>
                  Choose a Game
                </div>
                <div>Pick a challenge that matches your skill level</div>
              </div>
              <div>
                <div className="text-3xl mb-2">⚡</div>
                <div className="font-semibold mb-1" style={{ color: "#F5F7FA" }}>
                  Earn XP
                </div>
                <div>Score points for correct answers and quick thinking</div>
              </div>
              <div>
                <div className="text-3xl mb-2">🏆</div>
                <div className="font-semibold mb-1" style={{ color: "#F5F7FA" }}>
                  Climb the Ranks
                </div>
                <div>Compete on the leaderboard for prizes</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
