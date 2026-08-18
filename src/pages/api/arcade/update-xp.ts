import type { NextApiRequest, NextApiResponse } from "next";

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

    // Try Firebase Admin first, fallback to client SDK
    try {
      const { getApps, initializeApp, cert } = await import("firebase-admin/app");
      const { getFirestore, FieldValue } = await import("firebase-admin/firestore");

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

      // Find user by email
      const usersRef = adminDb.collection("arcade_users");
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

      return res.status(200).json({
        message: "XP updated successfully",
        totalXp: updatedData?.totalXp || 0,
        gamesPlayed: updatedData?.gamesPlayed || 0,
      });
    } catch (adminError) {
      console.log("Admin SDK failed, using client SDK:", adminError);
      
      // Fallback to client SDK
      const { db } = await import("@/lib/firebase");
      const { collection, query, where, getDocs, updateDoc, doc, increment } = await import("firebase/firestore");

      const usersRef = collection(db, "arcade_users");
      const q = query(usersRef, where("email", "==", email));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        return res.status(404).json({ message: "User not found. Please register first." });
      }

      const userDoc = snapshot.docs[0];
      const userRef = doc(db, "arcade_users", userDoc.id);
      
      await updateDoc(userRef, {
        totalXp: increment(xpEarned),
        gamesPlayed: increment(1),
        lastPlayedAt: new Date().toISOString(),
        lastGameId: gameId || "unknown",
      });

      const updatedSnapshot = await getDocs(q);
      const updatedData = updatedSnapshot.docs[0].data();

      console.log(`Updated XP for ${email}: +${xpEarned} (Total: ${updatedData.totalXp})`);

      return res.status(200).json({
        message: "XP updated successfully",
        totalXp: updatedData.totalXp,
        gamesPlayed: updatedData.gamesPlayed,
      });
    }
  } catch (error) {
    console.error("Update XP error:", error);
    res.status(500).json({ 
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
}
