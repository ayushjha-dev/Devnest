import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, Clock, MapPin, ShieldCheck, Users, Zap, Brain, Sparkles } from "lucide-react";

import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";

const WHATSAPP_GROUP_LINK = "https://chat.whatsapp.com/DAeJBINDPNI64g6zV0b2TF";
const CONTACT_EMAILS = [
	"devnest.techclub@gmail.com"
] as const;
const STUDENT_COORDINATOR = "+91 80921 37404";
const FACULTY_COORDINATOR = "+91 60050 17400";

const promptathonFacts = [
	{ label: "Eligibility", value: "Open to all current college students" },
	{ label: "Competition Type", value: "AI Prompt Engineering" },
	{ label: "Venue", value: "IBM Lab" },
	{ label: "Date", value: "25 February 2026" },
	{ label: "Time", value: "11:00 AM to 3:00 PM" },
];

const whatsInStoreList = [
	"Not Speed. Not Code. Just Pure Thinking Power",
	"Students crafted prompts that pushed AI past the obvious",
	"Participants learned to control intelligence with words",
	"Expert mentorship and real-time feedback provided",
	"Networking with AI enthusiasts and industry experts",
];

const whyJoinList = [
	"Mastered the art of AI communication",
	"Won exciting prizes and recognition",
	"Earned participation certificates",
	"Those who asked better, won",
	"Developed critical thinking and problem-solving skills",
];

const heroStats = [
	{ label: "Duration", value: "4 hours", icon: Clock },
	{ label: "Venue", value: "IBM Lab, LTSU", icon: MapPin },
	{ label: "Focus", value: "Prompt Engineering", icon: Brain },
];

export default function PromptatonEventPage() {
	return (
		<Layout>
			<div className="min-h-screen py-16">
				<div className="mx-auto max-w-6xl px-4 sm:px-6">
					{/* Success Banner */}
					<div className="mb-8 glass-effect rounded-2xl border-2 border-primary/50 bg-gradient-to-r from-primary/20 to-secondary/20 p-6 text-center">
						<h2 className="text-2xl sm:text-3xl font-bold text-primary mb-2 flex items-center justify-center gap-2">
							<Sparkles className="h-6 w-6" />
							Event Successfully Completed!
							<Sparkles className="h-6 w-6" />
						</h2>
						<p className="text-lg text-muted-foreground">
							Promptathon 2026 was a grand success with 68 participants showcasing exceptional AI prompt engineering skills! <span className="emoji-white">🎉</span>
						</p>
					</div>

					<section className="text-center mb-16 space-y-6">
						<div>
							<span className="inline-block rounded-full border border-primary/40 bg-primary/15 px-5 py-2 text-sm font-semibold text-primary shadow-sm">
								Promptathon in Yuva Kaushal | 2026
							</span>
						</div>
						<h1 className="text-4xl sm:text-5xl font-poppins font-bold">
							Where WORDS CONTROLLED INTELLIGENCE
						</h1>
						<p className="text-muted-foreground max-w-3xl mx-auto text-lg">
							Not Speed. Not Code. Just Pure Thinking Power. Students crafted prompts that pushed AI past the obvious.
							<strong className="text-primary block mt-2">Those who asked better, won.</strong>
						</p>
						<div className="grid gap-4 sm:grid-cols-3">
							{heroStats.map((stat) => (
								<div
									key={stat.label}
									className="glass-effect rounded-2xl border border-border/50 px-4 py-5 flex flex-col items-center gap-2"
								>
									<stat.icon className="h-5 w-5 text-primary" />
									<p className="text-sm text-muted-foreground">{stat.label}</p>
									<p className="font-semibold">{stat.value}</p>
								</div>
							))}
						</div>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Button asChild variant="outline" size="lg" className="py-6 sm:py-7">
								<Link href={WHATSAPP_GROUP_LINK} target="_blank" rel="noreferrer">
									Join WhatsApp Community
								</Link>
							</Button>
							<Button asChild variant="outline" size="lg" className="py-6 sm:py-7">
								<Link href="/events">
									View All Events
								</Link>
							</Button>
						</div>
					</section>

					<PromptatonDetailsSection />
				</div>
			</div>
		</Layout>
	);
}

const PromptatonDetailsSection = () => (
	<section id="promptathon-details" className="space-y-10">
		<div className="glass-effect rounded-3xl border border-border/40 bg-background/70 p-8 text-center">
			<p className="text-sm uppercase tracking-[0.3em] text-primary mb-3">
				Promptathon in Yuva Kaushal | 2026
			</p>
			<h2 className="text-4xl font-poppins font-bold mb-4">
				Promptathon 2026 - A Grand Success! ⚡
			</h2>
			<p className="text-muted-foreground max-w-3xl mx-auto mb-4">
				Presented by Lamrin Tech Skills University Punjab and DevNest. Promptathon was a unique AI prompt engineering competition where words became the ultimate weapon. This was not about speed or code – it was about pure thinking power and the ability to communicate with AI effectively.
			</p>
			<div className="max-w-2xl mx-auto mt-6 p-6 bg-primary/10 rounded-2xl border border-primary/30">
				<h3 className="text-xl font-bold mb-3 text-primary">PROMPT SMARTER. THINK DEEPER. DOMINATE LOUDER.</h3>
				<p className="text-muted-foreground italic">
					"Students crafted prompts that pushed AI past the obvious. Those who <strong>ASKED BETTER</strong>, <strong>WON</strong>."
				</p>
			</div>
		</div>

		<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
			{promptathonFacts.map((fact) => (
				<div
					key={fact.label}
					className="glass-effect rounded-2xl border border-border/40 p-5 text-left"
				>
					<p className="text-sm text-muted-foreground mb-1">{fact.label}</p>
					<p className="font-semibold text-lg">{fact.value}</p>
				</div>
			))}
		</div>

		<div className="grid gap-6 lg:grid-cols-2">
			<div className="glass-effect rounded-3xl border border-border/40 p-6">
				<div className="flex items-center gap-2 mb-4">
					<CheckCircle2 className="w-5 h-5 text-primary" />
					<h3 className="text-xl font-semibold">What Happened?</h3>
				</div>
				<ul className="space-y-3 text-muted-foreground">
					{whatsInStoreList.map((item) => (
						<li key={item} className="flex items-start gap-2">
							<span className="text-primary mt-1">•</span>
							<span>{item}</span>
						</li>
					))}
				</ul>
			</div>

			<div className="glass-effect rounded-3xl border border-border/40 p-6">
				<div className="flex items-center gap-2 mb-4">
					<ShieldCheck className="w-5 h-5 text-secondary" />
					<h3 className="text-xl font-semibold">Event Highlights</h3>
				</div>
				<ul className="space-y-3 text-muted-foreground">
					{whyJoinList.map((item) => (
						<li key={item} className="flex items-start gap-2">
							<span className="text-secondary mt-1">•</span>
							<span>{item}</span>
						</li>
					))}
				</ul>
			</div>
		</div>

		<div className="glass-effect rounded-3xl border border-border/40 p-6">
			<h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
				<Sparkles className="w-5 h-5 text-primary" />
				Contact & Support
			</h3>
			<div className="grid gap-4 md:grid-cols-2 mb-4">
				<div className="p-4 bg-primary/10 rounded-lg">
					<p className="text-sm text-muted-foreground mb-1">Student Coordinator</p>
					<p className="font-semibold text-lg">{STUDENT_COORDINATOR}</p>
				</div>
				<div className="p-4 bg-secondary/10 rounded-lg">
					<p className="text-sm text-muted-foreground mb-1">Faculty Coordinator</p>
					<p className="font-semibold text-lg">{FACULTY_COORDINATOR}</p>
				</div>
			</div>
			<div className="flex flex-wrap gap-3 mb-4">
				<Button asChild variant="outline">
					<Link href={WHATSAPP_GROUP_LINK} target="_blank" rel="noreferrer">
						Join WhatsApp Community
					</Link>
				</Button>
				<Button asChild variant="outline">
					<Link href="/events">
						View All Events
					</Link>
				</Button>
				<Button asChild variant="ghost">
					<Link href={`mailto:${CONTACT_EMAILS[0]}`}>
						Have a question? Email us
					</Link>
				</Button>
			</div>
			<p className="text-sm text-muted-foreground">
				For queries, reach us at {CONTACT_EMAILS[0]}.
			</p>
		</div>

		{/* Event Poster Section */}
		<div className="glass-effect rounded-3xl border border-border/40 p-6">
			<h3 className="text-xl font-semibold mb-4 text-center">Event Poster</h3>
			<div className="max-w-3xl mx-auto">
				<div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-primary/20 to-background border border-border">
					<Image
						src="/events/promptathon/poster.jpg"
						alt="Promptathon Event Poster"
						width={768}
						height={1024}
						className="w-full h-auto"
						priority
					/>
				</div>
			</div>
		</div>
	</section>
);
