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

    // Check if user already exists
    const usersRef = collection(db, "arcade_users");
    const q = query(usersRef, where("email", "==", email));
    const existingUsers = await getDocs(q);

    let userId;

    if (existingUsers.empty) {
      // Create new user
      const docRef = await addDoc(usersRef, {
        name,
        email,
        totalXp: 0,
        gamesPlayed: 0,
        registeredAt: new Date().toISOString(),
      });
      userId = docRef.id;
    } else {
      // User already exists
      userId = existingUsers.docs[0].id;
    }

    res.status(200).json({
      message: "Registration successful",
      userId,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
