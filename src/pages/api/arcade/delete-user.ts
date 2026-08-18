import type { NextApiRequest, NextApiResponse } from "next";

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

    // Try Firebase Admin first, fallback to client SDK
    try {
      const { getApps, initializeApp, cert } = await import("firebase-admin/app");
      const { getFirestore } = await import("firebase-admin/firestore");

      let adminDb;
      if (getApps().length === 0) {
        const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
        if (serviceAccount) {
          const serviceAccountJson = JSON.parse(serviceAccount);
          initializeApp({
            credential: cert(serviceAccountJson),
          });
        } else {
          throw new Error("No Firebase Admin credentials");
        }
      }

      adminDb = getFirestore();

      // Delete user document
      await adminDb.collection("arcade_users").doc(userId).delete();

      console.log(`Deleted user: ${userId}`);

      return res.status(200).json({
        message: "User deleted successfully",
      });
    } catch (adminError) {
      console.log("Admin SDK failed, using client SDK:", adminError);
      
      // Fallback to client SDK
      const { db } = await import("@/lib/firebase");
      const { deleteDoc, doc } = await import("firebase/firestore");

      const userRef = doc(db, "arcade_users", userId);
      await deleteDoc(userRef);

      console.log(`Deleted user: ${userId}`);

      return res.status(200).json({
        message: "User deleted successfully",
      });
    }
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ 
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
}
