import { useState } from "react";
import Link from "next/link";
import {
  Award,
  Calendar,
  Clock,
  MapPin,
  Users,
  Zap,
  CalendarDays,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Instagram,
  Bell,
  Trophy,
} from "lucide-react";
import Head from "next/head";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { TechIcon } from "@/components/TechIcon";

const upcomingEvents: Array<{
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  domains: string[];
  capacity: string;
  highlights: string[];
  status: "open" | "closed";
  icon: string;
  registrationUrl: string;
  learnMoreUrl: string;
}> = [
    {
      id: 3,
      title: "Designathon & Ideathon",
      date: "October 2026",
      time: "TBA",
      location: "On-Campus",
      description:
        "Unleash your creativity and innovation! Design stunning UI/UX solutions and pitch groundbreaking ideas that solve real-world problems. Perfect for designers, developers, and creative thinkers.",
      domains: [
        "UI/UX Design",
        "Product Design",
        "Innovation",
        "Prototyping",
        "Problem Solving",
      ],
      capacity: "80+",
      highlights: [
        "Two parallel tracks: Design & Ideas",
        "Mentorship from industry experts",
        "Prototype your concepts",
        "Present to judges panel",
      ],
      status: "open",
      icon: "🎨",
      registrationUrl: "mailto:devnest.techclub@gmail.com",
      learnMoreUrl: "/events",
    },
    {
      id: 4,
      title: "LeetCode Competition & Webathon",
      date: "November 2026",
      time: "TBA",
      location: "On-Campus",
      description:
        "A dual-track event combining competitive programming and web development. Solve algorithmic challenges on LeetCode while building stunning web applications. Showcase both your problem-solving and development skills.",
      domains: [
        "Competitive Programming",
        "Data Structures",
        "Algorithms",
        "Web Development",
        "Frontend",
      ],
      capacity: "120+",
      highlights: [
        "LeetCode-style programming challenges",
        "Web development hackathon track",
        "Time-bound competitions",
        "Recognition for both tracks",
      ],
      status: "open",
      icon: "💻",
      registrationUrl: "mailto:devnest.techclub@gmail.com",
      learnMoreUrl: "/events",
    },
    {
      id: 5,
      title: "Startup Hackathon",
      date: "December 2026",
      time: "TBA",
      location: "On-Campus",
      description:
        "Build the next big thing! A 24-48 hour hackathon focused on creating startup-ready products. From ideation to MVP, work with your team to develop innovative solutions that could become real startups.",
      domains: [
        "Entrepreneurship",
        "Full-Stack Development",
        "Product Development",
        "Business Strategy",
        "Pitching",
      ],
      capacity: "100+",
      highlights: [
        "Extended hackathon format",
        "Mentorship from startup founders",
        "Pitch to investors",
        "Seed funding opportunities for winners",
        "Networking with startup ecosystem",
      ],
      status: "open",
      icon: "🚀",
      registrationUrl: "mailto:devnest.techclub@gmail.com",
      learnMoreUrl: "/events",
    },
  ];

const pastEvents: Array<{
  id: number;
  title: string;
  date: string;
  attendees: string;
  location: string;
  description: string;
  domains: string[];
  highlights: string[];
  icon: string;
  link: string;
  certificateLink: string;
  statusBadge: string;
  poster?: string;
}> = [
    {
      id: 4,
      title: "Prarambh: Tech Quiz & Capture The Flag (CTF)",
      date: "23 Sept 2026 • Concluded",
      attendees: "90+",
      location: "Laptop Lab, LTSU Punjab",
      description:
        "DevNest's signature flagship event featuring two parallel high-octane competitions: an exclusive Tech Quiz strictly for 1st Year Freshers, and an elite Capture The Flag (CTF) tournament for Seniors across 2nd & 3rd Year divisions.",
      domains: [
        "Tech Quiz (Freshers)",
        "CTF (Seniors)",
        "Cybersecurity",
        "Competitive Logic",
        "Algorithms",
      ],
      highlights: [
        "TryHackMe Cyber Arena: Dedicated custom competition rooms deployed with hands-on vulnerable targets",
        "CTF Technical Challenges: Specialized tracks covering Web Exploitation, Cryptography & Digital Forensics",
        "Dynamic Live Scoring: Real-time leaderboard featuring strategic scoreboard freeze & expert jury adjudication",
        "Championship Recognition: Top achievers awarded official trophies, cash awards & verified merit certificates",
      ],
      icon: "🏆",
      link: "/events/prarambh",
      certificateLink: "/certificate-download",
      statusBadge: "Event Completed • Certificates Issued",
      poster: "/events/CTF_banner.png",
    },
    {
      id: 1,
      title: "DataDash",
      date: "April 10, 2026",
      attendees: "153",
      location: "IBM Lab, LTSU Punjab",
      description:
        "Where Data Meets Innovation! A data-focused innovation challenge where students transformed insights into impact through analytics, visualization, and practical problem-solving.",
      domains: [
        "Data Analytics",
        "Problem Solving",
        "Visualization",
        "Data Storytelling",
      ],
      highlights: [
        "153 participants registered across 46 teams",
        "Hands-on datasets and real-world problem statements",
        "Jury reviews and data visualization showcases",
        "Verified participation credentials issued",
      ],
      icon: "📊",
      link: "/events/datadash",
      certificateLink: "/certificates/datadash",
      statusBadge: "Event Concluded • Results Under Review",
    },
    {
      id: 2,
      title: "Promptathon in Yuva Kaushal",
      date: "February 25, 2026",
      attendees: "68",
      location: "IBM Lab, LTSU Punjab",
      description:
        "A grand success! Students showcased exceptional AI prompt engineering skills, pushing the boundaries of AI communication, multi-modal generation, and critical algorithmic thinking.",
      domains: [
        "AI & Prompt Engineering",
        "LLM Reasoning",
        "Critical Thinking",
        "Multi-modal AI",
      ],
      highlights: [
        "68 participants across multiple competitive squads",
        "Phase I & Phase II multi-round prompt challenges",
        "Practical evaluations with zero hallucination criteria",
        "Official certificates available across team galleries",
      ],
      icon: "⚡",
      link: "/events/promptathon-2026",
      certificateLink: "/certificates/promptathon",
      statusBadge: "Grand Success • Certificates Available",
      poster: "/events/promptathon/poster.png",
    },
    {
      id: 3,
      title: "Guest Speaker Event",
      date: "February 5, 2026",
      attendees: "150+",
      location: "Auditorium, LTSU Punjab",
      description:
        "Inspiring expert career lecture with Amit Kumar Jaiswal, IIM Bangalore graduate and founder of Aptitude360online, covering competitive exams, career roadmap, and industry aptitude skills.",
      domains: [
        "Career Pathways",
        "Aptitude Skills",
        "Competitive Exams",
        "Industry Connect",
      ],
      highlights: [
        "150+ student attendees from all departments",
        "Keynote on CAT, UPSC, SSC & Placement aptitude",
        "Live interactive Q&A session with students",
        "Official participation certificates generated",
      ],
      icon: "🎤",
      link: "/events/guest-speaker-feb",
      certificateLink: "/certificate-download",
      statusBadge: "Completed • Verified Credentials",
      poster: "/events/guest-speaker-feb/image.png",
    },
  ];

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

  return (
    <Layout>
      <Head>
        <title>DevNest | Events & Hackathons</title>
        <meta
          name="description"
          content="Explore upcoming tech hackathons, workshops, and flagship competitions organized by DevNest."
        />
      </Head>

      <div className="relative min-h-screen py-16 sm:py-24">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Left-Aligned Header */}
          <header className="text-left mb-12">
            <div className="badge-pill mb-4">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>DevNest Events Calendar</span>
              <span className="text-muted-foreground/60">•</span>
              <span className="text-foreground/80 font-medium">Flagship Sprints</span>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
              <div className="max-w-2xl">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-poppins font-bold tracking-tight mb-4 text-foreground">
                  Events & <span className="text-gradient-primary">Hackathons</span>
                </h1>

                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                  Join our community hackathons, competitive coding sprints, workshops, and tech talks.
                  Build with fellow students, earn credentials, and showcase your engineering prowess.
                </p>
              </div>

              {/* Segmented Tabs Control */}
              <div className="inline-flex p-1.5 rounded-2xl bg-white border-2 border-black shadow-[3px_3px_0px_#000] shrink-0 self-start lg:self-end">
                <button
                  type="button"
                  onClick={() => setActiveTab("upcoming")}
                  className={`inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-150 ${activeTab === "upcoming"
                    ? "bg-[#FFE600] text-black shadow-[2px_2px_0px_#000] border-2 border-black"
                    : "text-black hover:bg-[#FAF7EE] border-2 border-transparent"
                    }`}
                >
                  <Calendar className="w-4 h-4 text-black" />
                  <span>Upcoming ({upcomingEvents.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("past")}
                  className={`inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-150 ${activeTab === "past"
                    ? "bg-[#FFE600] text-black shadow-[2px_2px_0px_#000] border-2 border-black"
                    : "text-black hover:bg-[#FAF7EE] border-2 border-transparent"
                    }`}
                >
                  <Award className="w-4 h-4 text-black" />
                  <span>Past ({pastEvents.length})</span>
                </button>
              </div>
            </div>

            {/* Schedule Banner */}
            <div>
              <Link href="/events/schedule" className="block group">
                <div className="rounded-2xl p-5 sm:p-6 border border-border/80 glass-panel hover:border-primary/40 shadow-subtle hover:shadow-premium transition-all duration-300 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4 text-left">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 text-primary">
                      <CalendarDays className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                        Complete 2026 Event Schedule
                      </h2>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        February – June 2026 • 5 Major Flagship Events • Hackathons, Datathons & Expert Talks
                      </p>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary shrink-0 group-hover:translate-x-1 transition-transform">
                    <span>View Timeline</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </div>
          </header>

          {/* Upcoming Events Tab */}
          {activeTab === "upcoming" && (
            <div className="space-y-8">
              {upcomingEvents.length === 0 ? (
                <div className="glass-panel rounded-3xl p-12 text-center border border-border/80 max-w-md mx-auto">
                  <CalendarDays className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">No Upcoming Events</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    We&apos;re planning some exciting events! Check back soon for updates.
                  </p>
                  <Button onClick={() => setActiveTab("past")} className="gap-2">
                    <Award className="w-4 h-4" />
                    View Past Events
                  </Button>
                </div>
              ) : (
                upcomingEvents.map((event) => (
                  <article
                    key={event.id}
                    className="glass-panel rounded-3xl p-6 sm:p-8 border border-border/80 hover:border-primary/40 shadow-subtle hover:shadow-premium-hover transition-all duration-300"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Main Left Details */}
                      <div className="lg:col-span-2">
                        {/* Domain badges */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {event.domains.map((domain, idx) => (
                            <span
                              key={`${domain}-${idx}`}
                              className="px-2.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 text-[11px] font-semibold"
                            >
                              {domain}
                            </span>
                          ))}
                        </div>

                        {/* Title with icon */}
                        <div className="flex items-center gap-3.5 mb-3">
                          <div className="w-12 h-12 rounded-2xl bg-[#FFE600] border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center shrink-0">
                            <TechIcon name={event.icon} className="w-6 h-6 text-black stroke-[2.3]" />
                          </div>
                          <h2 className="text-2xl sm:text-3xl font-poppins font-bold tracking-tight text-foreground">
                            {event.title}
                          </h2>
                        </div>

                        {/* Description */}
                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">
                          {event.description}
                        </p>

                        {/* Metadata Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                          <div className="p-3 rounded-xl bg-secondary/60 border border-border/60">
                            <div className="flex items-center gap-1.5 text-primary text-xs font-semibold mb-0.5">
                              <Clock className="w-3.5 h-3.5" />
                              <span>Timeline</span>
                            </div>
                            <span className="text-xs text-foreground font-medium truncate block">
                              {event.date}
                            </span>
                          </div>

                          <div className="p-3 rounded-xl bg-secondary/60 border border-border/60">
                            <div className="flex items-center gap-1.5 text-primary text-xs font-semibold mb-0.5">
                              <MapPin className="w-3.5 h-3.5" />
                              <span>Venue</span>
                            </div>
                            <span className="text-xs text-foreground font-medium truncate block">
                              {event.location}
                            </span>
                          </div>

                          <div className="p-3 rounded-xl bg-secondary/60 border border-border/60">
                            <div className="flex items-center gap-1.5 text-primary text-xs font-semibold mb-0.5">
                              <Users className="w-3.5 h-3.5" />
                              <span>Capacity</span>
                            </div>
                            <span className="text-xs text-foreground font-medium truncate block">
                              {event.capacity} Slots
                            </span>
                          </div>

                          <div className="p-3 rounded-xl bg-secondary/60 border border-border/60">
                            <div className="flex items-center gap-1.5 text-primary text-xs font-semibold mb-0.5">
                              <Zap className="w-3.5 h-3.5" />
                              <span>Highlights</span>
                            </div>
                            <span className="text-xs text-foreground font-medium truncate block">
                              {event.highlights.length} Perks
                            </span>
                          </div>
                        </div>

                        {/* Highlights List */}
                        <div>
                          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                            Event Highlights:
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-muted-foreground">
                            {event.highlights.map((highlight, idx) => (
                              <div key={`${highlight}-${idx}`} className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                                <span>{highlight}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right Registration / Status Card */}
                      <div className="lg:col-span-1 rounded-2xl p-6 bg-secondary/50 border border-border/60 flex flex-col justify-between items-center text-center">
                        <div className="w-full flex flex-col items-center">
                          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-500 mb-3">
                            <Bell className="w-6 h-6 animate-pulse" />
                          </div>

                          <span className="inline-block px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-600 dark:text-amber-400 text-xs font-semibold mb-2">
                            Registrations Opening Soon
                          </span>

                          <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">
                            Keep your team ready! Registration links and problem statements will be announced across our official channels.
                          </p>
                        </div>

                        <div className="w-full mt-6 space-y-2">
                          <a
                            href={event.registrationUrl}
                            className="inline-flex w-full items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs sm:text-sm font-semibold shadow-subtle hover:shadow-glow-primary transition-all duration-200 active:scale-95"
                          >
                            <span>Express Interest</span>
                            <ArrowRight className="w-4 h-4" />
                          </a>

                          <Link
                            href="/events/schedule"
                            className="inline-flex w-full items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <span>See Schedule Details</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>
                )
                )
              )}
            </div>
          )}

          {/* Past Events Tab */}
          {activeTab === "past" && (
            <div className="space-y-6">
              <div className="text-center mb-4">
                <p className="text-sm sm:text-base text-muted-foreground font-medium">
                  Check out the impact, key milestones, and recap galleries from our past flagship initiatives.
                </p>
              </div>

              {pastEvents.map((event) => (
                <article
                  key={event.id}
                  className="glass-panel rounded-3xl p-6 sm:p-8 border border-border/80 hover:border-primary/40 shadow-subtle hover:shadow-premium-hover transition-all duration-300"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Left Details */}
                    <div className="lg:col-span-2 flex flex-col justify-between">
                      <div>
                        {/* Domain badges */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {event.domains.map((domain, idx) => (
                            <span
                              key={`${domain}-${idx}`}
                              className="px-2.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 text-[11px] font-semibold"
                            >
                              {domain}
                            </span>
                          ))}
                        </div>

                        {/* Title with icon */}
                        <div className="flex items-center gap-3.5 mb-3">
                          <div className="w-12 h-12 rounded-2xl bg-[#FFE600] border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center shrink-0">
                            <TechIcon name={event.icon} className="w-6 h-6 text-black stroke-[2.3]" />
                          </div>
                          <h2 className="text-2xl sm:text-3xl font-poppins font-bold tracking-tight text-foreground">
                            {event.title}
                          </h2>
                        </div>

                        {/* Description */}
                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">
                          {event.description}
                        </p>

                        {/* Metadata Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                          <div className="p-3 rounded-xl bg-secondary/60 border border-border/60">
                            <div className="flex items-center gap-1.5 text-primary text-xs font-semibold mb-0.5">
                              <Clock className="w-3.5 h-3.5" />
                              <span>Timeline</span>
                            </div>
                            <span className="text-xs text-foreground font-medium truncate block">
                              {event.date}
                            </span>
                          </div>

                          <div className="p-3 rounded-xl bg-secondary/60 border border-border/60">
                            <div className="flex items-center gap-1.5 text-primary text-xs font-semibold mb-0.5">
                              <MapPin className="w-3.5 h-3.5" />
                              <span>Venue</span>
                            </div>
                            <span className="text-xs text-foreground font-medium truncate block">
                              {event.location}
                            </span>
                          </div>

                          <div className="p-3 rounded-xl bg-secondary/60 border border-border/60">
                            <div className="flex items-center gap-1.5 text-primary text-xs font-semibold mb-0.5">
                              <Users className="w-3.5 h-3.5" />
                              <span>Turnout</span>
                            </div>
                            <span className="text-xs text-foreground font-medium truncate block">
                              {event.attendees} Participants
                            </span>
                          </div>

                          <div className="p-3 rounded-xl bg-secondary/60 border border-border/60">
                            <div className="flex items-center gap-1.5 text-primary text-xs font-semibold mb-0.5">
                              <Award className="w-3.5 h-3.5" />
                              <span>Highlights</span>
                            </div>
                            <span className="text-xs text-foreground font-medium truncate block">
                              {event.highlights.length} Achievements
                            </span>
                          </div>
                        </div>

                        {/* Highlights List */}
                        <div className="mb-6">
                          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                            Event Highlights:
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm text-muted-foreground">
                            {event.highlights.map((highlight, idx) => (
                              <div key={`${highlight}-${idx}`} className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                <span>{highlight}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Shifted Explore Event & Certificate Section to Left Column */}
                      <div className="flex flex-wrap items-center gap-3 pt-5 border-t border-border/60 mt-4">
                        <Link
                          href={event.link}
                          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#FFE600] text-black font-bold text-xs sm:text-sm border-2 border-black shadow-[3px_3px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_#000] active:scale-95 transition-all duration-200"
                        >
                          <span>Explore Event Recap</span>
                          <ArrowRight className="w-4 h-4" />
                        </Link>

                        <Link
                          href={event.certificateLink}
                          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-foreground bg-secondary/80 hover:bg-secondary border-2 border-black shadow-[2px_2px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_#000] active:scale-95 transition-all duration-200"
                        >
                          <Award className="w-4 h-4 text-primary" />
                          <span>Download Certificate</span>
                        </Link>

                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 text-xs font-semibold sm:ml-auto">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          <span>{event.statusBadge}</span>
                        </span>
                      </div>
                    </div>

                    {/* Right Event Poster Section */}
                    <div className="lg:col-span-1 flex flex-col justify-center items-center">
                      {event.poster ? (
                        <div className="w-full relative group rounded-2xl overflow-hidden border-2 border-black bg-neutral-950 shadow-[4px_4px_0px_#000] transition-all duration-300 hover:-translate-y-1">
                          <Link href={event.link} className="block relative w-full overflow-hidden bg-neutral-900">
                            <img
                              src={event.poster}
                              alt={`${event.title} Official Poster`}
                              className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-105"
                            />

                            {/* Official Poster Badge */}
                            <div className="absolute top-3 left-3 z-10">
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md text-[#FFE600] text-[10px] font-black uppercase tracking-wider border border-[#FFE600]/40 shadow-sm">
                                Official Poster
                              </span>
                            </div>

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                              <span className="text-white text-xs font-bold flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#FFE600] text-black border border-black shadow-[2px_2px_0px_#000]">
                                <span>Explore Event Recap</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </span>
                            </div>
                          </Link>
                        </div>
                      ) : (
                        <div className="w-full h-full min-h-[300px] rounded-2xl p-6 bg-secondary/50 border-2 border-dashed border-border/80 flex flex-col justify-center items-center text-center">
                          <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-3">
                            <TechIcon name={event.icon} className="w-7 h-7" />
                          </div>
                          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                            Event Archive
                          </span>
                          <h4 className="text-sm font-bold text-foreground mb-2">
                            {event.title}
                          </h4>
                          <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold">
                            {event.statusBadge}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Bottom Community Newsletter Section */}
          <section className="mt-20">
            <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-border/80 shadow-premium max-w-3xl mx-auto text-center relative overflow-hidden">
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto mb-4">
                  <Sparkles className="w-6 h-6" />
                </div>

                <h2 className="text-2xl sm:text-3xl font-poppins font-bold text-foreground mb-3">
                  Never Miss a Flagship Hackathon
                </h2>

                <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto mb-8 leading-relaxed">
                  Join our official WhatsApp group and follow us on Instagram for spot updates, registration windows, and mentor announcements.
                </p>

                <div className="flex flex-wrap gap-3 justify-center">
                  <Link
                    href="/membership"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground text-xs sm:text-sm font-semibold shadow-subtle hover:shadow-glow-primary transition-all duration-200 active:scale-95"
                  >
                    <span>Join DevNest Community</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-secondary text-foreground hover:bg-secondary/80 border border-border/80 text-xs sm:text-sm font-semibold transition-all duration-200"
                  >
                    <Instagram className="w-4 h-4 text-primary" />
                    <span>Follow on Instagram</span>
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}