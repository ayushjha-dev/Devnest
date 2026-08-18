import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, updateDoc, doc, increment } from "firebase/firestore";

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

    // Check if Firebase is configured
    if (!db) {
      console.error("Firebase not initialized");
      return res.status(500).json({ message: "Database not configured" });
    }

    // Find user by email
    const usersRef = collection(db, "arcade_users");
    const q = query(usersRef, where("email", "==", email));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return res.status(404).json({ message: "User not found. Please register first." });
    }

    // Update user's XP and games played
    const userDoc = snapshot.docs[0];
    const userRef = doc(db, "arcade_users", userDoc.id);
    
    await updateDoc(userRef, {
      totalXp: increment(xpEarned),
      gamesPlayed: increment(1),
      lastPlayedAt: new Date().toISOString(),
      lastGameId: gameId || "unknown",
    });

    // Get updated user data
    const updatedSnapshot = await getDocs(q);
    const updatedData = updatedSnapshot.docs[0].data();

    console.log(`Updated XP for ${email}: +${xpEarned} (Total: ${updatedData.totalXp})`);

    res.status(200).json({
      message: "XP updated successfully",
      totalXp: updatedData.totalXp,
      gamesPlayed: updatedData.gamesPlayed,
    });
  } catch (error) {
    console.error("Update XP error:", error);
    res.status(500).json({ 
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
}
