import { Layout } from "@/components/Layout";
import { GameCard } from "@/components/arcade/GameCard";
import { Trophy, ArrowRight } from "lucide-react";
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
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
            {/* Hero Content */}
            <div className="text-center max-w-3xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <Trophy className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">DevNest Arcade 2026</span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                DEVNEST ARCADE
              </h1>

              <p className="text-xl sm:text-2xl text-muted-foreground mb-2">
                Welcome back, <span className="text-primary font-semibold">{userName}</span>!
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                Test your cybersecurity skills and compete with others
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link href="/arcade/leaderboard">
                  <Button size="lg" variant="outline" className="group">
                    <Trophy className="w-5 h-5 mr-2" />
                    View Leaderboard
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Games Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {featuredGames.length > 0 && (
            <div className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Featured Challenges</h2>
                  <p className="text-muted-foreground">
                    Start with these popular security challenges
                  </p>
                </div>
              </div>

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
            <div className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold mb-2">More Challenges</h2>
                  <p className="text-muted-foreground">
                    Explore additional games to boost your skills
                  </p>
                </div>
              </div>

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

          {/* How to Play Section */}
          <div className="bg-card border rounded-2xl p-8 sm:p-12">
            <h3 className="text-2xl font-bold text-center mb-8">How to Play</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Trophy className="w-8 h-8 text-primary" />
                </div>
                <h4 className="font-semibold text-lg mb-2">Choose a Game</h4>
                <p className="text-sm text-muted-foreground">
                  Pick a challenge that matches your skill level and interests
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-lg mb-2">Earn XP</h4>
                <p className="text-sm text-muted-foreground">
                  Score points for correct answers and quick thinking
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-lg mb-2">Climb the Ranks</h4>
                <p className="text-sm text-muted-foreground">
                  Compete on the leaderboard and win exciting prizes
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
