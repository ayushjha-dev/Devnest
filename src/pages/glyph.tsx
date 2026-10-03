import Head from "next/head";
import Link from "next/link";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Wrench,
  Clock,
  Home,
  Calendar,
  Mail,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";

export default function GlyphPage() {
  return (
    <Layout>
      <Head>
        <title>DevNest | Glyph - Under Maintenance</title>
        <meta
          name="description"
          content="The Glyph portal is currently under scheduled maintenance and will be available soon. DevNest technical operations."
        />
      </Head>

      <div className="relative min-h-[calc(100vh-220px)] flex items-center justify-center py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full mx-auto text-center">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFE600] text-black font-bold text-xs border-2 border-black shadow-[2px_2px_0px_#000] mb-6">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-600"></span>
            </span>
            <span className="uppercase tracking-wider">Notice</span>
            <span className="text-black/60">•</span>
            <span className="text-black font-extrabold">System Maintenance</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl font-poppins font-black tracking-tight text-black mb-4">
            Glyph{" "}
            <span className="inline-block px-3 py-0.5 rounded-2xl bg-[#FFE600] border-2 border-black shadow-[3px_3px_0px_#000]">
              Portal
            </span>
          </h1>

          {/* Main Statement in Formal Tone */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white border-2 border-black shadow-[5px_5px_0px_#000] mb-8 text-left sm:text-center">
            <div className="w-12 h-12 rounded-xl bg-[#FFE600] border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center mx-auto mb-4">
              <Wrench className="w-6 h-6 text-black" />
            </div>

            <h2 className="text-xl sm:text-2xl font-bold font-poppins text-black mb-3">
              This page is currently under maintenance and will be available soon.
            </h2>

            <p className="text-sm sm:text-base text-neutral-700 font-medium leading-relaxed max-w-xl mx-auto mb-6">
              Please be advised that the DevNest Glyph section is undergoing scheduled technical
              upgrades and maintenance. Our engineering team is finalizing deployment to ensure a
              seamless experience. We appreciate your patience and understanding.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-6 border-t-2 border-black/10 text-left">
              <div className="p-3 rounded-xl bg-[#FAF7EE] border border-black/20">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-0.5">
                  Status
                </span>
                <span className="text-xs font-bold text-amber-700 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Maintenance Mode
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF7EE] border border-black/20">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-0.5">
                  Availability
                </span>
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                  Expected Soon
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              asChild
              className="rounded-xl h-11 px-6 bg-[#FFE600] hover:bg-[#FFDE59] text-black font-bold border-2 border-black shadow-[3px_3px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all gap-2"
            >
              <Link href="/">
                <Home className="w-4 h-4" />
                <span>Return to Home</span>
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="rounded-xl h-11 px-6 bg-white hover:bg-neutral-50 text-black font-bold border-2 border-black shadow-[3px_3px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all gap-2"
            >
              <Link href="/events">
                <Calendar className="w-4 h-4" />
                <span>Explore Events</span>
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="rounded-xl h-11 px-6 bg-white hover:bg-neutral-50 text-black font-bold border-2 border-black shadow-[3px_3px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all gap-2"
            >
              <Link href="/contact">
                <Mail className="w-4 h-4" />
                <span>Contact Us</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
