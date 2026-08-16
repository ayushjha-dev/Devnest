import { Layout } from "@/components/Layout";
import { ArrowLeft, Calendar, User, ImageIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import ShinyText from "@/components/ShinyText";
import Shuffle from "@/components/Shuffle";

export default function GuestSpeakerFebPage() {

	return (
		<Layout>
			<div className="min-h-screen py-16">
				<div className="mx-auto max-w-4xl px-4 sm:px-6">
					<div className="mb-8">
						<Button asChild variant="ghost" className="gap-2">
							<Link href="/events">
								<ArrowLeft className="h-4 w-4" />
								Back to Events
							</Link>
						</Button>
					</div>

					{/* Event Header */}
					<div className="glass-effect rounded-3xl border border-border/50 p-8 mb-8 text-center">
						<div className="inline-block px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 text-green-600 text-sm font-semibold mb-4">
							<Calendar className="inline-block w-4 h-4 mr-1" />
							Event Completed • 5th February 2026
						</div>
						<h1 className="text-4xl sm:text-5xl font-poppins font-bold mb-4">
							<Shuffle text="Guest Speaker Event" />
						</h1>
						<p className="text-muted-foreground max-w-2xl mx-auto">
							Thank you to everyone who attended our inspiring session with <span className="font-semibold text-foreground">Amit Kumar Jaiswal</span>, IIM Bangalore graduate and founder of <span className="font-semibold text-foreground">aptitude360online</span>. Check out the event highlights below!
						</p>
					</div>

					{/* Event Gallery */}
					<div className="glass-effect rounded-3xl border border-border/50 p-8 mb-8">
						<div className="text-center mb-6">
							<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 text-secondary text-sm font-semibold mb-4">
								<ImageIcon className="w-4 h-4" />
								Event Gallery
							</div>
							<h2 className="text-2xl sm:text-3xl font-poppins font-bold mb-2">
								<ShinyText text="Event Highlights" speed={2} />
							</h2>
							<p className="text-muted-foreground">
								Capturing the moments from our guest speaker session
							</p>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{[
								{ src: "/events/guest-speaker-feb/image.png", alt: "Guest Speaker Event - Session" },
								{ src: "/events/guest-speaker-feb/image1.png", alt: "Guest Speaker Event - Audience" },
								{ src: "/events/guest-speaker-feb/image2.png", alt: "Guest Speaker Event - Interaction" },
								{ src: "/events/guest-speaker-feb/image3.png", alt: "Guest Speaker Event - Q&A" },
								{ src: "/events/guest-speaker-feb/image4.png", alt: "Guest Speaker Event - Group Photo" },
							].map((image, index) => (
								<div
									key={index}
									className={`relative overflow-hidden rounded-xl border border-border/50 hover:border-primary/50 transition-all hover:scale-[1.02] ${index === 4 ? "md:col-span-2" : ""
										}`}
								>
									<div className="aspect-video relative bg-muted">
										<Image
											src={image.src}
											alt={image.alt}
											fill
											className="object-cover"
										/>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Event Details */}
					<div className="glass-effect rounded-3xl border border-border/50 bg-background/80 p-8 shadow-2xl">
						<h2 className="text-2xl sm:text-3xl font-poppins font-bold mb-6 text-center">About the Event</h2>
						<div className="grid gap-4 sm:grid-cols-2">
							<div className="flex items-start gap-3">
								<Calendar className="w-5 h-5 text-primary mt-0.5" />
								<div>
									<p className="font-medium">Date & Time</p>
									<p className="text-sm text-muted-foreground">
										5th February 2026
									</p>
								</div>
							</div>
							<div className="flex items-start gap-3">
								<User className="w-5 h-5 text-primary mt-0.5" />
								<div>
									<p className="font-medium">Speaker</p>
									<p className="text-sm text-muted-foreground">
										Amit Kumar Jaiswal<br />
										<span className="text-xs">IIM Bangalore Graduate • aptitude360online</span>
									</p>
								</div>
							</div>
						</div>
						<p className="text-sm text-muted-foreground mt-4">
							For any queries, contact us at devnest.techclub@gmail.com
						</p>
					</div>
				</div>
			</div>
		</Layout>
	);
}

