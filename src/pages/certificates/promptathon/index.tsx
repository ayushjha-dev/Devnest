import fs from "fs";
import path from "path";

import Head from "next/head";
import Link from "next/link";
import type { GetStaticProps, InferGetStaticPropsType } from "next";

import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

type PromptathonMember = {
	slug: string;
	fileName: string;
	teamName: string;
	memberName: string;
	certificateUrl: string;
};

type PromptathonTeam = {
	teamName: string;
	members: PromptathonMember[];
};

type PromptathonCertificatePortalProps = {
	teams: PromptathonTeam[];
};

const CERTIFICATE_DIR = path.join(process.cwd(), "public", "certificates", "promptathon");

function decodePromptathonSlug(slug: string) {
	const normalized = slug.replace(/-/g, "+").replace(/_/g, "/");
	const padding = (4 - (normalized.length % 4)) % 4;
	return Buffer.from(`${normalized}${"=".repeat(padding)}`, "base64").toString("utf8");
}

function splitTeamAndMember(decodedFileName: string) {
	const separatorIndex = decodedFileName.indexOf("-");

	if (separatorIndex === -1) {
		return {
			teamName: decodedFileName,
			memberName: decodedFileName,
		};
	}

	return {
		teamName: decodedFileName.slice(0, separatorIndex),
		memberName: decodedFileName.slice(separatorIndex + 1),
	};
}

function buildPromptathonTeams() {
	if (!fs.existsSync(CERTIFICATE_DIR)) {
		return [];
	}

	const members = fs
		.readdirSync(CERTIFICATE_DIR)
		.filter((fileName) => fileName.toLowerCase().endsWith(".png"))
		.map((fileName) => {
			const slug = fileName.replace(/\.png$/i, "");
			const decodedFileName = decodePromptathonSlug(slug);
			const { teamName, memberName } = splitTeamAndMember(decodedFileName);

			return {
				slug,
				fileName,
				teamName,
				memberName,
				certificateUrl: `/certificates/promptathon/${fileName}`,
			};
		})
		.sort((left, right) => {
			const teamComparison = left.teamName.localeCompare(right.teamName);

			if (teamComparison !== 0) {
				return teamComparison;
			}

			return left.memberName.localeCompare(right.memberName);
		});

	return members.reduce<PromptathonTeam[]>((teams, member) => {
		const existingTeam = teams[teams.length - 1];

		if (existingTeam && existingTeam.teamName === member.teamName) {
			existingTeam.members.push(member);
			return teams;
		}

		teams.push({
			teamName: member.teamName,
			members: [member],
		});

		return teams;
	}, []);
}

export const getStaticProps: GetStaticProps<PromptathonCertificatePortalProps> = async () => {
	return {
		props: {
			teams: buildPromptathonTeams(),
		},
	};
};

export default function PromptathonCertificatePortalPage({
	teams,
}: InferGetStaticPropsType<typeof getStaticProps>) {
	return (
		<Layout>
			<Head>
				<title>DevNest | Promptathon Certificates</title>
			</Head>

			<div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/40 py-16">
				<div className="mx-auto max-w-6xl px-4 sm:px-6">
					<div className="mb-10 text-center">
						<Badge className="border border-primary/40 bg-primary/15 px-4 py-2 text-sm font-semibold text-primary">
							Promptathon Certificate Portal
						</Badge>
						<h1 className="mt-4 text-4xl font-poppins font-bold sm:text-5xl">
							Choose your team, then open a member certificate
						</h1>
						<p className="mx-auto mt-3 max-w-3xl text-muted-foreground">
							Each certificate lives at /certificates/promptathon/filename.png. Pick a team card, then click a member to view and download the PNG.
						</p>
					</div>

					{teams.length === 0 ? (
						<Card className="mx-auto max-w-2xl rounded-3xl border border-border/50 bg-background/80 p-8 text-center shadow-2xl">
							<p className="text-lg font-semibold">No promptathon certificates found.</p>
							<p className="mt-2 text-sm text-muted-foreground">
								Add PNG files to public/certificates/promptathon to populate this portal.
							</p>
						</Card>
					) : (
						<div className="grid gap-6 lg:grid-cols-2">
							{teams.map((team) => (
								<Card key={team.teamName} className="rounded-3xl border border-border/50 bg-background/85 p-6 shadow-2xl backdrop-blur">
									<div className="mb-5 flex items-start justify-between gap-4">
										<div>
											<p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Team</p>
											<h2 className="mt-1 text-2xl font-poppins font-bold">{team.teamName}</h2>
										</div>
										<Badge variant="secondary" className="rounded-full px-3 py-1 text-xs font-semibold">
											{team.members.length} member{team.members.length === 1 ? "" : "s"}
										</Badge>
									</div>

									<div className="space-y-3">
										{team.members.map((member) => (
											<Link
												key={member.slug}
												href={`/certificates/promptathon/${encodeURIComponent(member.slug)}`}
												className="flex items-center justify-between rounded-2xl border border-border/60 bg-muted/30 px-4 py-3 transition-colors hover:border-primary/40 hover:bg-primary/5"
											>
												<div>
													<p className="font-semibold">{member.memberName}</p>
													<p className="text-sm text-muted-foreground">Open certificate</p>
												</div>
												<span className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1 text-sm font-medium text-foreground">
													View
												</span>
											</Link>
										))}
									</div>
								</Card>
							))}
						</div>
					)}
				</div>
			</div>
		</Layout>
	);
}