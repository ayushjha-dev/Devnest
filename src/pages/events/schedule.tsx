import { Calendar, Clock, Users, Zap, ChevronDown } from "lucide-react";
import Link from "next/link";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";

const events = [
	{
		id: 1,
		title: "Industry Guest Lecture",
		subtitle: "Competitive Exams, Aptitude Skills & Career Pathways",
		month: "February 2026",
		speaker: "Mr. Amit Kumar Jaiswal",
		speakerRole: "Founder – Aptitude360.online",
		speakerDetails: "IIM Graduate | 15+ years | Mentored 10,000+ students | UPSC, CAT, SSC, Banking Expert",
		icon: <span className="emoji-white">🎓</span>,
		status: "completed",
		schedule: [
			{ time: "10:00 - 10:10", activity: "Inaugural Address", description: "Welcome address and introduction of the speaker" },
			{ time: "10:10 - 11:20", activity: "Expert Guest Lecture", description: "Session on competitive examinations, skill development, career pathways, and industry expectations" },
			{ time: "11:20 - 11:40", activity: "Interactive Q&A Session", description: "Open interaction between students and the guest speaker" },
			{ time: "11:40 - 11:55", activity: "Felicitation", description: "Presentation of memento and certificate of appreciation" },
			{ time: "11:55 - 12:00", activity: "Vote of Thanks", description: "Formal closure of the session" },
		],
	},
	{
		id: 2,
		title: "Promptathon in Yuva Kaushal",
		subtitle: <>AI Prompt Engineering Competition - Grand Success! <span className="emoji-white">🎉</span></>,
		month: "February 25, 2026",
		duration: "4 Hours",
		teamSize: "Individual or 2 members",
		icon: "⚡",
		status: "completed",
		attendees: "68",
		schedule: [
			{ time: "10:30 - 11:00", activity: "Registration & Setup", description: "Participant check-in and system allocation at IBM Lab" },
			{ time: "11:00 - 11:15", activity: "Opening & Briefing", description: "Event rules, judging criteria, and prompt engineering basics" },
			{ time: "11:15 - 13:00", activity: "Competition Phase I", description: "Solving prompt engineering challenges - Pure thinking power" },
			{ time: "13:00 - 13:30", activity: "Break & Evaluation", description: "Short break while initial submissions are evaluated" },
			{ time: "13:30 - 14:45", activity: "Competition Phase II", description: "Advanced challenges - Craft prompts that push AI past the obvious" },
			{ time: "14:45 - 15:00", activity: "Final Submission & Results", description: "Code freeze, evaluation completion, and result declaration" },
		],
	},
	{
		id: 3,
		title: "DataForge Datathon & CyberSprint CTF",
		subtitle: "Dual Track Competition",
		month: "April 2026",
		icon: <span className="emoji-white">🛡️</span>,
		status: "upcoming",
		schedule: [
			{ time: "09:00 - 09:30", activity: "Registration", description: "Participant check-in for Datathon and CTF tracks" },
			{ time: "09:30 - 10:00", activity: "Orientation Session", description: "Rules, datasets, tools, and CTF platform briefing" },
			{ time: "10:00 - 13:00", activity: "Phase I", description: "Data analysis, model building, initial CTF challenges" },
			{ time: "13:00 - 14:00", activity: "Lunch Break", description: "Lunch" },
			{ time: "14:00 - 16:30", activity: "Phase II", description: "Advanced analytics, visualization, complex security challenges" },
			{ time: "16:30 - 17:00", activity: "Final Submission", description: "Submission of reports, dashboards, and captured flags" },
			{ time: "17:00 - 18:00", activity: "Evaluation & Results", description: "Score validation, winner announcement, prize distribution" },
		],
	},
	{
		id: 4,
		title: "IdeaFusion Ideathon",
		subtitle: "Innovation & Entrepreneurship",
		month: "May 2026",
		icon: <span className="emoji-white">💡</span>,
		status: "upcoming",
		schedule: [
			{ time: "09:30 - 10:00", activity: "Registration", description: "Team check-in and seating" },
			{ time: "10:00 - 10:30", activity: "Idea Briefing", description: "Theme explanation, evaluation parameters" },
			{ time: "10:30 - 12:30", activity: "Idea Development", description: "Problem identification, solution framing" },
			{ time: "12:30 - 13:30", activity: "Lunch Break", description: "Lunch" },
			{ time: "13:30 - 15:30", activity: "Prototype & Pitch Preparation", description: "Business model, prototype/mock-up, pitch deck" },
			{ time: "15:30 - 16:30", activity: "Final Pitch", description: "Presentation before evaluation panel" },
			{ time: "16:30 - 17:00", activity: "Results & Closing", description: "Announcement of winners and closing remarks" },
		],
	},
	{
		id: 5,
		title: "CyberSprint Hackathon",
		subtitle: "Cybersecurity Focus",
		month: "June 2026",
		icon: <span className="emoji-white">🔐</span>,
		status: "upcoming",
		schedule: [
			{ time: "09:00 - 09:30", activity: "Registration & Team Check-in", description: "Team verification, ID confirmation, system allocation" },
			{ time: "09:30 - 09:45", activity: "Event Briefing", description: "Explanation of rules, problem statements, judging criteria" },
			{ time: "09:45 - 13:00", activity: "Development Phase I", description: "Ideation, requirement analysis, initial coding" },
			{ time: "13:00 - 13:30", activity: "Working Lunch", description: "Lunch break with continued development" },
			{ time: "13:30 - 16:00", activity: "Development Phase II", description: "Core development, debugging, mentor interactions" },
			{ time: "16:00 - 16:30", activity: "Final Submission", description: "Code freeze and project submission" },
			{ time: "16:30 - 17:30", activity: "Project Demonstrations", description: "Live demos and evaluation by jury" },
			{ time: "17:30 - 18:00", activity: "Valedictory Session", description: "Result declaration, prize distribution, closing remarks" },
		],
	},
];

export default function SchedulePage() {
	return (
		<Layout>
			<div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30 py-16 sm:py-20">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					{/* Header */}
					<div className="mb-12 sm:mb-16 text-center">
						<div className="mb-6 inline-block">
							<span className="inline-block px-4 py-2 rounded-full bg-primary/15 border border-primary/40 text-primary text-sm font-semibold shadow-sm">
								<span className="emoji-white">📅</span> February - June 2026
							</span>
						</div>
						<h1 className="text-4xl sm:text-5xl md:text-6xl font-poppins font-bold mb-4 glow-text">
							Event Schedule
						</h1>
						<p className="mx-auto mt-4 sm:mt-6 max-w-2xl text-base sm:text-lg text-muted-foreground px-2">
							Technical, Innovation & Industry Connect Events - 2026
						</p>
						<p className="mx-auto mt-2 max-w-3xl text-xs sm:text-sm text-muted-foreground">
							Lamrin Tech Skills University Punjab | University School of Engineering & Technology (USET)
						</p>
					</div>

					{/* Events Accordion */}
					<Accordion type="single" collapsible className="space-y-4 sm:space-y-6">
						{events.map((event, idx) => (
							<AccordionItem
								key={event.id}
								value={`event-${event.id}`}
								className="glass-effect rounded-xl overflow-hidden border-none hover-lift"
							>
								<AccordionTrigger className="hover:no-underline p-6 sm:p-8 [&[data-state=open]>div>div>svg]:rotate-180">
									<div className="flex flex-col sm:flex-row items-start justify-between gap-4 w-full">
										<div className="flex items-start gap-3 sm:gap-4 flex-1">
											<span className="text-3xl sm:text-4xl">{event.icon}</span>
											<div className="flex-1 text-left">
												<h2 className="text-lg sm:text-xl md:text-2xl font-poppins font-bold mb-1">
													Event {idx + 1}: {event.title}
												</h2>
												<p className="text-xs sm:text-sm text-muted-foreground">{event.subtitle}</p>
											</div>
										</div>
										<div className="flex items-center gap-3 flex-wrap">
											{event.status === "completed" && (
												<div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/20 text-green-600 dark:text-green-400 text-xs sm:text-sm font-semibold border border-green-500/30 shadow-sm">
													✓ Completed
												</div>
											)}
											<div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/25 text-primary text-xs sm:text-sm font-semibold border border-primary/20 shadow-sm">
												<Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
												{event.month}
											</div>
											<ChevronDown className="h-5 w-5 text-primary shrink-0 transition-transform duration-200" />
										</div>
									</div>
								</AccordionTrigger>

								<AccordionContent className="px-6 sm:px-8 pb-6 sm:pb-8">
									<div className="pt-4 border-t border-border/40">
										{/* Completion Badge for completed events */}
										{event.status === "completed" && (
											<div className="mb-6 rounded-lg bg-green-500/10 border border-green-500/30 p-4 sm:p-6">
												<div className="flex items-center gap-2 mb-2">
													<span className="text-2xl">✓</span>
													<p className="font-semibold text-base sm:text-lg text-green-600 dark:text-green-400">Event Successfully Completed!</p>
												</div>
												{event.attendees && (
													<p className="text-xs sm:text-sm text-muted-foreground">
														<strong>{event.attendees}</strong> participants attended this event
													</p>
												)}
											</div>
										)}

										{/* Event Details */}
										{event.speaker && (
											<div className="mb-6 rounded-lg bg-background/50 border border-border/40 p-4 sm:p-6">
												<p className="font-semibold text-sm sm:text-base mb-1">Guest Speaker: {event.speaker}</p>
												<p className="text-xs sm:text-sm text-muted-foreground mb-2">{event.speakerRole}</p>
												<p className="text-xs sm:text-sm text-muted-foreground">{event.speakerDetails}</p>
											</div>
										)}

										{event.duration && (
											<div className="mb-6 flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
												<span className="flex items-center gap-2">
													<Clock className="h-4 w-4 text-primary" />
													Duration: {event.duration}
												</span>
												{event.teamSize && (
													<span className="flex items-center gap-2">
														<Users className="h-4 w-4 text-primary" />
														Team Size: {event.teamSize}
													</span>
												)}
											</div>
										)}

										{/* Schedule */}
										<div>
											<h3 className="mb-4 flex items-center gap-2 text-base sm:text-lg font-poppins font-bold">
												<Clock className="h-5 w-5 text-primary" />
												Schedule
											</h3>
											<div className="space-y-3">
												{event.schedule.map((item, schedIdx) => (
													<div
														key={schedIdx}
														className="flex flex-col sm:flex-row gap-3 sm:gap-4 rounded-lg bg-muted/30 border border-border/40 p-3 sm:p-4 transition-all hover:bg-muted/50 hover:border-primary/30"
													>
														<div className="flex-shrink-0">
															<span className="inline-block px-3 py-1 rounded-md bg-primary/15 text-primary font-mono text-xs sm:text-sm font-semibold border border-primary/30 shadow-sm">
																{item.time}
															</span>
														</div>
														<div className="flex-1">
															<p className="font-semibold text-xs sm:text-sm mb-1">{item.activity}</p>
															<p className="text-xs text-muted-foreground">{item.description}</p>
														</div>
													</div>
												))}
											</div>
										</div>
									</div>
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>

					{/* Footer CTA */}
					<section className="mt-12 sm:mt-16">
						<div className="glass-effect rounded-xl p-8 sm:p-12 text-center hover-lift">
							<h2 className="text-2xl sm:text-3xl md:text-4xl font-poppins font-bold mb-4">
								Ready to Participate?
							</h2>
							<p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
								Join us in this exciting series of events designed to enhance your skills and connect with industry experts.
							</p>
							<div className="flex gap-4 justify-center flex-wrap px-2">
								<Button size="lg" className="bg-primary hover:bg-primary/90 gap-2 neon-border">
									<Zap className="w-4 h-4 sm:w-5 sm:h-5" />
									Register Now
								</Button>
								<Button size="lg" variant="outline" asChild className="border-primary/30 text-primary hover:bg-primary/10">
									<Link href="/events">View All Events</Link>
								</Button>
							</div>
						</div>
					</section>
				</div>
			</div>
		</Layout>
	);
}