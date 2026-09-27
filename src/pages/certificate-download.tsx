import Head from "next/head";
import { Layout } from "@/components/Layout";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Download, Sparkles } from "lucide-react";

const EVENT_MAP: Record<string, string> = {
	"prarambh-2026": "Prarambh 2026: Tech Quiz & Capture The Flag (CTF)",
};

function cipherFileName(eventName: string, rollNumber: string, name: string): string {
	const fileNameBase = `${eventName}-${rollNumber}-${name}`.toLowerCase();
	const base64 = btoa(unescape(encodeURIComponent(fileNameBase)));
	const base64url = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
	return base64url;
}

export default function CertificateDownloadPage() {
	const [eventName, setEventName] = useState("prarambh-2026");
	const [name, setName] = useState("");
	const [rollNumber, setRollNumber] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!eventName || !name || !rollNumber) {
			alert("Please fill in all details");
			return;
		}

		const cipheredFileName = cipherFileName(eventName, rollNumber, name);
		const certificateUrl = `/certificates/${cipheredFileName}.png`;

		window.open(certificateUrl, "_blank");
	};

	return (
		<Layout>
			<Head>
				<title>DevNest | Download Verified Certificate</title>
				<meta
					name="description"
					content="Retrieve and download your official DevNest participation and winner certificates."
				/>
			</Head>

			<div className="min-h-screen py-16 sm:py-24">
				<div className="mx-auto max-w-xl px-4 sm:px-6">
					<div className="text-center mb-10">
						<div className="mb-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-semibold tracking-wide uppercase">
							<Sparkles className="w-3.5 h-3.5 text-primary" />
							<span>Verified Credentials</span>
						</div>

						<h1 className="text-3xl sm:text-4xl md:text-5xl font-poppins font-bold tracking-tight mb-3 text-foreground">
							Download <span className="text-gradient-primary">Certificate</span>
						</h1>

						<p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
							Enter your registered details to verify your participation and generate your official DevNest credentials.
						</p>
					</div>

					<div className="glass-panel rounded-3xl border border-border/80 p-6 sm:p-10 shadow-premium">
						<form onSubmit={handleSubmit} className="space-y-5">
							<div>
								<Label htmlFor="name" className="text-xs font-semibold text-foreground">
									Full Name (as registered) *
								</Label>
								<Input
									id="name"
									type="text"
									value={name}
									onChange={(e) => setName(e.target.value)}
									placeholder="e.g. Alex Morgan"
									required
									className="mt-1.5 h-11 rounded-xl border-border/80 bg-background/60 shadow-subtle focus:border-primary/50 text-sm"
								/>
							</div>

							<div>
								<Label htmlFor="rollNumber" className="text-xs font-semibold text-foreground">
									University Roll / Enrollment Number *
								</Label>
								<Input
									id="rollNumber"
									type="text"
									value={rollNumber}
									onChange={(e) => setRollNumber(e.target.value)}
									placeholder="e.g. 241000100001"
									required
									className="mt-1.5 h-11 rounded-xl border-border/80 bg-background/60 shadow-subtle focus:border-primary/50 text-sm"
								/>
							</div>

							<div>
								<Label htmlFor="eventName" className="text-xs font-semibold text-foreground">
									Event *
								</Label>
								<Select value={eventName} onValueChange={setEventName} required>
									<SelectTrigger id="eventName" className="mt-1.5 h-11 rounded-xl border-border/80 bg-background/60 shadow-subtle focus:border-primary/50 text-sm">
										<SelectValue placeholder="Select an event" />
									</SelectTrigger>
									<SelectContent className="rounded-xl border border-border/80 bg-card/95 backdrop-blur shadow-premium">
										{Object.entries(EVENT_MAP).map(([id, displayName]) => (
											<SelectItem key={id} value={id} className="text-xs sm:text-sm">
												{displayName}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<Button
								type="submit"
								className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm shadow-subtle hover:shadow-glow-primary active:scale-98 transition-all gap-2"
							>
								<Download className="h-4 w-4" />
								<span>Download Official Certificate</span>
							</Button>
						</form>
					</div>
				</div>
			</div>
		</Layout>
	);
}
