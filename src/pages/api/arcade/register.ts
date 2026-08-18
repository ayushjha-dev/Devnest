import type { NextApiRequest, NextApiResponse } from "next";

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

    // Try to use Firebase, but don't fail if it's not configured
    try {
      // Import Firebase dynamically
      const { db } = await import("@/lib/firebase");
      const { collection, addDoc, query, where, getDocs } = await import("firebase/firestore");
      
      console.log("Attempting Firebase connection...");
      
      if (!db) {
        throw new Error("Firebase not initialized");
      }

      const usersRef = collection(db, "arcade_users");
      const q = query(usersRef, where("email", "==", email));
      const existingUsers = await getDocs(q);

      let userId;
      let userData;

      if (existingUsers.empty) {
        userData = {
          name,
          email,
          totalXp: 0,
          gamesPlayed: 0,
          registeredAt: new Date().toISOString(),
        };
        const docRef = await addDoc(usersRef, userData);
        userId = docRef.id;
        console.log("New user created in Firebase:", userId);
      } else {
        userId = existingUsers.docs[0].id;
        userData = existingUsers.docs[0].data();
        console.log("Existing user found in Firebase:", userId);
      }

      return res.status(200).json({
        message: "Registration successful",
        userId,
        user: userData,
      });
    } catch (firebaseError) {
      console.error("Firebase error (will continue without it):", firebaseError);
      
      // Firebase not available - return success anyway with a generated ID
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const userData = {
        name,
        email,
        totalXp: 0,
        gamesPlayed: 0,
        registeredAt: new Date().toISOString(),
      };

      console.log("User registered without Firebase:", userId);

      return res.status(200).json({
        message: "Registration successful (Firebase not configured)",
        userId,
        user: userData,
        warning: "Data will not be persisted. Please configure Firebase.",
      });
    }
  } catch (error) {
    console.error("Registration error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const errorStack = error instanceof Error ? error.stack : "";
    
    console.error("Error stack:", errorStack);
    
    res.status(500).json({ 
      message: "Internal server error",
      error: errorMessage,
      details: process.env.NODE_ENV === "development" ? errorStack : undefined,
    });
  }
}
