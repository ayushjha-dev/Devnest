import { ReactNode, useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Menu,
  X,
  Github,
  Linkedin,
  Instagram,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface LayoutProps {
  children: ReactNode;
  pauseTerminal?: boolean;
  customTheme?: 'blue-gold' | 'violet' | 'default';
  enableTerminal?: boolean;
}

export function Layout({ children, pauseTerminal = false, customTheme = 'default', enableTerminal = false }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Events", href: "/events" },
    { label: "Arcade", href: "/arcade" },
    { label: "Blogs", href: "/blogs" },
    { label: "Team", href: "/team" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <div>
      <div className="min-h-screen bg-background text-foreground flex flex-col relative">
        {/* Removed FaultyTerminal - now optional per page for better performance */}

        {/* Simplified GPU-Accelerated Background Accents */}
        <div className="fixed inset-0 pointer-events-none z-[1]" style={{ contain: 'layout style paint' }}>
          <div className="absolute top-20 right-20 w-[500px] h-[500px] bg-primary/10 rounded-full" style={{ filter: 'blur(80px)', transform: 'translate3d(0,0,0)', opacity: 0.3 }} />
          <div className="absolute bottom-20 left-20 w-[600px] h-[600px] bg-primary/8 rounded-full" style={{ filter: 'blur(80px)', transform: 'translate3d(0,0,0)', opacity: 0.25 }} />
        </div>

        {/* Navigation */}
        <nav className="sticky top-0 z-50 backdrop-blur-xl bg-background/90 border-b border-border shadow-lg shadow-primary/5" style={{ willChange: 'transform', transform: 'translateZ(0)' }}>
          {/* Gradient Accent Line */}
          <div className={`absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent ${customTheme === 'blue-gold' ? 'via-blue-400' : customTheme === 'violet' ? 'via-violet-400' : 'via-primary'} to-transparent opacity-60`} style={{ transform: 'translateZ(0)' }} />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="flex items-center justify-between h-16 sm:h-20">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-3 group relative">
                <Image
                  src="/logo.svg"
                  alt="DevNest Logo"
                  width={44}
                  height={44}
                  priority
                  className="w-11 h-11 object-contain group-hover:scale-110 group-hover:rotate-12 transition-all duration-500"
                />
                <div className="hidden sm:flex flex-col">
                  <span className={`font-poppins font-bold text-xl bg-gradient-to-r ${customTheme === 'blue-gold' ? 'from-blue-400 via-blue-300 to-amber-400' : customTheme === 'violet' ? 'from-violet-300 via-violet-400 to-fuchsia-400' : 'from-primary via-primary to-primary/70'} bg-clip-text text-transparent group-hover:tracking-wider transition-all duration-300`}>
                    DevNest
                  </span>
                  <span className="text-[10px] text-muted-foreground font-medium -mt-1">Tech Community</span>
                </div>
              </Link>

              {/* Desktop Nav */}
              <div className="hidden md:flex items-center gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${customTheme === 'blue-gold' ? 'hover:bg-blue-400/10 hover:text-blue-400' : customTheme === 'violet' ? 'hover:bg-violet-500/10 hover:text-violet-300' : 'hover:bg-primary/10 hover:text-primary'} relative group overflow-hidden`}
                  >
                    <span className="relative z-10">{item.label}</span>
                    {/* Animated underline */}
                    <span className={`absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r ${customTheme === 'blue-gold' ? 'from-blue-400 to-amber-400' : customTheme === 'violet' ? 'from-violet-400 to-fuchsia-400' : 'from-primary to-primary/50'} group-hover:w-3/4 group-hover:left-[12.5%] transition-all duration-300`} />
                    {/* Hover glow */}
                    <span className={`absolute inset-0 rounded-xl bg-gradient-to-r ${customTheme === 'blue-gold' ? 'from-blue-400/0 via-blue-400/10 to-blue-400/0' : customTheme === 'violet' ? 'from-violet-400/0 via-violet-400/12 to-violet-400/0' : 'from-primary/0 via-primary/10 to-primary/0'} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  </Link>
                ))}
              </div>

              {/* Right actions */}
              <div className="flex items-center gap-2">
                <Button
                  asChild
                  size="sm"
                  className={`${customTheme === 'violet' ? 'bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-900/30 hover:shadow-violet-500/40' : 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-primary/50 neon-border'} hidden sm:inline-flex gap-2 hover:scale-105 transition-all duration-200`}
                >
                  <Link href="/membership"><span className="emoji-white">🚀</span> Join</Link>
                </Button>

                {/* Modern Hamburger Menu Button */}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className={`md:hidden p-2.5 rounded-xl transition-all duration-300 relative group border border-transparent ${customTheme === 'violet' ? 'hover:bg-violet-500/10 hover:border-violet-400/30' : 'hover:bg-primary/10 hover:border-primary/30'}`}
                  aria-label="Toggle menu"
                >
                  <div className="w-6 h-5 flex flex-col justify-between items-end relative">
                    <span className={`h-0.5 bg-foreground rounded-full transition-all duration-300 ${isMenuOpen ? 'w-6 rotate-45 translate-y-2' : 'w-6'
                      } ${customTheme === 'violet' ? 'group-hover:bg-violet-300' : 'group-hover:bg-primary'}`} />
                    <span className={`h-0.5 bg-foreground rounded-full transition-all duration-300 ${isMenuOpen ? 'w-0 opacity-0' : 'w-5'
                      } ${customTheme === 'violet' ? 'group-hover:bg-violet-300' : 'group-hover:bg-primary'}`} />
                    <span className={`h-0.5 bg-foreground rounded-full transition-all duration-300 ${isMenuOpen ? 'w-6 -rotate-45 -translate-y-2' : 'w-4'
                      } ${customTheme === 'violet' ? 'group-hover:bg-violet-300' : 'group-hover:bg-primary'}`} />
                  </div>
                  {/* Glow effect */}
                  <span className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity ${customTheme === 'violet' ? 'bg-violet-500/10' : 'bg-primary/5'}`} />
                </button>
              </div>
            </div>

            {/* Enhanced Mobile Nav */}
            {isMenuOpen && (
              <div className="md:hidden pb-6 pt-4 space-y-2 animate-in slide-in-from-top duration-300 border-t border-border mt-2">
                {navItems.map((item, index) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block px-5 py-3.5 rounded-xl text-base font-medium transition-all duration-300 active:scale-95 border border-border backdrop-blur-sm relative group overflow-hidden glass-effect ${customTheme === 'violet' ? 'hover:bg-violet-500/10 hover:text-violet-300 hover:border-violet-400/40' : 'hover:bg-primary/10 hover:text-primary hover:border-primary/40'}`}
                    onClick={() => setIsMenuOpen(false)}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <span className="relative z-10 flex items-center justify-between">
                      {item.label}
                      <span className={`${customTheme === 'violet' ? 'text-violet-300' : 'text-primary'} opacity-0 group-hover:opacity-100 transition-opacity`}>→</span>
                    </span>
                    {/* Animated gradient on hover */}
                    <span className={`absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ${customTheme === 'violet' ? 'bg-gradient-to-r from-violet-400/0 via-violet-400/12 to-violet-400/0' : 'bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0'}`} />
                  </Link>
                ))}
                <div className="pt-3 px-1">
                  <Button className={`w-full gap-2 py-4 shadow-xl font-semibold text-base rounded-xl relative overflow-hidden group ${customTheme === 'violet' ? 'bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white shadow-violet-900/30' : 'bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-primary/40 neon-border'}`} asChild>
                    <Link href="/join">
                      <span className="relative z-10 flex items-center gap-2 justify-center">
                        <span className="emoji-white">🚀</span> Join DevNest
                      </span>
                      {/* Shine effect */}
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-grow relative z-[2]">{children}</main>

        {/* Footer */}
        <footer className="bg-muted/50 border-t border-border/40 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8">
              {/* Brand */}
              <div className="text-center sm:text-left">
                <div className="flex items-center gap-2 mb-4 justify-center sm:justify-start">
                  <Image
                    src="/logo.svg"
                    alt="DevNest Logo"
                    width={40}
                    height={40}
                    className="w-10 h-10 object-contain"
                  />
                  <span className={`font-poppins font-bold text-lg ${customTheme === 'violet' ? 'bg-gradient-to-r from-violet-300 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent' : 'glow-text'}`}>
                    Devnest
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Build. Learn. Innovate.
                </p>
              </div>

              {/* Quick Links */}
              <div className="text-center sm:text-left">
                <h3 className="font-poppins font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2 text-sm">
                  {navItems.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`text-muted-foreground transition-colors ${customTheme === 'violet' ? 'hover:text-violet-300' : 'hover:text-primary'}`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Community */}
              <div className="text-center sm:text-left">
                <h3 className="font-poppins font-semibold mb-4">Community</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link
                      href="/blogs"
                      className={`text-muted-foreground transition-colors ${customTheme === 'violet' ? 'hover:text-violet-300' : 'hover:text-primary'}`}
                    >
                      Blog
                    </Link>
                  </li>
                  <li>
                    <a
                      href="#"
                      className={`text-muted-foreground transition-colors ${customTheme === 'violet' ? 'hover:text-violet-300' : 'hover:text-primary'}`}
                    >
                      Discord
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className={`text-muted-foreground transition-colors ${customTheme === 'violet' ? 'hover:text-violet-300' : 'hover:text-primary'}`}
                    >
                      Forum
                    </a>
                  </li>
                </ul>
              </div>

              {/* Newsletter */}
              <div className="text-center sm:text-left">
                <h3 className="font-poppins font-semibold mb-4">
                  Stay Updated
                </h3>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    placeholder="Your email"
                    className={`flex-1 px-3 py-2 rounded-lg bg-input text-sm text-foreground placeholder-muted-foreground border border-border focus:outline-none focus:ring-2 ${customTheme === 'violet' ? 'focus:ring-violet-400' : 'focus:ring-primary'}`}
                  />
                  <Button
                    size="sm"
                    className={`w-full sm:w-auto ${customTheme === 'violet' ? 'bg-violet-600 hover:bg-violet-500 text-white' : 'bg-primary hover:bg-primary/90 text-primary-foreground'}`}
                  >
                    Subscribe
                  </Button>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-border/40">
              <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
                © 2026 DevNest | Built with <span className="emoji-white">💚</span> by Innovators
              </p>
              <div className="flex items-center gap-4 sm:gap-4">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-muted-foreground transition-colors p-2 rounded-lg ${customTheme === 'violet' ? 'hover:text-violet-300 hover:bg-violet-500/10' : 'hover:text-primary hover:bg-primary/10'}`}
                  aria-label="GitHub"
                  title="GitHub"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href="https://www.linkedin.com/company/devnestclub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-muted-foreground transition-colors p-2 rounded-lg ${customTheme === 'violet' ? 'hover:text-violet-300 hover:bg-violet-500/10' : 'hover:text-primary hover:bg-primary/10'}`}
                  aria-label="LinkedIn"
                  title="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href="https://www.instagram.com/devnest_tech_club/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-muted-foreground transition-colors p-2 rounded-lg ${customTheme === 'violet' ? 'hover:text-violet-300 hover:bg-violet-500/10' : 'hover:text-primary hover:bg-primary/10'}`}
                  aria-label="Instagram"
                  title="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="mailto:devnest.techclub@gmail.com"
                  className={`text-muted-foreground transition-colors p-2 rounded-lg ${customTheme === 'violet' ? 'hover:text-violet-300 hover:bg-violet-500/10' : 'hover:text-primary hover:bg-primary/10'}`}
                  aria-label="Email"
                  title="Email"
                >
                  <MessageCircle className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
