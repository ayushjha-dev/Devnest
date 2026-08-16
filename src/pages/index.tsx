import Head from "next/head";
import dynamic from "next/dynamic";
import { Layout } from "@/components/Layout";
import { Hero } from "@/components/Hero";

// Lazy load below-the-fold components for better initial page load
const About = dynamic(() => import("@/components/About").then(mod => ({ default: mod.About })), {
  loading: () => <div className="min-h-[400px] flex items-center justify-center"><div className="animate-pulse text-muted-foreground">Loading...</div></div>,
});

const Team = dynamic(() => import("@/components/Team").then(mod => ({ default: mod.Team })), {
  loading: () => <div className="min-h-[600px] flex items-center justify-center"><div className="animate-pulse text-muted-foreground">Loading team...</div></div>,
});

const DailyQuote = dynamic(() => import("@/components/DailyQuote").then(mod => ({ default: mod.DailyQuote })), {
  loading: () => <div className="min-h-[200px] flex items-center justify-center"><div className="animate-pulse text-muted-foreground">Loading quote...</div></div>,
});

export default function Index() {
  return (
    <Layout>
      <Head><title>DevNest | Home</title></Head>
      <Hero />
      <About />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-16">
        <DailyQuote />
      </div>
      <Team />
    </Layout>
  );
}
