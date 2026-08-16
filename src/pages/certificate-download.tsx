import Head from "next/head";
import { Layout } from "@/components/Layout";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Download, FileCheck } from "lucide-react";

const EVENT_MAP: Record<string, string> = {
	"aptitude360online-guest": "February Guest Speaker",
};

function cipherFileName(eventName: string, rollNumber: string, name: string): string {
	const fileNameBase = `${eventName}-${rollNumber}-${name}`.toLowerCase();
	const base64 = btoa(unescape(encodeURIComponent(fileNameBase)));
	const base64url = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
	return base64url;
}

export default function CertificateDownloadPage() {
	const [eventName, setEventName] = useState("aptitude360online-guest");
	const [name, setName] = useState("");
	const [rollNumber, setRollNumber] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!eventName || !name || !rollNumber) {
			alert("Please fill all fields");
			return;
		}

		const cipheredFileName = cipherFileName(eventName, rollNumber, name);
		const certificateUrl = `/certificates/${cipheredFileName}.png`;

		window.open(certificateUrl, "_blank");
	};

	return (
		<Layout>
			<Head><title>DevNest | Certificate Download</title></Head>
			<div className="min-h-screen bg-gradient-to-b from-background to-muted/40 py-16">
				<div className="mx-auto max-w-2xl px-4 sm:px-6">
					<div className="text-center mb-8">
						<div className="inline-block px-4 py-2 rounded-full bg-primary/15 border border-primary/40 text-primary text-sm font-semibold mb-4 shadow-sm">
							<FileCheck className="inline-block w-4 h-4 mr-1" />
							Certificate Download
						</div>
						<h1 className="text-4xl sm:text-5xl font-poppins font-bold mb-4">
							Download Your Certificate
						</h1>
						<p className="text-muted-foreground max-w-2xl mx-auto">
							Enter your details to download your participation certificate
						</p>
					</div>

					<Card className="glass-effect rounded-3xl border border-border/50 bg-background/80 p-8 shadow-2xl">
						<form onSubmit={handleSubmit} className="space-y-6">
							<div>
								<Label htmlFor="name">Full Name</Label>
								<Input
									id="name"
									type="text"
									value={name}
									onChange={(e) => setName(e.target.value)}
									placeholder="John Doe"
									required
								/>
							</div>

							<div>
								<Label htmlFor="rollNumber">Roll Number</Label>
								<Input
									id="rollNumber"
									type="text"
									value={rollNumber}
									onChange={(e) => setRollNumber(e.target.value)}
									placeholder="241000X00XX"
									required
								/>
							</div>

							<div>
								<Label htmlFor="eventName">Event</Label>
								<Select value={eventName} onValueChange={setEventName} required>
									<SelectTrigger id="eventName">
										<SelectValue placeholder="Select an event" />
									</SelectTrigger>
									<SelectContent>
										{Object.entries(EVENT_MAP).map(([id, displayName]) => (
											<SelectItem key={id} value={id}>
												{displayName}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<Button type="submit" className="w-full gap-2">
								<Download className="h-4 w-4" />
								Download Certificate
							</Button>
						</form>

						<div className="mt-6 pt-6 border-t border-border/60">
							<p className="text-sm text-muted-foreground text-center">
								Make sure to enter your details exactly as you registered.
								The certificate will open in a new tab.
							</p>
						</div>
					</Card>
				</div>
			</div>
		</Layout>
	);
}
