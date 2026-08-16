import fs from "fs";
import path from "path";

import Head from "next/head";
import Image from "next/image";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Link from "next/link";

import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type PromptathonCertificatePageProps = {
	slug: string;
	teamName: string;
	memberName: string;
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

export default function PromptathonCertificatePage({
	slug,
	teamName,
	memberName,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const certificateUrl = `/certificates/promptathon/${slug}.png`;

	return (
		<Layout>
			<Head>
				<title>DevNest | Promptathon Certificate</title>
			</Head>

			<div className="min-h-screen bg-background py-8 sm:py-12">
				<div className="mx-auto max-w-7xl px-4 sm:px-6">
					<div className="mb-6 flex flex-wrap items-center justify-between gap-3">
						<div>
							<p className="text-sm uppercase tracking-[0.25em] text-muted-foreground">Promptathon certificate</p>
							<h1 className="mt-1 text-3xl font-poppins font-bold sm:text-4xl">{memberName}</h1>
							<p className="mt-2 text-muted-foreground">Team {teamName}</p>
						</div>

						<div className="flex flex-wrap gap-3">
							<Button asChild variant="outline">
								<Link href="/certificates/promptathon">Back to teams</Link>
							</Button>
							<Button asChild>
								<a href={certificateUrl} download>
									Download PNG
								</a>
							</Button>
						</div>
					</div>

					<Card className="overflow-hidden rounded-3xl border border-border/50 bg-black shadow-2xl">
						<div className="relative min-h-[70vh] w-full bg-black">
							<Image
								src={certificateUrl}
								alt={`${memberName} promptathon certificate`}
								fill
								priority
								sizes="100vw"
								className="object-contain"
							/>
						</div>
					</Card>
				</div>
			</div>
		</Layout>
	);
}

export const getServerSideProps: GetServerSideProps<PromptathonCertificatePageProps> = async ({
	params,
}) => {
	const slug = typeof params?.slug === "string" ? params.slug : "";

	if (!slug) {
		return { notFound: true };
	}

	const certificatePath = path.join(CERTIFICATE_DIR, `${slug}.png`);

	if (!fs.existsSync(certificatePath)) {
		return { notFound: true };
	}

	const decodedFileName = decodePromptathonSlug(slug);
	const { teamName, memberName } = splitTeamAndMember(decodedFileName);

	return {
		props: {
			slug,
			teamName,
			memberName,
		},
	};
};