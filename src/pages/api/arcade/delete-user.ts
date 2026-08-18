import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Check if Firebase is configured
    if (!db) {
      console.error("Firebase not initialized");
      return res.status(500).json({ message: "Database not configured" });
    }

    // Delete user document
    const userRef = doc(db, "arcade_users", userId);
    await deleteDoc(userRef);

    console.log(`Deleted user: ${userId}`);

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ 
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
}
