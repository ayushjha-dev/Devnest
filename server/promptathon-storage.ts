import { initializeFirebaseAdmin } from "../src/lib/firebase-admin";

export type PromptatonSubmissionRecord = {
	submittedAt: string;
	fullName: string;
	rollNumber: string;
	department: string;
	whatsappNumber: string;
	email: string;
	participationType: "individual" | "team";
	teamName: string;
	teamMember2: string;
	teamMember2Roll: string;
	transactionId: string;
	notes: string;
};

const normalizeRoll = (roll?: string | null) => roll?.trim().toLowerCase() ?? "";

export const getExistingRollConflicts = async (rolls: string[]) => {
	const { adminDb } = initializeFirebaseAdmin();

	const normalizedIncoming = new Set(
		rolls.map(normalizeRoll).filter((roll) => roll.length > 0),
	);

	if (normalizedIncoming.size === 0) {
		return [];
	}

	try {
		const submissionsRef = adminDb.collection("promptathon-submissions");
		const snapshot = await submissionsRef.get();
		const conflicts = new Set<string>();

		snapshot.forEach((doc) => {
			const data = doc.data();
			const existingRolls = [
				data.rollNumber,
				data.teamMember2Roll,
			]
				.map(normalizeRoll)
				.filter((roll) => roll.length > 0);

			existingRolls.forEach((roll) => {
				if (normalizedIncoming.has(roll)) {
					conflicts.add(roll);
				}
			});
		});

		return Array.from(conflicts);
	} catch (error) {
		console.error("Error checking roll conflicts:", error);
		throw new Error("Failed to check roll conflicts");
	}
};

export const appendPromptatonSubmission = async (record: PromptatonSubmissionRecord) => {
	const { adminDb } = initializeFirebaseAdmin();

	try {
		const submissionsRef = adminDb.collection("promptathon-submissions");
		await submissionsRef.add({
			...record,
			createdAt: new Date().toISOString(),
		});
	} catch (error) {
		console.error("Error saving submission:", error);
		throw new Error("Failed to save submission");
	}
};
