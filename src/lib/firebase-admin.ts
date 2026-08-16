import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import { getStorage, Storage } from "firebase-admin/storage";

let adminApp: App;
let adminDb: Firestore;
let adminStorage: Storage;

const initializeFirebaseAdmin = () => {
	if (getApps().length === 0) {
		// Initialize with service account credentials
		let serviceAccount;

		if (process.env.FIREBASE_SERVICE_ACCOUNT) {
			try {
				serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
			} catch (error) {
				const message =
					error instanceof Error ? error.message : String(error);
				throw new Error(
					`FIREBASE_SERVICE_ACCOUNT environment variable contains invalid JSON: ${message}`,
				);
			}
		} else {
			serviceAccount = undefined;
		}
		if (!serviceAccount) {
			throw new Error(
				"FIREBASE_SERVICE_ACCOUNT environment variable is not set or invalid",
			);
		}

		adminApp = initializeApp({
			credential: cert(serviceAccount),
			storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
		});
	} else {
		adminApp = getApps()[0];
	}

	adminDb = getFirestore(adminApp);
	adminStorage = getStorage(adminApp);

	return { adminApp, adminDb, adminStorage };
};

export { initializeFirebaseAdmin };
