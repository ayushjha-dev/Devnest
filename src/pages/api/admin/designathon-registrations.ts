import type { NextApiRequest, NextApiResponse } from "next";
import { isAuthenticatedAdmin } from "../../../lib/admin-auth";
import {
  getDesignathonRegistrationsAndStats,
  getDesignathonStats,
  createDesignathonRegistration,
  updateDesignathonStatus,
  deleteDesignathonRegistration,
} from "../../../../server/designathon-storage";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!isAuthenticatedAdmin(req)) {
    return res.status(401).json({
      error: "Unauthorized: Admin session is missing or expired. Please log in at /admin/devnest.",
    });
  }

  // GET: Retrieve all Designathon registrations and stats
  if (req.method === "GET") {
    try {
      const { registrations, stats } = await getDesignathonRegistrationsAndStats();
      return res.status(200).json({ registrations, stats });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error fetching registrations";
      console.error("[API admin/designathon-registrations] Fetch error:", error);
      return res.status(500).json({ error: message });
    }
  }

  // POST: Admin manual registration
  if (req.method === "POST") {
    try {
      const data = req.body;
      if (!data.fullName || !data.email || !data.phone || !data.rollNumber || !data.teamName) {
        return res.status(400).json({ error: "Missing required fields for registration." });
      }

      const registration = await createDesignathonRegistration({
        teamName: data.teamName.trim(),
        teamSize: Number(data.teamSize) || 1,
        fullName: data.fullName.trim(),
        rollNumber: data.rollNumber.trim(),
        branch: data.branch?.trim() || "CSE",
        sem: (data.sem || data.semester || "1st Sem").trim(),
        phone: data.phone.trim(),
        email: data.email.trim().toLowerCase(),
        teammates: Array.isArray(data.teammates) ? data.teammates : [],
        venue: "IBM Lab, LTSU Punjab",
      });

      // If status explicitly passed
      if (data.status && data.status !== "pending") {
        await updateDesignathonStatus(registration.id, data.status);
      }

      const { registrations, stats } = await getDesignathonRegistrationsAndStats();
      return res.status(201).json({ success: true, registration, registrations, stats });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error adding participant";
      return res.status(500).json({ error: message });
    }
  }

  // PATCH: Update status
  if (req.method === "PATCH") {
    try {
      const { id, status } = req.body;
      if (!id || !["pending", "approved", "rejected"].includes(status)) {
        return res.status(400).json({ error: "Invalid parameters for status update." });
      }

      const updated = await updateDesignathonStatus(id, status);
      if (!updated) {
        return res.status(404).json({ error: "Registration record not found." });
      }

      const stats = await getDesignathonStats();
      return res.status(200).json({ success: true, registration: updated, stats });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error updating status";
      return res.status(500).json({ error: message });
    }
  }

  // DELETE: Remove registration
  if (req.method === "DELETE") {
    try {
      const { id } = req.query;
      if (!id || typeof id !== "string") {
        return res.status(400).json({ error: "Missing or invalid registration id." });
      }

      const deleted = await deleteDesignathonRegistration(id);
      if (!deleted) {
        return res.status(404).json({ error: "Registration record not found." });
      }

      const stats = await getDesignathonStats();
      return res.status(200).json({ success: true, message: "Registration deleted successfully.", stats });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error deleting registration";
      return res.status(500).json({ error: message });
    }
  }

  res.setHeader("Allow", ["GET", "POST", "PATCH", "DELETE"]);
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}
