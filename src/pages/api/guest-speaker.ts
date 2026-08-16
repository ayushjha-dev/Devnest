import type { NextApiRequest, NextApiResponse } from "next";

import {
	appendGuestSpeakerRegistration,
	type GuestSpeakerRegistrationRecord,
} from "../../../server/guest-speaker-storage";

const requiredFields: Array<keyof GuestSpeakerRegistrationRecord> = [
	"submittedAt",
	"name",
	"rollNumber",
	"class",
	"phoneNumber",
	"email",
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== "POST") {
		res.setHeader("Allow", "POST");
		return res.status(405).json({ message: "Method not allowed" });
	}

	const payload = req.body as Partial<GuestSpeakerRegistrationRecord>;

	const missing = requiredFields.filter((field) => {
		const value = payload[field];
		return typeof value === "undefined" || value === null || value === "";
	});

	if (missing.length > 0) {
		return res.status(400).json({
			message: `Missing required fields: ${missing.join(", ")}`,
		});
	}

	try {
		const record: GuestSpeakerRegistrationRecord = {
			submittedAt: payload.submittedAt!,
			name: payload.name!,
			rollNumber: payload.rollNumber!,
			class: payload.class!,
			phoneNumber: payload.phoneNumber!,
			email: payload.email!,
		};

		await appendGuestSpeakerRegistration(record);

		return res.status(200).json({
			success: true,
			message: "Registration submitted successfully",
		});
	} catch (error) {
		console.error("Error processing registration:", error);
		return res.status(500).json({
			message: "Failed to process registration",
		});
	}
}
