import Head from "next/head";
import { Layout } from "@/components/Layout";
import { TeamCard } from "@/components/TeamCard";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
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

export default function TeamPage() {
  const team: TeamMember[] = teamData.coreTeam;
  const alumni: TeamMember[] = (teamData as any).alumni || [];

  return (
    <Layout>
      <Head><title>DevNest | Team</title></Head>
      <div className="relative min-h-screen py-20">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-20">
            <div className="mb-6 inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/30">
              <Image
                src="/logo.svg"
                alt="DevNest"
                width={24}
                height={24}
                className="w-6 h-6 object-contain"
              />
              <span className="text-primary text-sm font-medium"><span className="emoji-white">👥</span> Our Core Team</span>
            </div>
            <h1 className="text-5xl sm:text-6xl font-poppins font-bold mb-4 glow-text">
              Meet The Nest
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Passionate leaders and mentors driving innovation across multiple tech domains. Together, we build the future of DevNest.
            </p>
          </div>

          {/* Team Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {team.map((member, index) => (
              <TeamCard key={member.id} member={member} index={index} />
            ))}
          </div>

          {/* Alumni Section */}
          {alumni && alumni.length > 0 && (
            <div className="mt-24">
              <div className="text-center mb-16">
                <div className="mb-6 inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/30">
                  <span className="text-primary text-sm font-medium">
                    <span className="emoji-white">🎓</span> DevNest Alumni
                  </span>
                </div>
                <h2 className="text-4xl sm:text-5xl font-poppins font-bold mb-4 glow-text">
                  Our Alumni
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Celebrating those who built DevNest's foundation and continue to inspire the community with their contributions.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {alumni.map((member, index) => (
                  <TeamCard key={member.id} member={member} index={index} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shimmer {
          0% { background-position: -200% -200%; }
          100% { background-position: 200% 200%; }
        }
      `}</style>
    </Layout>
  );
}
