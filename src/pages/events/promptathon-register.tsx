import Link from "next/link";
import { ArrowLeft, CheckCircle, Sparkles } from "lucide-react";

import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";

export default function PromptatonRegistrationPage() {
	return (
		<Layout>
			<div className="min-h-screen bg-gradient-to-b from-background to-muted/40 py-16">
				<div className="mx-auto max-w-4xl px-4 sm:px-6">
					<div className="mb-8">
						<Link
							href="/events/promptathon"
							className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
						>
							<ArrowLeft className="w-4 h-4" />
							Back to Event Details
						</Link>
					</div>

					<div className="glass-effect rounded-3xl border border-border/40 p-12 text-center">
						<div className="mb-6">
							<div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 mb-4">
								<CheckCircle className="w-10 h-10 text-primary" />
							</div>
							<h1 className="text-4xl font-poppins font-bold mb-4 flex items-center justify-center gap-3">
								<Sparkles className="w-8 h-8 text-primary" />
								Event Successfully Completed!
								<Sparkles className="w-8 h-8 text-primary" />
							</h1>
							<p className="text-xl text-muted-foreground mb-2">
								Promptathon 2026 - Registration Closed
							</p>
							<p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
								Thank you for your interest! Promptathon 2026 was a grand success with over 100 participants showcasing exceptional AI prompt engineering skills. The event has concluded, and registrations are now closed.
							</p>
						</div>

						<div className="glass-effect rounded-2xl border border-primary/30 bg-primary/5 p-6 mb-8 max-w-2xl mx-auto">
							<h2 className="text-xl font-semibold mb-3 text-primary">Event Highlights</h2>
							<ul className="text-left space-y-2 text-muted-foreground">
								<li className="flex items-start gap-2">
									<span className="text-primary mt-1">✓</span>
									<span>68 students participated in the competition</span>
								</li>
								<li className="flex items-start gap-2">
									<span className="text-primary mt-1">✓</span>
									<span>Exceptional AI prompt engineering skills demonstrated</span>
								</li>
								<li className="flex items-start gap-2">
									<span className="text-primary mt-1">✓</span>
									<span>Pure thinking power and critical thinking showcased</span>
								</li>
								<li className="flex items-start gap-2">
									<span className="text-primary mt-1">✓</span>
									<span>Expert mentorship and real-time feedback provided</span>
								</li>
							</ul>
						</div>

						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Button asChild size="lg" className="gap-2">
								<Link href="/events/promptathon">
									View Event Details
								</Link>
							</Button>
							<Button asChild variant="outline" size="lg">
								<Link href="/events">
									Browse Other Events
								</Link>
							</Button>
						</div>

						<p className="text-sm text-muted-foreground mt-8">
							Stay tuned for future events and competitions! Follow us for updates.
						</p>
					</div>
				</div>
			</div>
		</Layout>
	);
}
