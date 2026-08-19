import type { NextApiRequest, NextApiResponse } from "next";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

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
    const { name, email } = req.body;

    console.log("Registration request received:", { name, email });

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    // Initialize Firestore
    const db = initAdmin();

    // Check if user already exists
    const usersRef = db.collection("arcade_users");
    const q = usersRef.where("email", "==", email);
    const existingUsers = await q.get();

    let userId;
    let userData;

    if (existingUsers.empty) {
      // Create new user
      userData = {
        name,
        email,
        totalXp: 0,
        gamesPlayed: 0,
        registeredAt: new Date().toISOString(),
      };
      const docRef = await usersRef.add(userData);
      userId = docRef.id;
      console.log("New user created:", userId);
    } else {
      // User already exists
      userId = existingUsers.docs[0].id;
      userData = existingUsers.docs[0].data();
      console.log("Existing user found:", userId);
    }

    res.status(200).json({
      message: "Registration successful",
      userId,
      user: userData,
    });
  } catch (error) {
    console.error("Registration error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    
    res.status(500).json({ 
      message: "Internal server error",
      error: errorMessage,
    });
  }
}
