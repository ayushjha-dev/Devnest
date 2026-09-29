import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { Layout } from "@/components/Layout";
import {
  Trophy,
  Award,
  Users,
  Medal,
  ArrowLeft,
  Calendar,
  MapPin,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Share2,
} from "lucide-react";
import {
  hallOfFameEvents,
  getEventBySlug,
  HallOfFameEvent,
  WinnerTeam,
} from "@/data/hall-of-fame";
import { GetStaticPaths, GetStaticProps } from "next";

interface Props {
  event: HallOfFameEvent | null;
}

export default function EventWinnersPage({ event }: Props) {
  const router = useRouter();

  if (router.isFallback || !event) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="p-8 rounded-2xl bg-white border-2 border-black shadow-[4px_4px_0px_#000] text-center">
            <h2 className="text-xl font-bold font-poppins mb-2">Event Not Found</h2>
            <p className="text-sm text-neutral-600 mb-4">
              The requested Hall of Fame event could not be found.
            </p>
            <Link
              href="/hall-of-fame"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#FFE600] text-black font-bold text-xs rounded-xl border-2 border-black shadow-[2px_2px_0px_#000]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Hall of Fame</span>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const otherEvents = hallOfFameEvents.filter((e) => e.slug !== event.slug);

  const getPositionIcon = (position: string) => {
    if (position === "1st Place") {
      return <Trophy className="w-5 h-5 text-yellow-500 fill-yellow-500/20" />;
    }
    if (position === "2nd Place") {
      return <Medal className="w-5 h-5 text-slate-400 fill-slate-400/20" />;
    }
    if (position === "3rd Place") {
      return <Medal className="w-5 h-5 text-amber-700 fill-amber-700/20" />;
    }
    return <Award className="w-5 h-5 text-primary" />;
  };

  const getPositionStyling = (position: string) => {
    if (position === "1st Place") {
      return {
        badge: "bg-[#FFE600] text-black border-2 border-black shadow-[2px_2px_0px_#000]",
        border: "border-2 border-black shadow-[5px_5px_0px_#000]",
        rankTag: "bg-yellow-400 text-black",
      };
    }
    if (position === "2nd Place") {
      return {
        badge: "bg-slate-200 text-black border-2 border-black shadow-[2px_2px_0px_#000]",
        border: "border-2 border-black shadow-[4px_4px_0px_#000]",
        rankTag: "bg-slate-300 text-black",
      };
    }
    return {
      badge: "bg-amber-100 text-amber-900 border-2 border-black shadow-[2px_2px_0px_#000]",
      border: "border-2 border-black shadow-[4px_4px_0px_#000]",
      rankTag: "bg-amber-200 text-amber-900",
    };
  };

  return (
    <Layout>
      <Head>
        <title>{`${event.title} — Hall of Fame Champions | DevNest`}</title>
        <meta
          name="description"
          content={`Celebrating the winners of ${event.title} at DevNest LTSU. View winning squads, team members, and honors.`}
        />
      </Head>

      <div className="relative min-h-screen py-10 sm:py-16 overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Navigation & Breadcrumbs */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <Link
              href="/hall-of-fame"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black font-bold text-xs sm:text-sm border-2 border-black shadow-[3px_3px_0px_#000] hover:bg-[#FFE600] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Hall of Fame</span>
            </Link>

            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-600">
              <Link href="/" className="hover:text-black hover:underline">
                Home
              </Link>
              <span>/</span>
              <Link href="/hall-of-fame" className="hover:text-black hover:underline">
                Hall of Fame
              </Link>
              <span>/</span>
              <span className="text-black font-bold truncate max-w-[200px]">
                {event.shortTitle}
              </span>
            </div>
          </div>

          {/* Event Hero Header Card */}
          <div className="p-6 sm:p-8 lg:p-10 rounded-3xl bg-white border-2 border-black shadow-[6px_6px_0px_#000] mb-12 sm:mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Event Poster on Left / Top */}
              <div className="lg:col-span-4 flex justify-center items-start">
                <div className="relative w-full max-w-[420px] rounded-2xl overflow-hidden border-2 border-black shadow-[4px_4px_0px_#000] group bg-neutral-900">
                  <Image
                    src={event.poster}
                    alt={`${event.title} Official Poster`}
                    width={1200}
                    height={800}
                    sizes="(max-width: 1024px) 80vw, 35vw"
                    className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-105"
                    priority
                  />

                  <div className="absolute top-3 left-3 z-10">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-black/85 backdrop-blur-sm text-[#FFE600] text-[10px] font-black uppercase tracking-wider border border-[#FFE600]/40 shadow-sm">
                      Official Poster
                    </span>
                  </div>
                </div>
              </div>

              {/* Event Metadata & Details */}
              <div className="lg:col-span-8 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="px-3 py-1 rounded-full bg-[#FFE600] text-black font-bold text-xs border-2 border-black shadow-[2px_2px_0px_#000]">
                      {event.badge}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-[#FAF7EE] text-black font-bold text-xs border-2 border-black">
                      {event.track}
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-poppins font-black text-black tracking-tight mb-3">
                    {event.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-neutral-700 mb-4">
                    <span className="inline-flex items-center gap-1.5 bg-[#FAF7EE] px-2.5 py-1 rounded-lg border border-black/30">
                      <Calendar className="w-3.5 h-3.5 text-black" />
                      {event.date}
                    </span>
                    <span className="inline-flex items-center gap-1.5 bg-[#FAF7EE] px-2.5 py-1 rounded-lg border border-black/30">
                      <MapPin className="w-3.5 h-3.5 text-black" />
                      {event.location}
                    </span>
                  </div>

                  <p className="text-sm sm:text-base text-neutral-700 leading-relaxed font-medium mb-6">
                    {event.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {event.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-0.5 rounded-md bg-neutral-100 text-neutral-800 text-xs font-semibold border border-neutral-300"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Quick Stats Bar & Action Buttons */}
                <div className="pt-6 border-t-2 border-black/10 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-3 sm:gap-6">
                    <div>
                      <span className="text-[11px] uppercase font-bold text-neutral-500 block">
                        Turnout
                      </span>
                      <span className="text-sm sm:text-base font-extrabold text-black font-poppins">
                        {event.stats.participants}
                      </span>
                    </div>

                    <div className="h-8 w-px bg-neutral-200" />

                    <div>
                      <span className="text-[11px] uppercase font-bold text-neutral-500 block">
                        {event.stats.teams ? "Teams" : "Format"}
                      </span>
                      <span className="text-sm sm:text-base font-extrabold text-black font-poppins">
                        {event.stats.teams || "Individual"}
                      </span>
                    </div>

                    <div className="h-8 w-px bg-neutral-200" />

                    <div>
                      <span className="text-[11px] uppercase font-bold text-neutral-500 block">
                        Grand Award
                      </span>
                      <span className="text-sm sm:text-base font-extrabold text-black font-poppins text-emerald-700">
                        {event.stats.topPrize}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {event.certificateLink && (
                      <Link
                        href={event.certificateLink}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-black text-xs font-bold border-2 border-black shadow-[2px_2px_0px_#000] hover:bg-neutral-50 hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                      >
                        <Award className="w-3.5 h-3.5 text-black" />
                        <span>Get Certificate</span>
                      </Link>
                    )}

                    {event.eventLink && (
                      <Link
                        href={event.eventLink}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FFE600] text-black text-xs font-bold border-2 border-black shadow-[2px_2px_0px_#000] hover:bg-[#FFDE59] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                      >
                        <span>Event Recap</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section Heading: The Winners Podium */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFE600] text-black font-black text-xs uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_#000] mb-3">
              <Trophy className="w-3.5 h-3.5" />
              <span>Official Podium Ranks</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-poppins font-black text-black">
              Championship Winners
            </h2>
            <p className="text-sm text-neutral-600 max-w-lg mx-auto font-medium mt-1">
              Honoring the standout squads who conquered complex challenges and claimed top podium positions.
            </p>
          </div>

          {/* Winner Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-20">
            {event.winners.map((team, index) => {
              const styling = getPositionStyling(team.position);

              return (
                <div
                  key={`${team.teamName}-${index}`}
                  className={`group relative bg-white rounded-3xl overflow-hidden ${styling.border} transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between`}
                >
                  {/* Position Badge in Header */}
                  <div className="absolute top-3.5 right-3.5 z-20">
                    <div
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-black text-xs ${styling.badge}`}
                    >
                      {getPositionIcon(team.position)}
                      <span>{team.position}</span>
                    </div>
                  </div>

                  {/* Team Banner / Photo */}
                  <div className="relative h-56 bg-neutral-900 overflow-hidden border-b-2 border-black">
                    <Image
                      src={team.image}
                      alt={`${team.teamName} - ${team.position}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/events/prarambh-2026-poster.jpg";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                    {/* Team Name Overlay */}
                    <div className="absolute bottom-3 left-4 right-4 flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-[#FFE600] border border-black text-black shadow-sm">
                        <Users className="w-4 h-4" />
                      </div>
                      <h3 className="text-lg font-black font-poppins text-white drop-shadow-md truncate">
                        {team.teamName}
                      </h3>
                    </div>
                  </div>

                  {/* Team Members & Details */}
                  <div className="p-6 flex-1 flex flex-col justify-between bg-white">
                    <div>
                      <div className="text-[11px] uppercase font-bold tracking-wider text-neutral-500 mb-2">
                        Squad Members:
                      </div>

                      <div className="space-y-2 mb-4">
                        {team.members.map((member, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between text-xs py-1.5 px-3 rounded-xl bg-[#FAF7EE] border border-black/20"
                          >
                            <span className="font-bold text-black">{member.name}</span>
                            {member.role && (
                              <span className="text-[11px] text-neutral-600 font-semibold truncate ml-2">
                                {member.role}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>

                      {team.note && (
                        <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 font-semibold mb-4 flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                          <span>{team.note}</span>
                        </div>
                      )}
                    </div>

                    {/* Footer Badge */}
                    <div className="flex items-center justify-between pt-3 border-t-2 border-neutral-100 text-xs font-bold text-neutral-600">
                      <span>
                        {event.shortTitle} • {event.year}
                      </span>
                      <div className="flex items-center gap-1 text-black font-bold">
                        <Trophy className="w-3.5 h-3.5 text-amber-500" />
                        <span>Verified Winner</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Navigation to Other Event Winners */}
          {otherEvents.length > 0 && (
            <div className="mt-16 pt-12 border-t-2 border-black/10">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div>
                  <h3 className="text-xl sm:text-2xl font-poppins font-black text-black">
                    Explore Other Competition Winners
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 font-medium">
                    Jump to other DevNest competition podiums and honored squads.
                  </p>
                </div>

                <Link
                  href="/hall-of-fame"
                  className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-black underline underline-offset-4 hover:text-neutral-700"
                >
                  <span>View All Competitions</span>
                  <span>→</span>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherEvents.map((other) => (
                  <Link
                    key={other.slug}
                    href={`/hall-of-fame/${other.slug}`}
                    className="group p-4 rounded-2xl bg-white border-2 border-black shadow-[4px_4px_0px_#000] hover:-translate-y-1 hover:shadow-[5px_5px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-4"
                  >
                    <div className="relative w-16 h-20 rounded-xl overflow-hidden border border-black shrink-0 bg-neutral-900">
                      <Image
                        src={other.poster}
                        alt={other.shortTitle}
                        fill
                        sizes="80px"
                        className="object-cover object-top group-hover:scale-105 transition-transform"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-black uppercase tracking-wider text-neutral-500 block truncate">
                        {other.track}
                      </span>
                      <h4 className="text-sm font-black font-poppins text-black truncate group-hover:underline">
                        {other.title}
                      </h4>
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 mt-1">
                        <span>View 3 Winners</span>
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Call to Action */}
          <div className="mt-16 text-center rounded-3xl p-8 sm:p-12 bg-white border-2 border-black shadow-[5px_5px_0px_#000] max-w-2xl mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-[#FFE600] border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center text-black mx-auto mb-4">
              <Trophy className="w-6 h-6" />
            </div>

            <h3 className="text-2xl sm:text-3xl font-poppins font-black text-black mb-3">
              Want to Join the Hall of Fame?
            </h3>

            <p className="text-sm text-neutral-600 mb-6 max-w-md mx-auto leading-relaxed font-medium">
              Register for our next flagship competition, build something remarkable, and claim your place among DevNest champions.
            </p>

            <Link
              href="/events"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#FFE600] hover:bg-[#FFDE59] text-black rounded-xl font-black text-xs sm:text-sm border-2 border-black shadow-[3px_3px_0px_#000] hover:shadow-[4px_4px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all duration-200"
            >
              <span>Explore Upcoming Hackathons</span>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = hallOfFameEvents.map((event) => ({
    params: { slug: event.slug },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const slug = params?.slug as string;
  const event = getEventBySlug(slug) || null;

  return {
    props: {
      event,
    },
  };
};
