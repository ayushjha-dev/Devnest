import Head from "next/head";
import { Layout } from "@/components/Layout";

export default function DomainsPage() {
  return (
    <Layout>
      <Head><title>DevNest | Domains</title></Head>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="text-center max-w-2xl px-4">
          <div className="mb-8">
            <div className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-medium mb-4">
              Coming Soon
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-poppins font-bold mb-4 glow-text">
            Domains of Impact
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Explore our core domains: Web & App Development, AI/ML,
            Cybersecurity, Cloud & DevOps, and AR/VR & Embedded Systems.
          </p>
          <div className="glass-effect rounded-lg p-8 inline-block">
            <p className="text-muted-foreground mb-4">
              This section will showcase our key technical domains with:
            </p>
            <ul className="text-left space-y-2 text-muted-foreground text-sm">
              <li>✓ Interactive domain cards</li>
              <li>✓ Modal details with projects and resources</li>
              <li>✓ Team member assignments</li>
              <li>✓ Learning paths for each domain</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}
