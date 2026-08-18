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

    // Generate a unique user ID
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const userData = {
      name,
      email,
      totalXp: 0,
      gamesPlayed: 0,
      registeredAt: new Date().toISOString(),
    };

    console.log("User registered successfully:", userId);

    // Return success - data will be stored in localStorage on client
    return res.status(200).json({
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
