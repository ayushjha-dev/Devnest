import Head from "next/head";
import { Layout } from "@/components/Layout";
import { MembershipForm } from "@/components/MembershipForm";
import { Users, Zap, Trophy, Rocket, Sparkles, Mail } from "lucide-react";

const benefits = [
  {
    icon: Users,
    title: "Vibrant Community",
    description: "Join an active network of 500+ builders, student engineers, and domain leads.",
    color: "bg-[#FFE600]",
  },
  {
    icon: Zap,
    title: "Flagship Hackathons",
    description: "Get priority admission to datathons, CTF defense sprints, and ideathons.",
    color: "bg-[#70D6FF]",
  },
  {
    icon: Trophy,
    title: "Prizes & Recognition",
    description: "Compete in algorithmic challenges, win awards, and earn verified certificates.",
    color: "bg-[#FF70A6]",
  },
  {
    icon: Rocket,
    title: "Industry Mentorship",
    description: "Learn industry-grade workflows, web architectures, and career pathways from experts.",
    color: "bg-[#88EA73]",
  },
];

export default function MembershipPage() {
  return (
    <Layout>
      <Head>
        <title>DevNest | Official Club Membership</title>
        <meta
          name="description"
          content="Apply to join DevNest tech club at LTSU Punjab. Unlock hackathon access, hands-on learning, and community perks."
        />
      </Head>

      <div className="relative min-h-screen py-8 sm:py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Left-Aligned Header Section */}
          <header className="text-left mb-10 sm:mb-16 max-w-3xl">
            <div className="badge-pill mb-4">
              <Sparkles className="w-3.5 h-3.5 text-black" />
              <span>Membership Registration</span>
              <span className="text-black/40">•</span>
              <span className="text-black font-bold">Cohort 2026</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-space font-bold tracking-tight mb-4 text-foreground">
              Join <span className="text-gradient-primary">DevNest</span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Be part of a student-driven tech community at Lamrin Tech Skills University Punjab.
              Learn, build, and innovate alongside passionate developers. Complete the registration
              form below to activate your club membership.
            </p>
          </header>

          {/* Benefits Section (Left-Aligned) */}
          <div className="mb-20 text-left">
            <div className="mb-8">
              <div className="badge-pill mb-3">
                <span className="w-2 h-2 rounded-full bg-black" />
                <span>Member Privileges</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-space font-bold text-foreground">
                Membership Benefits
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 font-medium">
                Everything you need to accelerate your engineering journey.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit) => (
                <div
                  key={benefit.title}
                  className="rounded-2xl p-6 border-2 border-black bg-white shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className={`w-12 h-12 rounded-xl ${benefit.color} border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center text-black mb-4`}>
                      <benefit.icon className="w-6 h-6 stroke-[2.2]" />
                    </div>
                    <h3 className="text-base font-bold font-space text-foreground mb-1.5">
                      {benefit.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Registration Form */}
          <MembershipForm />

          {/* Questions Contact Section (Left-Aligned) */}
          <section className="mt-20">
            <div className="rounded-3xl border-3 border-black bg-[#FAF7EE] shadow-[6px_6px_0px_#000] p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 text-left">
              <div className="max-w-xl">
                <div className="badge-pill mb-3">
                  <Mail className="w-3.5 h-3.5 text-black" />
                  <span>Direct Inquiries</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-space font-bold text-foreground mb-2">
                  Have Any Questions?
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Reach out to our leadership team for queries regarding membership eligibility, club domains, or upcoming initiatives.
                </p>
              </div>
              <div className="flex gap-3 shrink-0 flex-wrap">
                <a
                  href="mailto:devnest.techclub@gmail.com"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FFE600] text-black text-xs sm:text-sm font-space font-bold border-2 border-black shadow-[3px_3px_0px_#000] hover:bg-[#FFE600]/90 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all duration-150"
                >
                  <Mail className="w-4 h-4" />
                  <span>Email Core Team</span>
                </a>

              </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}
