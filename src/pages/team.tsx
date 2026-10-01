import Head from "next/head";
import { Layout } from "@/components/Layout";
import { TeamCard } from "@/components/TeamCard";
import { Users, GraduationCap } from "lucide-react";
import teamData from "@/data/team.json";

interface TeamMember {
  id: number;
  name: string;
  role: string;
  designation: string;
  bio: string;
  image: string;
  imagePosition?: string;
  socials: {
    github: string;
    linkedin: string;
    instagram: string;
  };
}

interface TeamData {
  coreTeam: TeamMember[];
  alumni?: TeamMember[];
}

export default function TeamPage() {
  const data = teamData as TeamData;
  const team = data.coreTeam;
  const alumni = data.alumni ?? [];

  return (
    <Layout>
      <Head>
        <title>DevNest | Core Team & Past Members</title>
        <meta
          name="description"
          content="Meet the passionate leaders, engineers, and mentors shaping DevNest tech community."
        />
      </Head>

      <div className="relative min-h-screen py-16 sm:py-24">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Left-Aligned Header */}
          <div className="text-left mb-16 max-w-3xl">
            <div className="badge-pill mb-4">
              <Users className="w-3.5 h-3.5 text-primary" />
              <span>DevNest Leadership</span>
              <span className="text-muted-foreground/60">•</span>
              <span className="text-foreground/80 font-medium">Council Directory</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-poppins font-bold tracking-tight mb-4 text-foreground">
              Meet The <span className="text-gradient-primary">Nest</span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Passionate leaders, developers, and mentors driving technical innovation across
              multiple disciplines. Hover over any member card to view their complete bio and
              connect on GitHub or LinkedIn.
            </p>
          </div>

          {/* Core Team Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {team.map((member) => (
              <TeamCard key={member.id} member={member} />
            ))}
          </div>

          {/* Past Members Section */}
          {alumni.length > 0 && (
            <div className="mt-28 pt-16 border-t-2 border-black text-left">
              <div className="mb-14 max-w-3xl">
                <div className="badge-pill mb-4">
                  <GraduationCap className="w-3.5 h-3.5 text-primary" />
                  <span>Graduated Cohorts</span>
                  <span className="text-muted-foreground/60">•</span>
                  <span className="text-foreground/80 font-medium">Past Members</span>
                </div>

                <h2 className="text-3xl sm:text-4xl md:text-5xl font-poppins font-bold tracking-tight mb-4 text-foreground">
                  Past <span className="text-gradient-primary">Members</span>
                </h2>

                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                  Celebrating the pioneers who established DevNest&apos;s foundation and continue to
                  inspire our community across the global technology industry.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {alumni.map((member) => (
                  <TeamCard key={member.id} member={member} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}