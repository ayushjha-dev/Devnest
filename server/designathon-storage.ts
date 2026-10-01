import fs from "fs";
import path from "path";
import { initializeFirebaseAdmin } from "../src/lib/firebase-admin";

export type DesignathonTrack = "ui-ux" | "backend" | "fullstack";

export interface DesignathonTeammate {
  name: string;
  rollNumber: string;
  branch: string;
  sem: string;
  phone: string;
  email: string;
}

export interface DesignathonRegistration {
  id: string;
  teamName: string;
  teamSize: number; // 1 to 4
  fullName: string; // Leader Name
  rollNumber: string;
  branch: string;
  sem: string;
  phone: string;
  email: string;
  teammates?: DesignathonTeammate[];
  venue: string;
  college?: string;
  year?: string;
  semester?: string;
  trackOrFocus?: DesignathonTrack;
  figmaOrPortfolioUrl?: string;
  githubUrl?: string;
  projectIdea?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
}

export interface DesignathonStats {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
  soloCount: number;
  teamCount: number;
}

const COLLECTION_NAME = "designathon_registrations";
const LOCAL_STORAGE_DIR = path.join(process.cwd(), "data");
const LOCAL_STORAGE_FILE = path.join(LOCAL_STORAGE_DIR, "designathon_registrations.json");

function ensureLocalFile(): void {
  try {
    if (!fs.existsSync(LOCAL_STORAGE_DIR)) {
      fs.mkdirSync(LOCAL_STORAGE_DIR, { recursive: true });
    }
    if (!fs.existsSync(LOCAL_STORAGE_FILE)) {
      fs.writeFileSync(LOCAL_STORAGE_FILE, JSON.stringify([], null, 2), "utf8");
    }
  } catch (e) {
    console.warn("[Designathon Storage] Could not initialize local data file:", e);
  }
}

function readLocalRegistrations(): DesignathonRegistration[] {
  try {
    ensureLocalFile();
    if (fs.existsSync(LOCAL_STORAGE_FILE)) {
      const data = fs.readFileSync(LOCAL_STORAGE_FILE, "utf8");
      return JSON.parse(data) || [];
    }
  } catch (e) {
    console.warn("[Designathon Storage] Read local file error:", e);
  }
  return [];
}

function writeLocalRegistrations(records: DesignathonRegistration[]): void {
  try {
    ensureLocalFile();
    fs.writeFileSync(LOCAL_STORAGE_FILE, JSON.stringify(records, null, 2), "utf8");
  } catch (e) {
    console.warn("[Designathon Storage] Write local file error:", e);
  }
}

function cleanRecord<T extends Record<string, any>>(record: T): T {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(record)) {
    if (value !== undefined) {
      result[key] = value;
    }
  }
  return result as T;
}

export function computeDesignathonStats(records: DesignathonRegistration[]): DesignathonStats {
  return {
    total: records.length,
    approved: records.filter((r) => r.status === "approved").length,
    pending: records.filter((r) => r.status === "pending").length,
    rejected: records.filter((r) => r.status === "rejected").length,
    soloCount: records.filter((r) => r.teamSize === 1).length,
    teamCount: records.filter((r) => r.teamSize > 1).length,
  };
}

export async function getAllDesignathonRegistrations(): Promise<DesignathonRegistration[]> {
  try {
    const { adminDb } = initializeFirebaseAdmin();
    if (adminDb) {
      const colRef = adminDb.collection(COLLECTION_NAME);
      let snapshot;
      try {
        snapshot = await colRef.orderBy("createdAt", "desc").get();
      } catch {
        snapshot = await colRef.get();
      }

      const records: DesignathonRegistration[] = [];
      snapshot.forEach((doc) => {
        records.push({ id: doc.id, ...doc.data() } as DesignathonRegistration);
      });

      if (records.length > 0) {
        records.sort(
          (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        );
        writeLocalRegistrations(records);
        return records;
      }
    }
  } catch (err: unknown) {
    console.warn("[Designathon Storage] Firestore query fallback to local cache:", err);
  }

  const local = readLocalRegistrations();
  return local.sort(
    (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
  );
}

export async function getDesignathonRegistrationsAndStats(): Promise<{
  registrations: DesignathonRegistration[];
  stats: DesignathonStats;
}> {
  const registrations = await getAllDesignathonRegistrations();
  const stats = computeDesignathonStats(registrations);
  return { registrations, stats };
}

export async function getDesignathonStats(): Promise<DesignathonStats> {
  const { stats } = await getDesignathonRegistrationsAndStats();
  return stats;
}

export async function createDesignathonRegistration(
  data: Omit<DesignathonRegistration, "id" | "status" | "createdAt" | "updatedAt">
): Promise<DesignathonRegistration> {
  if (!data.teamName?.trim()) {
    throw new Error("Team Name is required.");
  }
  if (!data.fullName?.trim()) {
    throw new Error("Full name is required.");
  }
  if (!data.rollNumber?.trim()) {
    throw new Error("Roll number is required.");
  }
  if (!data.branch?.trim()) {
    throw new Error("Branch is required.");
  }
  if (!data.sem?.trim()) {
    throw new Error("Semester is required.");
  }
  if (!data.phone?.trim()) {
    throw new Error("Phone number is required.");
  }
  if (!data.email?.trim() || !data.email.includes("@")) {
    throw new Error("Valid email address is required.");
  }

  const teamSize = Number(data.teamSize) || 1;
  const venue = data.venue?.trim() || "IBM Lab, LTSU Punjab";
  const now = new Date().toISOString();
  const id = `designathon_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  const newRecord: DesignathonRegistration = {
    ...data,
    teamSize,
    venue,
    id,
    status: "pending",
    createdAt: now,
    updatedAt: now,
  };

  const cleanedRecord = cleanRecord(newRecord);

  try {
    const { adminDb } = initializeFirebaseAdmin();
    if (adminDb) {
      await adminDb.collection(COLLECTION_NAME).doc(cleanedRecord.id).set(cleanedRecord);
    }
  } catch (err) {
    console.warn("[Designathon Storage] Failed to persist to Firestore, saving to local disk:", err);
  }

  const localList = readLocalRegistrations();
  localList.unshift(cleanedRecord);
  writeLocalRegistrations(localList);

  return cleanedRecord;
}

export async function updateDesignathonStatus(
  id: string,
  status: "pending" | "approved" | "rejected"
): Promise<DesignathonRegistration | null> {
  const now = new Date().toISOString();
  let updatedRecord: DesignathonRegistration | null = null;

  try {
    const { adminDb } = initializeFirebaseAdmin();
    if (adminDb) {
      const docRef = adminDb.collection(COLLECTION_NAME).doc(id);
      const doc = await docRef.get();
      if (doc.exists) {
        await docRef.update({ status, updatedAt: now });
        updatedRecord = { id: doc.id, ...doc.data(), status, updatedAt: now } as DesignathonRegistration;
      }
    }
  } catch (err) {
    console.warn("[Designathon Storage] Firestore update error:", err);
  }

  const localList = readLocalRegistrations();
  const idx = localList.findIndex((r) => r.id === id);
  if (idx !== -1) {
    localList[idx].status = status;
    localList[idx].updatedAt = now;
    writeLocalRegistrations(localList);
    if (!updatedRecord) updatedRecord = localList[idx];
  }

  return updatedRecord;
}

export async function deleteDesignathonRegistration(id: string): Promise<boolean> {
  let deleted = false;

  try {
    const { adminDb } = initializeFirebaseAdmin();
    if (adminDb) {
      await adminDb.collection(COLLECTION_NAME).doc(id).delete();
      deleted = true;
    }
  } catch (err) {
    console.warn("[Designathon Storage] Firestore delete error:", err);
  }

  const localList = readLocalRegistrations();
  const filtered = localList.filter((r) => r.id !== id);
  if (filtered.length !== localList.length) {
    writeLocalRegistrations(filtered);
    deleted = true;
  }

  return deleted;
}
