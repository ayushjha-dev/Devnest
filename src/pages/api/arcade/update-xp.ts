import type { NextApiRequest, NextApiResponse } from "next";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

// Initialize Firebase Admin
function initAdmin() {
  if (getApps().length === 0) {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (projectId && clientEmail && privateKey) {
      initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
    } else {
      throw new Error("Firebase Admin credentials not configured");
    }
  }
  return getFirestore();
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { email, xpEarned, gameId } = req.body;

    if (!email || xpEarned === undefined) {
      return res.status(400).json({ message: "Email and xpEarned are required" });
    }

    // Initialize Firestore
    const db = initAdmin();

    // Find user by email
    const usersRef = db.collection("arcade_users");
    const snapshot = await usersRef.where("email", "==", email).get();

    if (snapshot.empty) {
      return res.status(404).json({ message: "User not found. Please register first." });
    }

    // Update user's XP
    const userDoc = snapshot.docs[0];
    await userDoc.ref.update({
      totalXp: FieldValue.increment(xpEarned),
      gamesPlayed: FieldValue.increment(1),
      lastPlayedAt: new Date().toISOString(),
      lastGameId: gameId || "unknown",
    });

    // Get updated data
    const updatedDoc = await userDoc.ref.get();
    const updatedData = updatedDoc.data();

    console.log(`Updated XP for ${email}: +${xpEarned} (Total: ${updatedData?.totalXp})`);

    res.status(200).json({
      message: "XP updated successfully",
      totalXp: updatedData?.totalXp || 0,
      gamesPlayed: updatedData?.gamesPlayed || 0,
    });
  } catch (error) {
    console.error("Update XP error:", error);
    res.status(500).json({ 
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
}

