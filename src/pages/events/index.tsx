import { useState } from "react";
import Link from "next/link";
import { Award, Calendar, Clock, MapPin, Users, Zap, CalendarDays } from "lucide-react";

import Head from "next/head";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import ShinyText from "@/components/ShinyText";

const upcomingEvents: Array<{
	id: number;
	title: string;
	date: string;
	time: string;
	location: string;
	description: string;
	domains: string[];
	capacity: string;
	highlights: string[];
	status: "open" | "closed";
	icon: string;
	registrationUrl: string;
	learnMoreUrl: string;
}> = [
	{
		id: 1,
		title: "Tech Quiz Competition",
		date: "September 2026",
		time: "TBA",
		location: "On-Campus",
		description: "Test your knowledge across multiple tech domains in this fast-paced quiz competition. Compete individually or in teams to prove your mastery of programming, algorithms, databases, and emerging technologies.",
		domains: ["Programming", "Data Structures", "Algorithms", "Web Technologies", "Cloud Computing"],
		capacity: "100+",
		highlights: [
			"Multiple rounds of increasing difficulty",
			"Real-time leaderboard",
			"Prizes for top performers",
			"Questions covering latest tech trends"
		],
		status: "open",
		icon: "🧠",
		registrationUrl: "mailto:devnest.techclub@gmail.com",
		learnMoreUrl: "/events"
	},
	{
		id: 2,
		title: "Capture the Flag (CTF) Competition",
		date: "October 2026",
		time: "TBA",
		location: "On-Campus",
		description: "Dive into the world of cybersecurity with our CTF competition. Solve challenges in cryptography, web exploitation, reverse engineering, forensics, and more to capture flags and climb the leaderboard.",
		domains: ["Cybersecurity", "Cryptography", "Web Security", "Network Security", "Forensics"],
		capacity: "150+",
		highlights: [
			"Jeopardy-style CTF format",
			"Beginner to advanced challenges",
			"Learn practical security skills",
			"Networking with security enthusiasts"
		],
		status: "open",
		icon: "🚩",
		registrationUrl: "mailto:devnest.techclub@gmail.com",
		learnMoreUrl: "/events"
	},
	{
		id: 3,
		title: "Designathon & Ideathon",
		date: "October 2026",
		time: "TBA",
		location: "On-Campus",
		description: "Unleash your creativity and innovation! Design stunning UI/UX solutions and pitch groundbreaking ideas that solve real-world problems. Perfect for designers, developers, and creative thinkers.",
		domains: ["UI/UX Design", "Product Design", "Innovation", "Prototyping", "Problem Solving"],
		capacity: "80+",
		highlights: [
			"Two parallel tracks: Design & Ideas",
			"Mentorship from industry experts",
			"Prototype your concepts",
			"Present to judges panel"
		],
		status: "open",
		icon: "🎨",
		registrationUrl: "mailto:devnest.techclub@gmail.com",
		learnMoreUrl: "/events"
	},
	{
		id: 4,
		title: "LeetCode Competition & Webathon",
		date: "November 2026",
		time: "TBA",
		location: "On-Campus",
		description: "A dual-track event combining competitive programming and web development. Solve algorithmic challenges on LeetCode while building stunning web applications. Showcase both your problem-solving and development skills.",
		domains: ["Competitive Programming", "Data Structures", "Algorithms", "Web Development", "Frontend"],
		capacity: "120+",
		highlights: [
			"LeetCode-style programming challenges",
			"Web development hackathon track",
			"Time-bound competitions",
			"Recognition for both tracks"
		],
		status: "open",
		icon: "💻",
		registrationUrl: "mailto:devnest.techclub@gmail.com",
		learnMoreUrl: "/events"
	},
	{
		id: 5,
		title: "Startup Hackathon",
		date: "December 2026",
		time: "TBA",
		location: "On-Campus",
		description: "Build the next big thing! A 24-48 hour hackathon focused on creating startup-ready products. From ideation to MVP, work with your team to develop innovative solutions that could become real startups.",
		domains: ["Entrepreneurship", "Full-Stack Development", "Product Development", "Business Strategy", "Pitching"],
		capacity: "100+",
		highlights: [
			"Extended hackathon format",
			"Mentorship from startup founders",
			"Pitch to investors",
			"Seed funding opportunities for winners",
			"Networking with startup ecosystem"
		],
		status: "open",
		icon: "🚀",
		registrationUrl: "mailto:devnest.techclub@gmail.com",
		learnMoreUrl: "/events"
	}
];

const pastEvents = [
	{
		id: 1,
		title: "DataDash",
		date: "April 10, 2026",
		attendees: "100+",
		highlight: "A data-focused innovation challenge where students transformed insights into impact through analytics, creativity, and practical problem-solving.",
		icon: "📊",
		link: "/events/datadash",
	},
	{
		id: 2,
		title: "Promptathon in Yuva Kaushal",
		date: "February 25, 2026",
		attendees: "68",
		highlight: "A grand success! Students showcased exceptional AI prompt engineering skills, pushing the boundaries of AI communication and critical thinking.",
		icon: "⚡",
		link: "/events/promptathon-2026",
	},
	{
		id: 3,
		title: "Guest Speaker Event",
		date: "February 5, 2026",
		attendees: "150+",
		highlight: "Inspiring session with Amit Kumar Jaiswal, IIM Bangalore graduate and founder of aptitude360online",
		icon: <span className="emoji-white">🎤</span>,
		link: "/events/guest-speaker-feb",
	},
];

export default function EventsPage() {
	const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

	return (
		<Layout>
			<Head><title>DevNest | Events</title></Head>
			<div className="relative min-h-screen py-20">
				<div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<header className="text-center mb-16">
						<div className="mb-6 inline-block">
							<span className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-medium">
								<span className="emoji-white">🎉</span> DevNest Events Calendar
							</span>
						</div>
						<h1 className="text-5xl sm:text-6xl font-bold mb-4">
							Events & Hackathons
						</h1>
						<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
							Join our community events, hackathons, workshops, and tech talks throughout the year. Build, collaborate, and innovate with us!
						</p>

						{/* Schedule Banner */}
						<div className="mt-8 mx-auto max-w-3xl">
							<Link href="/events/schedule">
								<div className="rounded-xl p-6 border border-border bg-card hover:border-primary/40 transition-colors cursor-pointer">
									<div className="flex items-center justify-center gap-3 mb-2">
										<CalendarDays className="w-6 h-6 text-primary" />
										<h2 className="text-xl font-bold text-primary">
											View Complete 2026 Event Schedule
										</h2>
									</div>
									<p className="text-sm text-muted-foreground">
										February - June 2026 • 5 Major Events • Guest Lectures, Hackathons, Datathons & More
									</p>
								</div>
							</Link>
						</div>
					</header>

					<div className="flex justify-center gap-4 mb-12 flex-wrap">
						<Button
							onClick={() => setActiveTab("upcoming")}
							variant={activeTab === "upcoming" ? "default" : "outline"}
							className="gap-2"
						>
							<Calendar className="w-4 h-4" />
							Upcoming Events
						</Button>
						<Button
							onClick={() => setActiveTab("past")}
							variant={activeTab === "past" ? "default" : "outline"}
							className="gap-2"
						>
							<Award className="w-4 h-4" />
							Past Events
						</Button>
					</div>

					{activeTab === "upcoming" && (
						<div className="space-y-12">
							{upcomingEvents.length === 0 ? (
								<div className="rounded-xl p-12 text-center border border-border bg-card">
									<CalendarDays className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
									<h3 className="text-2xl font-bold mb-2">
										No Upcoming Events
									</h3>
									<p className="text-muted-foreground max-w-md mx-auto">
										We're planning some exciting events! Check back soon for updates, or view our past events to see what we've been up to.
									</p>
									<Button
										onClick={() => setActiveTab("past")}
										className="mt-6 gap-2"
									>
										<Award className="w-4 h-4" />
										View Past Events
									</Button>
								</div>
							) : (
								upcomingEvents.map((event) => (
									<article
										key={event.id}
										className="glass-effect rounded-xl overflow-hidden hover-lift transition-all hover:bg-primary/5"
									>
										<div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
											<div className="md:col-span-2">
												<div className="flex items-start gap-4 mb-4">
													<div className="text-5xl" aria-hidden>
														{event.icon}
													</div>
													<div className="flex-1">
														<h2 className="text-3xl font-poppins font-bold mb-2">
															{event.title}
														</h2>
														<div className="flex flex-wrap gap-2 mb-4">
															{event.domains.map((domain, idx) => (
																<span
																	key={`${domain}-${idx}`}
																	className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium"
																>
																	{domain}
																</span>
															))}
														</div>
													</div>
												</div>

												<p className="text-muted-foreground mb-6 leading-relaxed">
													{event.description}
												</p>

												<dl className="grid grid-cols-2 gap-4 mb-6 text-sm text-muted-foreground">
													<div className="flex items-center gap-2">
														<Clock className="w-5 h-5 text-primary" />
														<span>
															{event.date} • {event.time}
														</span>
													</div>
													<div className="flex items-center gap-2">
														<MapPin className="w-5 h-5 text-primary" />
														<span>{event.location}</span>
													</div>
													<div className="flex items-center gap-2">
														<Users className="w-5 h-5 text-secondary" />
														<span>{event.capacity}</span>
													</div>
													<div className="flex items-center gap-2">
														<Zap className="w-5 h-5 text-secondary" />
														<span>{event.highlights.length} highlight perks</span>
													</div>
												</dl>

												<div>
													<h3 className="font-poppins font-bold mb-3 text-base">
														What to expect:
													</h3>
													<ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
														{event.highlights.map((highlight, idx) => (
															<li key={`${highlight}-${idx}`} className="flex items-center gap-2">
																<span className="text-primary">✓</span>
																{highlight}
															</li>
														))}
													</ul>
												</div>
											</div>

											<div className="md:col-span-1 flex flex-col items-center justify-center gap-4 p-6 bg-primary/10 rounded-lg text-center">
												<div>
													<div className="inline-block px-4 py-2 rounded-full bg-amber-500/20 text-amber-600 text-sm font-bold mb-4">
														<span className="emoji-white">🔔</span> Registrations Not Started Yet
													</div>
													<p className="text-sm text-muted-foreground">
														Stay tuned for registration details.
													</p>
												</div>
												{event.status === "open" ? null : (
													<Button className="w-full" disabled>
														Registration Closed
													</Button>
												)}
											</div>
										</div>
									</article>
								))
							)}
						</div>
					)}

					{activeTab === "past" && (
						<div className="space-y-6">
							<div className="text-center mb-8">
								<p className="text-lg text-muted-foreground">
									Check out the amazing events we've hosted!
								</p>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{pastEvents.map((event) => (
									<Link key={event.id} href={event.link}>
										<article className="rounded-lg p-6 border border-border bg-card hover:border-primary/50 transition-colors cursor-pointer h-full">
											<div className="flex items-start gap-4 mb-4">
												<div className="text-4xl" aria-hidden>
													{event.icon}
												</div>
												<div className="flex-1">
													<h3 className="font-bold mb-1">
														{event.title}
													</h3>
													<p className="text-sm text-muted-foreground">
														{event.date}
													</p>
												</div>
											</div>
											<p className="text-muted-foreground text-sm mb-4">
												{event.highlight}
											</p>
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-2 text-sm text-primary font-semibold">
													<Users className="w-4 h-4" />
													{event.attendees} attended
												</div>
												<span className="text-sm text-primary">View →</span>
											</div>
										</article>
									</Link>
								))}
							</div>
						</div>
					)}

					<section className="mt-16 text-center">
						<div className="rounded-xl p-8 max-w-2xl mx-auto border border-border bg-card">
							<h2 className="text-2xl font-bold mb-4">
								Don't miss out on innovation!
							</h2>
							<p className="text-muted-foreground mb-6">
								Subscribe to our newsletter and join our community to get updates on upcoming events, workshops, and hackathons.
							</p>
							<div className="flex gap-4 justify-center flex-wrap">
								<Button className="bg-primary hover:bg-primary/90 gap-2">
									Subscribe to Updates
								</Button>
								<a
									href="https://instagram.com"
									target="_blank"
									rel="noopener noreferrer"
								>
									<Button variant="outline" className="gap-2">
										Follow on Instagram
									</Button>
								</a>
							</div>
						</div>
					</section>
				</div>
			</div>
		</Layout>
	);
}
