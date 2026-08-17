import { Layout } from "@/components/Layout";
import { Trophy, Medal, Award, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import arcadeGames from "@/data/arcade-games.json";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";

interface LeaderboardEntry {
  rank: number;
  name: string;
  email: string;
  xp: number;
  isCurrentUser?: boolean;
}

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserRank, setCurrentUserRank] = useState<number | null>(null);
  const { rewardTiers } = arcadeGames;

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const arcadeUser = localStorage.getItem("arcadeUser");
      const currentUserEmail = arcadeUser ? JSON.parse(arcadeUser).email : null;

      const usersRef = collection(db, "arcade_users");
      const q = query(usersRef, orderBy("totalXp", "desc"), limit(10));
      const snapshot = await getDocs(q);

      const data: LeaderboardEntry[] = snapshot.docs.map((doc, index) => {
        const userData = doc.data();
        return {
          rank: index + 1,
          name: userData.name,
          email: userData.email,
          xp: userData.totalXp || 0,
          isCurrentUser: userData.email === currentUserEmail,
        };
      });

      setLeaderboard(data);
      const currentUser = data.find((entry) => entry.isCurrentUser);
      if (currentUser) {
        setCurrentUserRank(currentUser.rank);
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading leaderboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const getMedalIcon = (rank: number) => {
    if (rank === 1) return <Medal className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-orange-600" />;
    return null;
  };

  const getNextReward = (xp: number) => {
    const nextTier = rewardTiers.find((tier) => tier.xp > xp);
    return nextTier;
  };

  const currentUser = leaderboard.find((entry) => entry.isCurrentUser);
  const nextReward = currentUser ? getNextReward(currentUser.xp) : null;

  return (
    <Layout>
      <div className="arcade-container min-h-screen">
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link href="/arcade">
              <Button variant="outline" className="flex items-center gap-2 mb-6">
                <ArrowLeft className="w-4 h-4" />
                Back to Arcade
              </Button>
            </Link>

            <div className="text-center mb-8">
              <Trophy className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h1 className="text-4xl font-bold mb-2">
                LEADERBOARD
              </h1>
              <p className="text-lg text-muted-foreground">
                Top cybersecurity champions
              </p>
            </div>
          </div>

          {/* Current User Stats */}
          {currentUser && (
            <div className="glass-card p-6 mb-8 border-2 border-primary">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <div className="text-sm mb-1 text-muted-foreground">
                    Your Rank
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold">
                      #{currentUser.rank}
                    </span>
                    <div>
                      <div className="font-semibold">
                        {currentUser.name}
                      </div>
                      <div className="text-sm text-primary font-mono">
                        {currentUser.xp} XP
                      </div>
                    </div>
                  </div>
                </div>

                {nextReward && (
                  <div className="flex-1 min-w-[200px]">
                    <div className="text-sm mb-2 text-muted-foreground">
                      Next Reward: {nextReward.reward}
                    </div>
                    <div className="glass-progress-track">
                      <div
                        className="glass-progress-fill"
                        style={{
                          width: `${(currentUser.xp / nextReward.xp) * 100}%`,
                        }}
                      />
                    </div>
                    <div className="text-xs mt-1 text-right font-mono text-muted-foreground">
                      {nextReward.xp - currentUser.xp} XP to go
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Leaderboard List */}
          {leaderboard.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg text-muted-foreground">
                No players yet. Be the first to play!
              </p>
              <Link href="/arcade">
                <Button className="mt-4">Start Playing</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {leaderboard.map((entry) => (
                <div
                  key={entry.rank}
                  className={`leaderboard-row ${entry.isCurrentUser ? "current-user border-2 border-primary" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 flex items-center justify-center">
                        {getMedalIcon(entry.rank) || (
                          <span
                            className="font-mono text-lg font-bold text-muted-foreground"
                          >
                            #{entry.rank}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold bg-primary/10 text-primary"
                        >
                          {entry.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold">
                            {entry.name}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="font-mono text-lg font-bold text-primary">
                      {entry.xp} XP
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Reward Tiers */}
          <div className="mt-12 glass-card p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              Reward Tiers
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {rewardTiers.map((tier, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span className="text-sm">
                    {tier.reward}
                  </span>
                  <span className="font-mono text-sm font-bold text-primary">
                    {tier.xp} XP
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
