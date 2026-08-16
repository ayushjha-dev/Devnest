import Head from "next/head";
import { Layout } from "@/components/Layout";
import { MembershipForm } from "@/components/MembershipForm";
import { Users, Zap, Trophy, Rocket } from "lucide-react";

const benefits = [
  {
    icon: Users,
    title: "Community Access",
    description: "Join a vibrant community of tech enthusiasts and innovators",
  },
  {
    icon: Zap,
    title: "Exclusive Events",
    description: "Get access to workshops, hackathons, and tech talks",
  },
  {
    icon: Trophy,
    title: "Competitions",
    description: "Participate in coding challenges and win exciting prizes",
  },
  {
    icon: Rocket,
    title: "Skill Development",
    description: "Learn new technologies and enhance your technical skills",
  },
];

export default function MembershipPage() {
  return (
    <Layout>
      <Head>
        <title>DevNest | Join Our Community</title>
      </Head>

      <div className="relative min-h-screen py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <header className="text-center mb-16">
            <div className="mb-6 inline-block">
              <span className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-medium">
                🎯 Become a Member
              </span>
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold mb-4">
              Join DevNest
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Be part of a thriving tech community. Learn, build, and grow with passionate developers and innovators.
            </p>
          </header>

          {/* Benefits Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">
              Why Join DevNest?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit) => (
                <div
                  key={benefit.title}
                  className="p-6 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors"
                >
                  <benefit.icon className="w-10 h-10 text-primary mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Registration Form */}
          <MembershipForm />

          {/* Contact Section */}
          <section className="mt-16 text-center">
            <div className="rounded-xl p-8 max-w-2xl mx-auto border border-border bg-card">
              <h2 className="text-2xl font-bold mb-4">
                Have Questions?
              </h2>
              <p className="text-muted-foreground mb-6">
                Feel free to reach out to us for any queries about membership or club activities.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <a
                  href="mailto:devnest.techclub@gmail.com"
                  className="inline-block"
                >
                  <button className="px-6 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white font-medium transition-colors">
                    Email Us
                  </button>
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <button className="px-6 py-2 rounded-lg border border-border hover:border-primary/50 transition-colors">
                    Follow on Instagram
                  </button>
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}
