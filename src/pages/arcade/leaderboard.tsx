import { Layout } from "@/components/Layout";
import { Trophy, Medal, Award, ArrowLeft } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import arcadeGames from "@/data/arcade-games.json";

interface LeaderboardEntry {
  rank: number;
  name: string;
  xp: number;
  isCurrentUser?: boolean;
}

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [currentUserRank, setCurrentUserRank] = useState<number | null>(null);
  const { rewardTiers } = arcadeGames;

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockData: LeaderboardEntry[] = [
      { rank: 1, name: "Ayush Kumar", xp: 980 },
      { rank: 2, name: "Rahul Verma", xp: 920 },
      { rank: 3, name: "Priya Sharma", xp: 870 },
      { rank: 4, name: "Sneha Reddy", xp: 850 },
      { rank: 5, name: "Karthik Iyer", xp: 820 },
      { rank: 6, name: "Ananya Singh", xp: 800 },
      { rank: 7, name: "Rohan Kapoor", xp: 760, isCurrentUser: true },
      { rank: 8, name: "Deepak Joshi", xp: 740 },
      { rank: 9, name: "Sanjana Mehta", xp: 720 },
      { rank: 10, name: "Amit Kumar", xp: 700 },
    ];

    setLeaderboard(mockData);
    const currentUser = mockData.find((entry) => entry.isCurrentUser);
    if (currentUser) {
      setCurrentUserRank(currentUser.rank);
    }
  }, []);

  const getMedalIcon = (rank: number) => {
    if (rank === 1) return <Medal className="w-6 h-6 medal-gold" />;
    if (rank === 2) return <Medal className="w-6 h-6 medal-silver" />;
    if (rank === 3) return <Medal className="w-6 h-6 medal-bronze" />;
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
              <button className="glass-button flex items-center gap-2 mb-6">
                <ArrowLeft className="w-4 h-4" />
                Back to Arcade
              </button>
            </Link>

            <div className="text-center mb-8">
              <div className="text-5xl mb-4">🏆</div>
              <h1 className="arcade-title text-4xl font-bold mb-2 glow-text">
                LEADERBOARD
              </h1>
              <p className="text-lg" style={{ color: "#9AA3B2" }}>
                Top cybersecurity champions
              </p>
            </div>
          </div>

          {/* Current User Stats */}
          {currentUser && (
            <div className="glass-card p-6 mb-8">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <div className="text-sm mb-1" style={{ color: "#9AA3B2" }}>
                    Your Rank
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="arcade-mono text-3xl font-bold glow-text">
                      #{currentUser.rank}
                    </span>
                    <div>
                      <div className="font-semibold" style={{ color: "#F5F7FA" }}>
                        {currentUser.name}
                      </div>
                      <div className="arcade-mono text-sm" style={{ color: "#4AFFB0" }}>
                        {currentUser.xp} XP
                      </div>
                    </div>
                  </div>
                </div>

                {nextReward && (
                  <div className="flex-1 min-w-[200px]">
                    <div className="text-sm mb-2" style={{ color: "#9AA3B2" }}>
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
                    <div className="text-xs mt-1 text-right arcade-mono" style={{ color: "#9AA3B2" }}>
                      {nextReward.xp - currentUser.xp} XP to go
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Leaderboard List */}
          <div className="space-y-3">
            {leaderboard.map((entry) => (
              <div
                key={entry.rank}
                className={`leaderboard-row ${entry.isCurrentUser ? "current-user" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 flex items-center justify-center">
                      {getMedalIcon(entry.rank) || (
                        <span
                          className="arcade-mono text-lg font-bold"
                          style={{ color: "#9AA3B2" }}
                        >
                          #{entry.rank}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold"
                        style={{
                          background: "rgba(74, 255, 176, 0.15)",
                          color: "#4AFFB0",
                        }}
                      >
                        {entry.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold" style={{ color: "#F5F7FA" }}>
                          {entry.name}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="arcade-mono text-lg font-bold" style={{ color: "#4AFFB0" }}>
                    {entry.xp} XP
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Reward Tiers */}
          <div className="mt-12 glass-card p-6">
            <h3 className="arcade-title text-xl font-semibold mb-4 flex items-center gap-2">
              <Award className="w-5 h-5" style={{ color: "#4AFFB0" }} />
              Reward Tiers
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {rewardTiers.map((tier, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg" style={{ background: "rgba(255, 255, 176, 0.03)" }}>
                  <span className="text-sm" style={{ color: "#F5F7FA" }}>
                    {tier.reward}
                  </span>
                  <span className="arcade-mono text-sm font-bold" style={{ color: "#4AFFB0" }}>
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
