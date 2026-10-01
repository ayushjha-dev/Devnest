import type { NextApiRequest, NextApiResponse } from "next";
import { createDesignathonRegistration } from "../../../../server/designathon-storage";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const {
      teamName,
      teamSize,
      fullName,
      rollNumber,
      branch,
      sem,
      semester,
      phone,
      email,
      teammates,
    } = req.body;

    if (!teamName || typeof teamName !== "string" || !teamName.trim()) {
      return res.status(400).json({ error: "Team Name is required." });
    }

    if (!fullName || typeof fullName !== "string" || !fullName.trim()) {
      return res.status(400).json({ error: "Leader Name is required." });
    }

    if (!rollNumber || typeof rollNumber !== "string" || !rollNumber.trim()) {
      return res.status(400).json({ error: "Roll Number is required." });
    }

    if (!branch || typeof branch !== "string" || !branch.trim()) {
      return res.status(400).json({ error: "Branch is required." });
    }

    const resolvedSem = (sem || semester || "").toString().trim();
    if (!resolvedSem) {
      return res.status(400).json({ error: "Semester (Sem) is required." });
    }

    if (!phone || typeof phone !== "string" || !phone.trim()) {
      return res.status(400).json({ error: "Phone number is required." });
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return res.status(400).json({ error: "A valid Email address is required." });
    }

    const parsedTeamSize = Math.max(1, Math.min(4, Number(teamSize) || 1));

    // Validate teammates if teamSize > 1
    const cleanedTeammates = [];
    if (parsedTeamSize > 1 && Array.isArray(teammates)) {
      for (let i = 0; i < parsedTeamSize - 1; i++) {
        const tm = teammates[i];
        if (!tm?.name?.trim() || !tm?.rollNumber?.trim() || !tm?.branch?.trim() || !tm?.sem?.trim() || !tm?.phone?.trim() || !tm?.email?.trim()) {
          return res.status(400).json({
            error: `Please fill all required details (Name, Roll No., Branch, Sem, Phone, Email) for Teammate #${i + 2}.`,
          });
        }
        cleanedTeammates.push({
          name: tm.name.trim(),
          rollNumber: tm.rollNumber.trim(),
          branch: tm.branch.trim(),
          sem: tm.sem.trim(),
          phone: tm.phone.trim(),
          email: tm.email.trim().toLowerCase(),
        });
      }
    }

    const registration = await createDesignathonRegistration({
      teamName: teamName.trim(),
      teamSize: parsedTeamSize,
      fullName: fullName.trim(),
      rollNumber: rollNumber.trim(),
      branch: branch.trim(),
      sem: resolvedSem,
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      teammates: cleanedTeammates,
      venue: "IBM Lab, LTSU Punjab",
    });

    return res.status(201).json({
      success: true,
      message: "Registration for Designathon received successfully!",
      registration,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error processing registration";
    console.error("[API events/designathon-register] Error:", error);
    return res.status(500).json({ error: message });
  }
}
