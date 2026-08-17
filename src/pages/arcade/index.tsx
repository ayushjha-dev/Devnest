import { Layout } from "@/components/Layout";
import { GameCard } from "@/components/arcade/GameCard";
import { Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import arcadeGames from "@/data/arcade-games.json";

export default function ArcadeLanding() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Check if user is registered
    const arcadeUser = localStorage.getItem("arcadeUser");
    if (!arcadeUser) {
      router.push("/arcade/register");
    } else {
      const user = JSON.parse(arcadeUser);
      setUserName(user.name);
      setIsChecking(false);
    }
  }, [router]);

  if (isChecking) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const { games } = arcadeGames;
  const featuredGames = games.filter((g) => g.featured).sort((a, b) => a.order - b.order);
  const otherGames = games.filter((g) => !g.featured).sort((a, b) => a.order - b.order);

  return (
    <Layout>
      <div className="arcade-container">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-4">
              DEVNEST ARCADE
            </h1>
            <p className="text-xl sm:text-2xl mb-2 text-muted-foreground">
              Welcome back, {userName}!
            </p>
            <p className="text-lg text-muted-foreground mb-8">
              Test your cybersecurity skills
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/arcade/leaderboard">
                <Button variant="outline" className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  View Leaderboard
                </Button>
              </Link>
            </div>
          </div>

          {/* Featured Games */}
          {featuredGames.length > 0 && (
            <div className="mb-16">
              <h2 className="text-2xl sm:text-3xl font-bold mb-8">
                Featured Games
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
              <h2 className="text-2xl sm:text-3xl font-bold mb-8">
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
            <h3 className="text-xl font-semibold mb-4">
              How to Play
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-muted-foreground">
              <div>
                <div className="text-3xl mb-2">
                  <Trophy className="w-8 h-8 mx-auto text-primary" />
                </div>
                <div className="font-semibold mb-1">
                  Choose a Game
                </div>
                <div>Pick a challenge that matches your skill level</div>
              </div>
              <div>
                <div className="text-3xl mb-2">
                  <Trophy className="w-8 h-8 mx-auto text-primary" />
                </div>
                <div className="font-semibold mb-1">
                  Earn XP
                </div>
                <div>Score points for correct answers and quick thinking</div>
              </div>
              <div>
                <div className="text-3xl mb-2">
                  <Trophy className="w-8 h-8 mx-auto text-primary" />
                </div>
                <div className="font-semibold mb-1">
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
