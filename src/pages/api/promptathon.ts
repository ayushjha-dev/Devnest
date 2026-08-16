import type { NextApiRequest, NextApiResponse } from "next";

import {
	appendPromptatonSubmission,
	getExistingRollConflicts,
	type PromptatonSubmissionRecord,
} from "../../../server/promptathon-storage";

const requiredFields: Array<keyof PromptatonSubmissionRecord> = [
	"fullName",
	"rollNumber",
	"department",
	"whatsappNumber",
	"email",
	"participationType",
	"transactionId",
];

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	if (req.method !== "POST") {
		return res.status(405).json({ message: "Method not allowed" });
	}

	try {
		const payload = req.body as Partial<PromptatonSubmissionRecord>;

		// Validate required fields
		const missingFields = requiredFields.filter(
			(field) => !payload[field] || String(payload[field]).trim() === "",
		);

		if (missingFields.length > 0) {
			return res.status(400).json({
				message: `Missing required fields: ${missingFields.join(", ")}`,
			});
		}

		// Validate team fields if participating as team
		if (payload.participationType === "team") {
			const teamFields = ["teamName", "teamMember2", "teamMember2Roll"];
			const missingTeamFields = teamFields.filter(
				(field) => !payload[field as keyof PromptatonSubmissionRecord] ||
					String(payload[field as keyof PromptatonSubmissionRecord]).trim() === "",
			);

			if (missingTeamFields.length > 0) {
				return res.status(400).json({
					message: `Missing team fields: ${missingTeamFields.join(", ")}`,
				});
			}
		}

		// Collect all roll numbers to check for conflicts
		const rollsToCheck = [payload.rollNumber!];
		if (payload.participationType === "team" && payload.teamMember2Roll) {
			rollsToCheck.push(payload.teamMember2Roll);
		}

		const conflicts = await getExistingRollConflicts(rollsToCheck);

		if (conflicts.length > 0) {
			return res.status(409).json({
				message: "One or more roll numbers are already registered",
				conflicts,
			});
		}

		const record: PromptatonSubmissionRecord = {
			submittedAt: new Date().toISOString(),
			fullName: payload.fullName!,
			rollNumber: payload.rollNumber!,
			department: payload.department!,
			whatsappNumber: payload.whatsappNumber!,
			email: payload.email!,
			participationType: payload.participationType!,
			teamName: payload.teamName || "",
			teamMember2: payload.teamMember2 || "",
			teamMember2Roll: payload.teamMember2Roll || "",
			transactionId: payload.transactionId!,
			notes: payload.notes || "",
		};

		await appendPromptatonSubmission(record);

		return res.status(200).json({ message: "Registration successful" });
	} catch (error) {
		console.error("Promptathon API error", error);
		return res.status(500).json({ message: "Internal server error" });
	}
}
