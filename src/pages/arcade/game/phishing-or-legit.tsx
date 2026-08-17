import { Layout } from "@/components/Layout";
import { FeedbackToast } from "@/components/arcade/FeedbackToast";
import { ScoreCounter } from "@/components/arcade/ScoreCounter";
import { Timer } from "@/components/arcade/Timer";
import phishingData from "@/data/phishing-scenarios.json";
import { AlertTriangle, CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export default function PhishingOrLegitGame() {
  const router = useRouter();
  const [scenarios] = useState(phishingData.scenarios);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState<{
    type: "correct" | "wrong" | null;
    message: string;
  }>({ type: null, message: "" });
  const [gameOver, setGameOver] = useState(false);
  const [answeredCount, setAnsweredCount] = useState(0);

  const currentScenario = scenarios[currentIndex];

  const handleAnswer = (answer: "phishing" | "legit") => {
    const isCorrect = answer === currentScenario.answer;
    let points = 0;

    if (isCorrect) {
      points = 10;
      const newStreak = streak + 1;
      setStreak(newStreak);

      // Streak bonus
      if (newStreak % 3 === 0) {
        points += 5;
      }

      setScore((prev) => prev + points);
      setFeedback({
        type: "correct",
        message: currentScenario.reason,
      });
    } else {
      setStreak(0);
      setFeedback({
        type: "wrong",
        message: currentScenario.reason,
      });
    }

    const newAnsweredCount = answeredCount + 1;
    setAnsweredCount(newAnsweredCount);

    // Auto-advance after showing feedback
    setTimeout(() => {
      setFeedback({ type: null, message: "" });

      if (newAnsweredCount >= scenarios.length) {
        setGameOver(true);
      } else {
        setCurrentIndex((prev) => (prev + 1) % scenarios.length);
      }
    }, 2500);
  };

  const handleTimeUp = () => {
    setGameOver(true);
  };

  const renderContent = () => {
    if (currentScenario.type === "email") {
      return (
        <div className="space-y-3">
          <div className="glass-pill inline-block text-xs">
            From: {currentScenario.content.from}
          </div>
          <div className="text-lg font-semibold" style={{ color: "#F5F7FA" }}>
            {currentScenario.content.subject}
          </div>
          <div className="text-sm whitespace-pre-line" style={{ color: "#9AA3B2" }}>
            {currentScenario.content.body}
          </div>
        </div>
      );
    }

    if (currentScenario.type === "message") {
      return (
        <div className="space-y-3">
          <div className="glass-pill inline-block text-xs">
            From: {currentScenario.content.from}
          </div>
          <div className="text-sm whitespace-pre-line" style={{ color: "#F5F7FA" }}>
            {currentScenario.content.body}
          </div>
        </div>
      );
    }

    if (currentScenario.type === "login_page") {
      return (
        <div className="space-y-3">
          <div className="glass-pill inline-block text-xs">Login Page</div>
          <div className="text-sm" style={{ color: "#F5F7FA" }}>
            URL: <span className="arcade-mono">{currentScenario.content.url}</span>
          </div>
          <div className="text-sm" style={{ color: "#9AA3B2" }}>
            {currentScenario.content.visual}
          </div>
        </div>
      );
    }

    if (currentScenario.type === "qr_code") {
      return (
        <div className="space-y-3">
          <div className="glass-pill inline-block text-xs">QR Code</div>
          <div className="text-sm font-semibold" style={{ color: "#F5F7FA" }}>
            {currentScenario.content.context}
          </div>
          <div className="text-sm" style={{ color: "#9AA3B2" }}>
            Location: {currentScenario.content.location}
          </div>
        </div>
      );
    }

    return null;
  };

  if (gameOver) {
    return (
      <Layout>
        <div className="arcade-container min-h-screen flex items-center justify-center">
          <div className="relative z-10 max-w-2xl w-full mx-auto px-4">
            <div className="glass-card p-8 text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="arcade-title text-3xl font-bold mb-4 glow-text">
                Game Complete!
              </h2>

              <ScoreCounter score={score} label="Final Score" animate />

              <div className="mt-8 space-y-3">
                <div className="glass-pill inline-block">
                  Questions Answered: {answeredCount} / {scenarios.length}
                </div>
                <div className="glass-pill inline-block">
                  Best Streak: {Math.max(...Array.from({ length: answeredCount }, (_, i) => i % 3))}
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-4 justify-center">
                <button
                  className="glass-button"
                  onClick={() => router.reload()}
                >
                  Play Again
                </button>
                <Link href="/arcade/leaderboard">
                  <button className="glass-button">View Leaderboard</button>
                </Link>
                <Link href="/arcade">
                  <button className="glass-button">Back to Arcade</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="arcade-container min-h-screen">
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link href="/arcade">
              <button className="glass-button flex items-center gap-2 mb-4">
                <ArrowLeft className="w-4 h-4" />
                Back to Arcade
              </button>
            </Link>

            <h1 className="arcade-title text-3xl font-bold mb-6 glow-text">
              🎣 Phishing or Legit?
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Timer duration={120} onComplete={handleTimeUp} />
              <ScoreCounter score={score} />
              <div className="glass-card p-4 text-center">
                <div className="text-sm mb-1" style={{ color: "#9AA3B2" }}>
                  Progress
                </div>
                <div className="arcade-mono text-2xl font-bold" style={{ color: "#F5F7FA" }}>
                  {answeredCount + 1} / {scenarios.length}
                </div>
              </div>
            </div>

            {streak >= 3 && (
              <div className="mt-4 text-center">
                <div className="glass-pill inline-block animate-pulse-glow">
                  🔥 {streak} Streak!
                </div>
              </div>
            )}
          </div>

          {/* Scenario Card */}
          <div className="glass-card p-8 mb-6">
            {renderContent()}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleAnswer("phishing")}
              className="glass-card p-6 cursor-pointer hover:scale-105 transition-transform"
              style={{
                borderColor: "rgba(255, 107, 129, 0.3)",
                background: "rgba(255, 107, 129, 0.05)",
              }}
              disabled={feedback.type !== null}
            >
              <div className="flex flex-col items-center gap-3">
                <AlertTriangle className="w-12 h-12" style={{ color: "#FF6B81" }} />
                <span className="arcade-title text-xl font-bold" style={{ color: "#FF6B81" }}>
                  🚩 PHISHING
                </span>
              </div>
            </button>

            <button
              onClick={() => handleAnswer("legit")}
              className="glass-card p-6 cursor-pointer hover:scale-105 transition-transform"
              style={{
                borderColor: "rgba(74, 255, 176, 0.3)",
                background: "rgba(74, 255, 176, 0.05)",
              }}
              disabled={feedback.type !== null}
            >
              <div className="flex flex-col items-center gap-3">
                <CheckCircle className="w-12 h-12" style={{ color: "#4AFFB0" }} />
                <span className="arcade-title text-xl font-bold" style={{ color: "#4AFFB0" }}>
                  ✅ LEGIT
                </span>
              </div>
            </button>
          </div>
        </div>

        <FeedbackToast
          type={feedback.type}
          message={feedback.message}
          onClose={() => setFeedback({ type: null, message: "" })}
        />
      </div>
    </Layout>
  );
}
