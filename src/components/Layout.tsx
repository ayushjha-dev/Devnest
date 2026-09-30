import { ReactNode, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Github,
  Linkedin,
  Instagram,
  Mail,
  ArrowUpRight,
  Sparkles,
  ChevronRight,
  Home,
  Calendar,
  Code,
  Zap,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useJoinModal } from "@/context/JoinModalContext";
import { GoogleCampusBadge } from "@/components/GoogleCampusBadge";
interface LayoutProps {
  children: ReactNode;
  pauseTerminal?: boolean;
  customTheme?: "blue-gold" | "violet" | "default";
  enableTerminal?: boolean;
}

export function Layout({
  children,
  pauseTerminal = false,
  customTheme = "default",
  enableTerminal = false,
}: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { openJoinModal } = useJoinModal();
  const router = useRouter();

  const navItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Events", href: "/events" },
    { label: "Blogs", href: "/blogs" },
    { label: "Team", href: "/team" },
    { label: "Hall of Fame", href: "/hall-of-fame" },
    { label: "Glyph", href: "/glyph" },
    { label: "Contact", href: "/contact" },
  ];

  const mobileBottomNav = [
    { label: "Home", href: "/", icon: Home },
    { label: "Events", href: "/events", icon: Calendar },
    { label: "Projects", href: "/projects", icon: Code },
    { label: "Blog", href: "/blogs", icon: BookOpen },
    { label: "Join", href: "/membership", icon: Zap, highlight: true },
  ];

  const isNavActive = (href: string) => {
    if (href === "/") return router.pathname === "/";
    return router.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-[#FAF7EE] text-black flex flex-col relative selection:bg-[#FFE600] selection:text-black">
      {/* Neobrutalism Architectural Dot Grid Background */}
      <div className="pointer-events-none fixed inset-0 z-0 neo-grid-bg opacity-70" aria-hidden="true" />

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full bg-[#FAF7EE] border-b-2 border-black shadow-[0_3px_0px_0px_#000] transition-colors">
        {/* Top Accent Solid Line */}
        <div className="h-[3px] w-full bg-[#FFE600] border-b border-black" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Brand Logo */}
            <Link
              href="/"
              className="flex items-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black rounded-xl"
            >
              <Image
                src="/devnest-logo.png"
                alt="Devnest — BUILD. LEARN. INNOVATE —"
                width={175}
                height={49}
                priority
                className="h-10 sm:h-12 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
              />
            </Link>

            {/* Desktop Segmented Navigation */}
            <nav className="hidden md:flex items-center gap-1 p-1 rounded-2xl bg-white border-2 border-black shadow-[3px_3px_0px_#000]">
              {navItems.map((item) => {
                const active = isNavActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative px-2.5 lg:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 whitespace-nowrap ${active
                        ? "bg-[#FFE600] text-black border-2 border-black shadow-[2px_2px_0px_#000]"
                        : "text-black hover:bg-[#FAF7EE] hover:border-2 hover:border-black hover:shadow-[2px_2px_0px_#000] border-2 border-transparent"
                      }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action */}
            <div className="flex items-center gap-2.5">
              <Button
                size="sm"
                onClick={openJoinModal}
                className="hidden sm:inline-flex gap-1.5 font-bold text-xs bg-[#FFE600] text-black border-2 border-black shadow-[3px_3px_0px_#000] hover:bg-[#FFDE59] hover:shadow-[5px_5px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
              >
                <span>Join Community</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Button>

              {/* Mobile hamburger toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2.5 rounded-xl border-2 border-black bg-[#FFE600] text-black shadow-[2px_2px_0px_#000] hover:shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all focus-visible:outline-none"
                aria-label="Toggle navigation menu"
                aria-expanded={isMenuOpen}
              >
                <div className="w-5 h-4 flex flex-col justify-between items-center relative">
                  <span
                    className={`h-0.5 bg-black rounded-full transition-all duration-200 ${isMenuOpen ? "w-5 rotate-45 translate-y-1.5" : "w-5"
                      }`}
                  />
                  <span
                    className={`h-0.5 bg-black rounded-full transition-all duration-200 ${isMenuOpen ? "opacity-0 scale-x-0" : "w-5"
                      }`}
                  />
                  <span
                    className={`h-0.5 bg-black rounded-full transition-all duration-200 ${isMenuOpen ? "w-5 -rotate-45 -translate-y-2" : "w-5"
                      }`}
                  />
                </div>
              </button>
            </div>
          </div>

          {/* Mobile Navigation Drawer */}
          {isMenuOpen && (
            <div className="md:hidden pb-6 pt-3 space-y-1.5 border-t-2 border-black bg-white rounded-2xl p-4 mt-2 shadow-[4px_4px_0px_#000] animate-in slide-in-from-top duration-200">
              {navItems.map((item) => {
                const active = isNavActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-150 ${active
                        ? "bg-[#FFE600] text-black border-2 border-black shadow-[2px_2px_0px_#000]"
                        : "text-black hover:bg-[#FAF7EE] border-2 border-transparent"
                      }`}
                  >
                    <span>{item.label}</span>
                    <ChevronRight
                      className={`w-4 h-4 transition-transform ${active ? "text-black translate-x-0.5" : "text-neutral-500"
                        }`}
                    />
                  </Link>
                );
              })}

              <div className="pt-2">
                <Button
                  onClick={() => {
                    setIsMenuOpen(false);
                    openJoinModal();
                  }}
                  className="w-full gap-2 py-3 rounded-xl font-bold bg-[#FFE600] text-black border-2 border-black shadow-[3px_3px_0px_#000]"
                >
                  <span>Join DevNest Community</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content Area with clearance for mobile bottom bar */}
      <main className="flex-grow relative z-10 pb-20 md:pb-0">{children}</main>

      {/* Neobrutalism Signature Footer */}
      <footer className="relative z-10 bg-[#FAF7EE] border-t-3 border-black text-black mt-24 shadow-[0_-4px_0px_#000]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-16">
            {/* Column 1: Brand Bio */}
            <div className="lg:col-span-2 space-y-4">
              <Link
                href="/"
                className="inline-flex items-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black rounded-xl"
              >
                <Image
                  src="/devnest-logo.png"
                  alt="Devnest — BUILD. LEARN. INNOVATE —"
                  width={175}
                  height={49}
                  className="h-10 sm:h-12 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
                />
              </Link>

              <p className="text-sm text-neutral-700 leading-relaxed max-w-sm font-medium">
                The premier technical club of Lamrin Tech Skills University Punjab. Fostering hands-on innovation, curiosity, and leadership across software, AI, cloud, and cybersecurity.
              </p>

              <div className="pt-1">
                <GoogleCampusBadge size="sm" />
              </div>
            </div>

            {/* Column 2: Navigation */}
            <div>
              <h3 className="font-space font-bold text-xs uppercase tracking-[0.15em] text-black mb-4">
                Explore
              </h3>
              <ul className="space-y-2.5 text-sm font-semibold">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-neutral-700 hover:text-black hover:underline transition-colors duration-150 inline-flex items-center gap-1 group"
                    >
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Community & Resources */}
            <div>
              <h3 className="font-space font-bold text-xs uppercase tracking-[0.15em] text-black mb-4">
                Community
              </h3>
              <ul className="space-y-2.5 text-sm font-semibold">
                <li>
                  <Link
                    href="/membership"
                    className="text-neutral-700 hover:text-black hover:underline transition-colors duration-150"
                  >
                    Membership Registration
                  </Link>
                </li>
                <li>
                  <Link
                    href="/events/schedule"
                    className="text-neutral-700 hover:text-black hover:underline transition-colors duration-150"
                  >
                    2026 Event Schedule
                  </Link>
                </li>
                <li>
                  <Link
                    href="/certificate-download"
                    className="text-neutral-700 hover:text-black hover:underline transition-colors duration-150"
                  >
                    Download Certificate
                  </Link>
                </li>
                <li>
                  <Link
                    href=""
                    className="text-neutral-700 hover:text-black hover:underline transition-colors duration-150"
                  >
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link
                    href="/hall-of-fame"
                    className="text-neutral-700 hover:text-black hover:underline transition-colors duration-150"
                  >
                    Hall of Fame
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Newsletter */}
            <div>
              <div className="p-5 rounded-2xl bg-white border-2 border-black shadow-[4px_4px_0px_#000]">
                <h3 className="font-space font-bold text-xs uppercase tracking-[0.15em] text-black mb-2">
                  Stay Updated
                </h3>
                <p className="text-xs text-neutral-600 mb-3 leading-relaxed font-medium">
                  Get notified about upcoming hackathons, workshops, and tech talks.
                </p>
                <div className="space-y-2.5">
                  <input
                    type="email"
                    placeholder="name@university.edu"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7EE] text-xs text-black placeholder:text-neutral-500 border-2 border-black shadow-[2px_2px_0px_#000] focus:outline-none focus:ring-2 focus:ring-black transition-all font-medium"
                  />
                  <Button
                    size="sm"
                    className="w-full bg-[#FFE600] hover:bg-[#FFDE59] text-black text-xs font-bold rounded-xl border-2 border-black shadow-[3px_3px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                    onClick={() => alert("Thank you for subscribing to DevNest updates!")}
                  >
                    Subscribe
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Sub-Footer Divider & Socials */}
          <div className="pt-8 border-t-2 border-black flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs font-semibold text-neutral-700 text-center sm:text-left">
              © 2026 DevNest • Lamrin Tech Skills University Punjab • All rights reserved.
            </p>

            <div className="flex items-center gap-3">
              <a
                href="https://github.com/devnest-tech"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border-2 border-black text-black shadow-[2px_2px_0px_#000] hover:bg-[#FFE600] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                aria-label="GitHub"
                title="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>

              <a
                href="https://www.linkedin.com/company/devnestclub"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border-2 border-black text-black shadow-[2px_2px_0px_#000] hover:bg-[#70D6FF] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                aria-label="LinkedIn"
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>

              <a
                href="https://www.instagram.com/devnest_tech_club/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border-2 border-black text-black shadow-[2px_2px_0px_#000] hover:bg-[#FF70A6] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                aria-label="Instagram"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>

              <a
                href="mailto:devnest.techclub@gmail.com"
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border-2 border-black text-black shadow-[2px_2px_0px_#000] hover:bg-[#88EA73] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                aria-label="Email"
                title="Email DevNest"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Ergonomic Thumb-Friendly Mobile Bottom Navigation Dock */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#FAF7EE] border-t-2 border-black pb-safe shadow-[0_-3px_0px_#000] transition-all duration-200"
      >
        <div className="grid grid-cols-5 items-center h-16 px-2">
          {mobileBottomNav.map((item) => {
            const active =
              item.href === "/"
                ? router.pathname === "/"
                : router.pathname.startsWith(item.href) ||
                (item.href === "/blogs" && router.pathname.startsWith("/blog"));
            const Icon = item.icon;

            if (item.highlight) {
              return (
                <button
                  key={item.href}
                  type="button"
                  onClick={openJoinModal}
                  className="flex flex-col items-center justify-center -mt-3.5 group focus:outline-none"
                  aria-label="Join DevNest Community"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#FFE600] text-black border-2 border-black flex items-center justify-center shadow-[3px_3px_0px_#000] group-hover:scale-105 active:scale-95 transition-all">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold text-black mt-1">
                    {item.label}
                  </span>
                </button>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all duration-150 min-h-[44px] ${active
                    ? "text-black font-bold"
                    : "text-neutral-600 hover:text-black"
                  }`}
              >
                <div className={`p-1 rounded-lg ${active ? "bg-[#FFE600] border border-black shadow-[1px_1px_0px_#000]" : ""}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold tracking-tight mt-0.5">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}