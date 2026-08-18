import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { Trophy, Medal, User } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";

interface LeaderboardUser {
  id: string;
  name: string;
  email: string;
  totalXp: number;
}

export default function ArcadeRegister() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    setLoadingLeaderboard(true);
    try {
      const usersRef = collection(db, "arcade_users");
      const q = query(usersRef, orderBy("totalXp", "desc"), limit(10));
      const snapshot = await getDocs(q);

      const users: LeaderboardUser[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          email: data.email,
          totalXp: data.totalXp || 0,
        };
      });

      setLeaderboard(users);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setLoadingLeaderboard(false);
    }
  };

  const validateForm = () => {
    const newErrors: { name?: string; email?: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Register user in database
      const response = await fetch("/api/arcade/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Store complete user info in localStorage
        localStorage.setItem(
          "arcadeUser",
          JSON.stringify({
            userId: data.userId,
            name: formData.name,
            email: formData.email,
            registeredAt: new Date().toISOString(),
          })
        );

        console.log("Registration successful:", data);
        // Redirect to games page
        router.push("/arcade");
      } else {
        console.error("Registration failed:", data);
        alert(`Registration failed: ${data.message || "Unknown error"}`);
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration failed. Please check your internet connection and try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Registration Form */}
            <div className="glass-card p-8">
              <div className="text-center mb-8">
                <Trophy className="w-16 h-16 mx-auto mb-4 text-primary" />
                <h1 className="text-3xl font-bold mb-2">DevNest Arcade</h1>
                <p className="text-muted-foreground">
                  Enter your details to start playing
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Registering..." : "Start Playing"}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  See the Leaderboard
                </p>
              </form>
            </div>

            {/* Leaderboard */}
            <div className="glass-card p-8">
              <div className="flex items-center gap-3 mb-6">
                <Trophy className="w-8 h-8 text-primary" />
                <h2 className="text-2xl font-bold">Leaderboard</h2>
              </div>

              {loadingLeaderboard ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading leaderboard...</p>
                </div>
              ) : leaderboard.length === 0 ? (
                <div className="text-center py-12">
                  <Trophy className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-lg text-muted-foreground">
                    No players yet. Be the first!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {leaderboard.map((user, index) => {
                    const getRankIcon = () => {
                      if (index === 0) return "🥇";
                      if (index === 1) return "🥈";
                      if (index === 2) return "🥉";
                      return `#${index + 1}`;
                    };

                    return (
                      <div
                        key={user.id}
                        className={`flex items-center justify-between p-4 rounded-lg border ${
                          index < 3
                            ? "bg-primary/5 border-primary/20"
                            : "bg-muted/30 border-border"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-2xl font-bold w-12 text-center">
                            {getRankIcon()}
                          </div>
                          <div>
                            <div className="font-semibold">{user.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {user.email}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-xl text-primary">
                            {user.totalXp}
                          </div>
                          <div className="text-xs text-muted-foreground">XP</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="mt-6 text-center">
                <Link href="/arcade/leaderboard">
                  <Button variant="outline" className="w-full">
                    View Full Leaderboard
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
