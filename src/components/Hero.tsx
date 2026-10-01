import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Zap,
  Users,
  Calendar,
  Layers,
  Sparkles,
  ArrowRight,
  Terminal,
  RefreshCw,
} from "lucide-react";
import TextType from "@/components/TextType";
import { useJoinModal } from "@/context/JoinModalContext";
import { GoogleCampusBadge } from "@/components/GoogleCampusBadge";

const HERO_QUOTES = [
  '"Build something that makes a difference."',
  '"Together, we build. Together, we innovate. Together, we are DevNest."',
  '"The future belongs to those who believe in the beauty of their dreams."',
  '"Innovation is the ability to see change as an opportunity, not a threat."',
  '"Learn by doing — we provide a platform to connect with the outer tech world."',
] as const;

export function Hero() {
  const { openJoinModal } = useJoinModal();
  const [counters, setCounters] = useState({
    members: 0,
    events: 0,
  });

  const [displayedQuote, setDisplayedQuote] = useState(
    '"Together, we build. Together, we innovate. Together, we are DevNest."',
  );
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const lastProgressRef = useRef(0);

  // Screen width detection throttled with requestAnimationFrame, only updates if breakpoint changes
  useEffect(() => {
    let resizeRaf: number | null = null;
    const updateWidth = () => {
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      resizeRaf = window.requestAnimationFrame(() => {
        const desktop = window.innerWidth >= 1024;
        setIsDesktop((prev) => (prev !== desktop ? desktop : prev));
      });
    };
    updateWidth();
    window.addEventListener("resize", updateWidth, { passive: true });
    return () => {
      window.removeEventListener("resize", updateWidth);
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
    };
  }, []);

  // Scroll position tracking for left/right parting animation
  // Throttled via requestAnimationFrame and short-circuited when beyond the 500px threshold
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const maxScroll = 500;
          const progress = Math.min(Math.max(scrollY / maxScroll, 0), 1);

          // Only trigger state update if progress change is noticeable or hits bounds (0 or 1)
          if (
            Math.abs(progress - lastProgressRef.current) > 0.005 ||
            (progress === 0 && lastProgressRef.current !== 0) ||
            (progress === 1 && lastProgressRef.current !== 1)
          ) {
            lastProgressRef.current = progress;
            setScrollProgress(progress);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Defer counter animation until after initial render
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const counterTargets = {
        members: 150,
        events: 3,
      };

      const duration = 1800;
      const steps = 50;
      let currentStep = 0;

      const interval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;

        setCounters({
          members: Math.floor(counterTargets.members * progress),
          events: Math.floor(counterTargets.events * progress),
        });

        if (currentStep >= steps) {
          clearInterval(interval);
          setCounters(counterTargets);
        }
      }, duration / steps);

      return () => clearInterval(interval);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, []);

  // Rotate quote
  const handleRotateQuote = () => {
    const nextIndex = (quoteIndex + 1) % HERO_QUOTES.length;
    setQuoteIndex(nextIndex);
    setDisplayedQuote(HERO_QUOTES[nextIndex]);
  };

  const shiftAmount = isDesktop ? 130 : 35;

  return (
    <div className="relative flex flex-col overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full overflow-x-clip">
        {/* Full Viewport First Fold */}
        <div className="min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-5rem)] flex items-center py-6 sm:py-8">
          {/* 2-Column Asymmetric Left-Aligned Grid with Parting Parallax */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center w-full">
            {/* Left Column (Content & CTAs) */}
            <div
              className="lg:col-span-7 flex flex-col items-start text-left transition-transform duration-75 ease-out"
              style={{
                transform: `translateX(-${scrollProgress * shiftAmount}px)`,
                opacity: Math.max(1 - scrollProgress * 0.4, 0.5),
                willChange: "transform, opacity",
              }}
            >
              {/* Top Brand Badge with Animated Circular Moving Color Lights Border */}
              <div className="mb-4 sm:mb-5">
                <GoogleCampusBadge size="md" />
              </div>

              {/* Display Headline */}
              <h1
                className="text-3xl sm:text-4xl lg:text-[50px] font-space font-black tracking-tight text-black leading-[1.12] mb-4 transition-all"
              >
                Where Student Developers Build{" "}
                <span className="bg-[#FFE600] text-black px-2.5 py-0.5 rounded-md border-2 border-black shadow-[3px_3px_0px_#000] inline-block -rotate-1">
                  The Future
                </span>
              </h1>

              {/* Subheading / Typing Line */}
              <div className="text-sm sm:text-base font-bold text-neutral-900 mb-3 min-h-[24px] font-mono">
                <TextType
                  text={[
                    "At DevNest, we don't just learn technology — we live it.",
                    "Build. Innovate. Transform.",
                    "Where student ideas become real-world products.",
                  ]}
                  typingSpeed={45}
                  pauseDuration={1400}
                  showCursor
                  cursorCharacter="|"
                  deletingSpeed={25}
                  cursorBlinkDuration={0.6}
                  className="text-black font-semibold"
                />
              </div>

              {/* Narrative Description */}
              <p className="text-xs sm:text-sm text-neutral-800 leading-relaxed max-w-lg mb-6 font-medium">
                A premier student-driven technical society at Lamrin Tech Skills University Punjab.
                Fostering hands-on engineering across Artificial Intelligence, Cybersecurity, Cloud
                Systems, and Fullstack Web &amp; Mobile Development.
              </p>

              {/* Left-Aligned CTA Button */}
              <div className="flex flex-wrap items-center gap-3 justify-start w-full sm:w-auto">
                <Button
                  asChild
                  size="default"
                  className="rounded-xl px-7 h-12 bg-[#FFE600] hover:bg-[#FFDE59] text-black font-black border-2 border-black shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none gap-2 text-sm transition-all duration-150 w-full sm:w-auto cursor-pointer group"
                >
                  <Link href="/events" className="flex items-center gap-2">
                    <span>Explore 2026 Events</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right Column (Neobrutalist Window Card) */}
            <div
              className="lg:col-span-5 transition-transform duration-75 ease-out"
              style={{
                transform: `translateX(${scrollProgress * shiftAmount}px)`,
                opacity: Math.max(1 - scrollProgress * 0.4, 0.5),
                willChange: "transform, opacity",
              }}
            >
              <div className="relative rounded-3xl border-3 border-black bg-white p-5 sm:p-6 shadow-[8px_8px_0px_#000] overflow-hidden">
                {/* Window Titlebar */}
                <div className="flex items-center justify-between pb-3.5 mb-4 border-b-2 border-black bg-[#FAF7EE] -mx-5 -mt-5 px-5 pt-3.5 sm:-mx-6 sm:-mt-6 sm:px-6 sm:pt-4">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-black inline-block" />
                    <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-black inline-block" />
                    <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-black inline-block" />
                    <span className="text-[11px] font-mono font-bold text-black ml-2">
                      ~/devnest/session
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-black bg-[#88EA73] px-2.5 py-0.5 rounded-full border-2 border-black shadow-[1px_1px_0px_#000]">
                    <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                    LIVE
                  </div>
                </div>

                {/* Terminal / Quote Display */}
                <div className="space-y-3.5">
                  <div className="rounded-2xl border-2 border-black bg-[#C4B5FD]/25 p-4 shadow-[2px_2px_0px_#000]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-black flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5 text-black" />
                        Club Philosophy
                      </span>
                      <button
                        onClick={handleRotateQuote}
                        className="p-1 rounded-md border border-black bg-white hover:bg-[#FFE600] text-black transition-colors"
                        title="Next Quote"
                      >
                        <RefreshCw className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-xs sm:text-sm italic text-black font-semibold leading-relaxed">
                      {displayedQuote}
                    </p>
                    <p className="text-[10px] font-bold text-neutral-600 uppercase tracking-wider mt-2.5">
                      — DevNest Tech Society
                    </p>
                  </div>

                  {/* Upcoming Event Highlight */}
                  <Link
                    href="/events/designathon"
                    className="flex items-center justify-between p-3 px-4 rounded-xl bg-[#FFE600] hover:bg-[#FFDE59] border-2 border-black shadow-[3px_3px_0px_#000] hover:shadow-[4px_4px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all group"
                  >
                    <span className="text-black text-xs font-bold flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-black" />
                      Upcoming Event
                    </span>
                    <span className="text-xs font-black text-black flex items-center gap-1.5">
                      Designathon 2026
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 High-Impact Neobrutalism Metrics Pop Cards */}
        <div className="pt-10 sm:pt-14 pb-8 sm:pb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {/* Card 1: Active Members (Yellow) */}
            <div className="rounded-2xl border-2 border-black bg-[#FFE600] p-4 sm:p-5 shadow-[5px_5px_0px_#000] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[7px_7px_0px_#000] transition-all duration-150 text-black">
              <div className="w-9 h-9 rounded-xl bg-white border-2 border-black text-black flex items-center justify-center mb-3 shadow-[2px_2px_0px_#000]">
                <Users className="w-4 h-4" />
              </div>
              <div className="text-2xl sm:text-3xl font-space font-black text-black tracking-tight mb-0.5">
                {counters.members}+
              </div>
              <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-black">
                Active Members
              </p>
            </div>

            {/* Card 2: Flagship Events (Sky Blue) */}
            <div className="rounded-2xl border-2 border-black bg-[#70D6FF] p-4 sm:p-5 shadow-[5px_5px_0px_#000] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[7px_7px_0px_#000] transition-all duration-150 text-black">
              <div className="w-9 h-9 rounded-xl bg-white border-2 border-black text-black flex items-center justify-center mb-3 shadow-[2px_2px_0px_#000]">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="text-2xl sm:text-3xl font-space font-black text-black tracking-tight mb-0.5">
                {counters.events}+
              </div>
              <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-black">
                Flagship Events
              </p>
            </div>

            {/* Card 3: Tech Domains (Retro Lavender) */}
            <div className="rounded-2xl border-2 border-black bg-[#C4B5FD] p-4 sm:p-5 shadow-[5px_5px_0px_#000] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[7px_7px_0px_#000] transition-all duration-150 text-black">
              <div className="w-9 h-9 rounded-xl bg-white border-2 border-black text-black flex items-center justify-center mb-3 shadow-[2px_2px_0px_#000]">
                <Layers className="w-4 h-4" />
              </div>
              <div className="text-2xl sm:text-3xl font-space font-black text-black tracking-tight mb-0.5">
                5
              </div>
              <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-black">
                Tech Domains
              </p>
            </div>

            {/* Card 4: Student Driven (Mint/Lime) */}
            <div className="rounded-2xl border-2 border-black bg-[#88EA73] p-4 sm:p-5 shadow-[5px_5px_0px_#000] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[7px_7px_0px_#000] transition-all duration-150 text-black">
              <div className="w-9 h-9 rounded-xl bg-white border-2 border-black text-black flex items-center justify-center mb-3 shadow-[2px_2px_0px_#000]">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="text-2xl sm:text-3xl font-space font-black text-black tracking-tight mb-0.5">
                100%
              </div>
              <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-black">
                Student Driven
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
