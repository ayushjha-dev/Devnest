import Head from "next/head";
import { Layout } from "@/components/Layout";
import Image from "next/image";
import { Trophy, Award, Users, Medal } from "lucide-react";
import ShinyText from "@/components/ShinyText";

interface TeamMember {
  name: string;
  role?: string;
}

interface WinnerTeam {
  teamName: string;
  position: string;
  members: TeamMember[];
  image: string;
  event: string;
  year: string;
}

export default function HallOfFamePage() {
  const winners: WinnerTeam[] = [
    // Promptathon Winners
    {
      teamName: "Team Alpha",
      position: "1st Place",
      members: [
        { name: "John Doe", role: "Team Lead" },
        { name: "Jane Smith", role: "Developer" },
        { name: "Mike Johnson", role: "Designer" },
      ],
      image: "/events/promptathon-winner-1.jpg",
      event: "Promptathon",
      year: "2024",
    },
    {
      teamName: "Team Beta",
      position: "2nd Place",
      members: [
        { name: "Sarah Wilson", role: "Team Lead" },
        { name: "David Brown", role: "Developer" },
      ],
      image: "/events/promptathon-winner-2.jpg",
      event: "Promptathon",
      year: "2024",
    },
    {
      teamName: "Team Gamma",
      position: "3rd Place",
      members: [
        { name: "Emily Davis", role: "Team Lead" },
        { name: "Chris Martin", role: "Developer" },
        { name: "Alex Turner", role: "Analyst" },
      ],
      image: "/events/promptathon-winner-3.jpg",
      event: "Promptathon",
      year: "2024",
    },
    // DataDash Winners
    {
      teamName: "Data Wizards",
      position: "1st Place",
      members: [
        { name: "Priya Sharma", role: "Team Lead" },
        { name: "Rahul Kumar", role: "Data Scientist" },
        { name: "Anjali Patel", role: "Analyst" },
      ],
      image: "/events/datadash-winner-1.jpg",
      event: "DataDash",
      year: "2024",
    },
    {
      teamName: "Analytics Masters",
      position: "2nd Place",
      members: [
        { name: "Vikram Singh", role: "Team Lead" },
        { name: "Sneha Gupta", role: "Data Engineer" },
      ],
      image: "/events/datadash-winner-2.jpg",
      event: "DataDash",
      year: "2024",
    },
    {
      teamName: "Insight Innovators",
      position: "3rd Place",
      members: [
        { name: "Arjun Reddy", role: "Team Lead" },
        { name: "Meera Krishnan", role: "ML Engineer" },
        { name: "Rohan Verma", role: "Data Analyst" },
      ],
      image: "/events/datadash-winner-3.jpg",
      event: "DataDash",
      year: "2024",
    },
  ];

  const promptathonWinners = winners.filter(w => w.event === "Promptathon");
  const datadashWinners = winners.filter(w => w.event === "DataDash");

  const getPositionIcon = (position: string) => {
    if (position === "1st Place") return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (position === "2nd Place") return <Medal className="w-6 h-6 text-gray-400" />;
    if (position === "3rd Place") return <Medal className="w-6 h-6 text-amber-700" />;
    return <Award className="w-6 h-6 text-primary" />;
  };

  const getPositionColor = (position: string) => {
    if (position === "1st Place") return "from-yellow-500 to-amber-500";
    if (position === "2nd Place") return "from-gray-400 to-gray-500";
    if (position === "3rd Place") return "from-amber-700 to-amber-800";
    return "from-primary to-primary/70";
  };

  return (
    <Layout>
      <Head>
        <title>Hall of Fame | DevNest</title>
        <meta name="description" content="Celebrating our champions - Winners of Promptathon and DataDash competitions" />
      </Head>

      <div className="relative min-h-screen py-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.04]">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(0, 184, 113, 0.15) 2%, transparent 0%),
              radial-gradient(circle at 75% 75%, rgba(0, 184, 113, 0.15) 2%, transparent 0%)
            `,
            backgroundSize: '60px 60px',
            animation: 'float 15s ease-in-out infinite'
          }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="mb-6 inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/30">
              <Trophy className="w-6 h-6 text-primary" />
              <span className="text-primary text-sm font-medium">
                <span className="emoji-white">🏆</span> Champions
              </span>
            </div>
            <h1 className="text-5xl sm:text-6xl font-poppins font-bold mb-4">
              <ShinyText text="Hall of Fame" className="glow-text" speed={2} />
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Celebrating the brilliant minds who conquered our competitions. 
              Their innovation, teamwork, and determination inspire us all.
            </p>
          </div>

          {/* Promptathon Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary" />
                <h2 className="text-3xl sm:text-4xl font-poppins font-bold text-primary">
                  Promptathon Winners
                </h2>
                <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary" />
              </div>
              <p className="text-muted-foreground">
                Masters of AI Prompt Engineering - 2024
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {promptathonWinners.map((team, index) => (
                <div
                  key={index}
                  className="group relative glass-effect rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/20"
                  style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.2}s both` }}
                >
                  {/* Position Badge */}
                  <div className="absolute top-4 right-4 z-20">
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${getPositionColor(team.position)} text-white font-semibold text-sm shadow-lg`}>
                      {getPositionIcon(team.position)}
                      {team.position}
                    </div>
                  </div>

                  {/* Team Photo */}
                  <div className="relative h-64 bg-muted overflow-hidden">
                    <Image
                      src={team.image}
                      alt={`${team.teamName} - ${team.position}`}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder-team.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
                  </div>

                  {/* Team Info */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="w-5 h-5 text-primary" />
                      <h3 className="text-xl font-bold">{team.teamName}</h3>
                    </div>

                    {/* Team Members */}
                    <div className="space-y-2 mb-4">
                      {team.members.map((member, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 text-sm"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                          <div>
                            <span className="font-semibold text-foreground">
                              {member.name}
                            </span>
                            {member.role && (
                              <span className="text-muted-foreground ml-2">
                                • {member.role}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Event Badge */}
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <span className="text-xs text-muted-foreground font-medium">
                        {team.event} {team.year}
                      </span>
                      <Trophy className="w-5 h-5 text-primary/60" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DataDash Section */}
          <div>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary" />
                <h2 className="text-3xl sm:text-4xl font-poppins font-bold text-primary">
                  DataDash Winners
                </h2>
                <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary" />
              </div>
              <p className="text-muted-foreground">
                Data Science Excellence - 2024
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {datadashWinners.map((team, index) => (
                <div
                  key={index}
                  className="group relative glass-effect rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/20"
                  style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.2}s both` }}
                >
                  {/* Position Badge */}
                  <div className="absolute top-4 right-4 z-20">
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${getPositionColor(team.position)} text-white font-semibold text-sm shadow-lg`}>
                      {getPositionIcon(team.position)}
                      {team.position}
                    </div>
                  </div>

                  {/* Team Photo */}
                  <div className="relative h-64 bg-muted overflow-hidden">
                    <Image
                      src={team.image}
                      alt={`${team.teamName} - ${team.position}`}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder-team.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
                  </div>

                  {/* Team Info */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="w-5 h-5 text-primary" />
                      <h3 className="text-xl font-bold">{team.teamName}</h3>
                    </div>

                    {/* Team Members */}
                    <div className="space-y-2 mb-4">
                      {team.members.map((member, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 text-sm"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                          <div>
                            <span className="font-semibold text-foreground">
                              {member.name}
                            </span>
                            {member.role && (
                              <span className="text-muted-foreground ml-2">
                                • {member.role}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Event Badge */}
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <span className="text-xs text-muted-foreground font-medium">
                        {team.event} {team.year}
                      </span>
                      <Trophy className="w-5 h-5 text-primary/60" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-20 text-center glass-effect rounded-2xl p-8 border border-primary/20">
            <Trophy className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-3">
              Want to Join the Hall of Fame?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Participate in our upcoming competitions and showcase your skills. 
              The next champion could be you!
            </p>
            <a
              href="/events"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-semibold transition-all hover:scale-105"
            >
              View Upcoming Events
            </a>
          </div>
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

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </Layout>
  );
}
