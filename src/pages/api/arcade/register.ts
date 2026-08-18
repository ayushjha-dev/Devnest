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

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    // Import Firebase dynamically only on server
    const { initializeApp, getApps, cert } = await import("firebase-admin/app");
    const { getFirestore } = await import("firebase-admin/firestore");

    // Initialize Firebase Admin SDK
    let adminDb;
    try {
      if (getApps().length === 0) {
        // Try to initialize with service account
        const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
        if (serviceAccount) {
          const serviceAccountJson = JSON.parse(serviceAccount);
          initializeApp({
            credential: cert(serviceAccountJson),
          });
        } else {
          // Fallback: Use client SDK for server-side
          const { db } = await import("@/lib/firebase");
          const { collection, addDoc, query, where, getDocs } = await import("firebase/firestore");
          
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
          } else {
            userId = existingUsers.docs[0].id;
            userData = existingUsers.docs[0].data();
          }

          return res.status(200).json({
            message: "Registration successful",
            userId,
            user: userData,
          });
        }
      }

      adminDb = getFirestore();
    } catch (adminError) {
      console.error("Firebase Admin initialization failed:", adminError);
      // Fallback to client SDK
      const { db } = await import("@/lib/firebase");
      const { collection, addDoc, query, where, getDocs } = await import("firebase/firestore");
      
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
      } else {
        userId = existingUsers.docs[0].id;
        userData = existingUsers.docs[0].data();
      }

      return res.status(200).json({
        message: "Registration successful",
        userId,
        user: userData,
      });
    }

    // Check if user already exists (Admin SDK)
    const usersRef = adminDb.collection("arcade_users");
    const existingUsers = await usersRef.where("email", "==", email).get();

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
    res.status(500).json({ 
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
}
