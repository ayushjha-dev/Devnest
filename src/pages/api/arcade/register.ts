import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/firebase";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    // Check if Firebase is configured
    if (!db) {
      console.error("Firebase not initialized");
      return res.status(500).json({ message: "Database not configured" });
    }

    // Check if user already exists
    const usersRef = collection(db, "arcade_users");
    const q = query(usersRef, where("email", "==", email));
    const existingUsers = await getDocs(q);

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
      const docRef = await addDoc(usersRef, userData);
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
    res.status(500).json({ 
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
}
