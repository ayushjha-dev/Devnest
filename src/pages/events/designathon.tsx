import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  Trophy,
  Users,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Palette,
  Server,
  Layers,
  HelpCircle,
  Share2,
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { DesignathonApplyDialog } from "@/components/DesignathonApplyDialog";

export default function DesignathonPage() {
  const [applyModalOpen, setApplyModalOpen] = useState(false);

  return (
    <Layout>
      <Head>
        <title>DevNest Designathon 2026 | UI/UX & Backend Competition</title>
        <meta
          name="description"
          content="Participate in DevNest Designathon 2026 at IBM Lab, LTSU Punjab. Evaluated 70% on UI/UX and 30% on Backend. Compete for trophies and cash prizes with open registration for all students."
        />
      </Head>

      <div className="py-12 sm:py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/events" className="hover:text-foreground transition-colors">
            Events
          </Link>
          <span>/</span>
          <span className="text-foreground font-semibold">Designathon 2026</span>
        </div>

        {/* Hero Section */}
        <div className="rounded-3xl border-2 border-black bg-gradient-to-br from-[#FFE600] via-[#FFDE59] to-[#70D6FF] p-6 sm:p-10 shadow-[8px_8px_0px_#000] text-black relative overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-black text-[#FFE600] text-xs font-black uppercase tracking-wider">
                Registrations Live
              </span>
              <span className="px-3 py-1 rounded-full bg-white/90 text-black border border-black text-xs font-bold">
                Open to All Students
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black font-space tracking-tight leading-tight">
              DevNest Designathon 2026
            </h1>

            <p className="text-base sm:text-lg font-medium text-black/90 leading-relaxed">
              DevNest&apos;s premier design-and-code competition! Showcase your UI/UX design mastery
              (70% evaluation) backed by functional backend integration (30% evaluation). Turn high-impact user experiences into reality at IBM Lab.
            </p>

            {/* Quick Metadata Pill Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
              <div className="bg-white/85 rounded-2xl p-3 border-2 border-black shadow-[2px_2px_0px_#000]">
                <div className="text-[11px] font-bold text-neutral-600 flex items-center gap-1 mb-0.5">
                  <Palette className="w-3.5 h-3.5" />
                  Criteria
                </div>
                <div className="text-xs font-black">70% UI/UX &bull; 30% Backend</div>
              </div>

              <div className="bg-white/85 rounded-2xl p-3 border-2 border-black shadow-[2px_2px_0px_#000]">
                <div className="text-[11px] font-bold text-neutral-600 flex items-center gap-1 mb-0.5">
                  <MapPin className="w-3.5 h-3.5" />
                  Venue
                </div>
                <div className="text-xs font-black">IBM Lab, LTSU Punjab</div>
              </div>

              <div className="bg-white/85 rounded-2xl p-3 border-2 border-black shadow-[2px_2px_0px_#000]">
                <div className="text-[11px] font-bold text-neutral-600 flex items-center gap-1 mb-0.5">
                  <Trophy className="w-3.5 h-3.5" />
                  Prizes
                </div>
                <div className="text-xs font-black">Trophies &amp; Cash Prize</div>
              </div>

              <div className="bg-white/85 rounded-2xl p-3 border-2 border-black shadow-[2px_2px_0px_#000]">
                <div className="text-[11px] font-bold text-neutral-600 flex items-center gap-1 mb-0.5">
                  <Users className="w-3.5 h-3.5" />
                  Eligibility
                </div>
                <div className="text-xs font-black">Solo or Team (1-4)</div>
              </div>
            </div>

            {/* Call to action */}
            <div className="pt-4 flex flex-wrap items-center gap-3">
              <Button
                size="lg"
                onClick={() => setApplyModalOpen(true)}
                className="rounded-2xl border-2 border-black bg-black text-white hover:bg-neutral-800 shadow-[4px_4px_0px_#fff] font-black text-sm px-6 h-12 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 mr-2 text-[#FFE600]" />
                Register for Designathon Now
              </Button>

              <Link
                href="/events/schedule"
                className="inline-flex items-center gap-2 px-5 h-12 rounded-2xl bg-white border-2 border-black text-black font-bold text-xs sm:text-sm hover:bg-neutral-100 shadow-[3px_3px_0px_#000] transition-all"
              >
                <span>View Full Schedule</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Evaluation Breakdown & Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: 70% UI/UX Design */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border-2 border-border/80 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FFE600] border-2 border-black shadow-[3px_3px_0px_#000] flex items-center justify-center text-black">
              <Palette className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-xs font-bold text-primary uppercase tracking-wider">
                Primary Weightage
              </span>
              <h2 className="text-2xl font-black font-space text-foreground mt-0.5">
                70% UI/UX Design Evaluation
              </h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We look for clean aesthetics, intuitive user journeys, accessibility, and pixel-perfect responsive layouts. Prototype your concepts using Figma or code them directly.
            </p>
            <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Visual hierarchy, color harmony &amp; typography</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Intuitive user flow and interaction design</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Polished prototypes and responsive adaptability</span>
              </li>
            </ul>
          </div>

          {/* Card 2: 30% Backend Integration */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border-2 border-border/80 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#70D6FF] border-2 border-black shadow-[3px_3px_0px_#000] flex items-center justify-center text-black">
              <Server className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#70D6FF] uppercase tracking-wider">
                Functional Core
              </span>
              <h2 className="text-2xl font-black font-space text-foreground mt-0.5">
                30% Backend &amp; Architecture
              </h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Back up your visuals with working backend capabilities. Connect REST/GraphQL APIs, manage state cleanly, authenticate users, or simulate realistic data feeds.
            </p>
            <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                <span>Working API endpoints or serverless handlers</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                <span>Robust data validation and error handling</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                <span>Clean project architecture and separation of concerns</span>
              </li>
            </ul>
          </div>
        </div>

        {/* CTA Bar */}
        <div className="text-center py-6">
          <Button
            size="lg"
            onClick={() => setApplyModalOpen(true)}
            className="rounded-2xl border-2 border-black bg-[#FFE600] text-black hover:bg-[#FFDE59] shadow-[5px_5px_0px_#000] font-black text-sm px-8 h-12 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Register Your Team for Designathon
          </Button>
        </div>
      </div>

      <DesignathonApplyDialog
        open={applyModalOpen}
        onOpenChange={setApplyModalOpen}
      />
    </Layout>
  );
}
