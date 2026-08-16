import { initializeFirebaseAdmin } from "../src/lib/firebase-admin";

export type GuestSpeakerRegistrationRecord = {
	submittedAt: string;
	name: string;
	rollNumber: string;
	class: string;
	phoneNumber: string;
	email: string;
};

export const appendGuestSpeakerRegistration = async (
	record: GuestSpeakerRegistrationRecord,
) => {
	const { adminDb } = initializeFirebaseAdmin();

	try {
		const registrationsRef = adminDb.collection("guest-speaker-registrations");
		await registrationsRef.add({
			...record,
			createdAt: new Date().toISOString(),
		});
	} catch (error) {
		console.error("Error saving guest speaker registration:", error);
		throw new Error("Failed to save registration");
	}
};

export const getGuestSpeakerRegistrations = async (): Promise<GuestSpeakerRegistrationRecord[]> => {
	const { adminDb } = initializeFirebaseAdmin();

	try {
		const registrationsRef = adminDb.collection("guest-speaker-registrations");
		const snapshot = await registrationsRef.get();

		return snapshot.docs.map((doc) => {
			const data = doc.data();
			return {
				submittedAt: data.submittedAt,
				name: data.name,
				rollNumber: data.rollNumber,
				class: data.class,
				phoneNumber: data.phoneNumber,
				email: data.email,
			};
		});
	} catch (error) {
		console.error("Error fetching guest speaker registrations:", error);
		throw new Error("Failed to fetch registrations");
	}
};
