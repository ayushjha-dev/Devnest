import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  QueryConstraint,
} from "firebase/firestore";
import { db } from "../firebase";

// Member interface for TypeScript
export interface Member {
  id?: string;
  // Personal Information
  fullName: string;
  email: string;
  phone: string;
  enrollmentNumber: string;
  branch: string;
  year: string;
  semester: string;
  
  // Club Information
  membershipType: "regular" | "core" | "alumni";
  joiningDate: Date | Timestamp;
  interests: string[];
  skills: string[];
  
  // Social Links (optional)
  linkedin?: string;
  github?: string;
  portfolio?: string;
  
  // Status
  status: "active" | "inactive";
  
  // Metadata
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
}

const MEMBERS_COLLECTION = "members";

/**
 * Add a new member to the database
 */
export async function addMember(memberData: Omit<Member, "id" | "createdAt" | "updatedAt">): Promise<string> {
  try {
    const now = Timestamp.now();
    const newMember = {
      ...memberData,
      joiningDate: memberData.joiningDate instanceof Date 
        ? Timestamp.fromDate(memberData.joiningDate)
        : memberData.joiningDate,
      createdAt: now,
      updatedAt: now,
    };
    
    const docRef = await addDoc(collection(db, MEMBERS_COLLECTION), newMember);
    return docRef.id;
  } catch (error) {
    console.error("Error adding member:", error);
    throw new Error("Failed to add member");
  }
}

/**
 * Get all members from the database
 */
export async function getAllMembers(): Promise<Member[]> {
  try {
    const membersCol = collection(db, MEMBERS_COLLECTION);
    const memberSnapshot = await getDocs(query(membersCol, orderBy("createdAt", "desc")));
    
    return memberSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Member[];
  } catch (error) {
    console.error("Error getting members:", error);
    throw new Error("Failed to fetch members");
  }
}

/**
 * Get a single member by ID
 */
export async function getMemberById(memberId: string): Promise<Member | null> {
  try {
    const memberDoc = doc(db, MEMBERS_COLLECTION, memberId);
    const memberSnapshot = await getDoc(memberDoc);
    
    if (memberSnapshot.exists()) {
      return {
        id: memberSnapshot.id,
        ...memberSnapshot.data(),
      } as Member;
    }
    return null;
  } catch (error) {
    console.error("Error getting member:", error);
    throw new Error("Failed to fetch member");
  }
}

/**
 * Get member by enrollment number
 */
export async function getMemberByEnrollment(enrollmentNumber: string): Promise<Member | null> {
  try {
    const membersCol = collection(db, MEMBERS_COLLECTION);
    const q = query(membersCol, where("enrollmentNumber", "==", enrollmentNumber));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data(),
      } as Member;
    }
    return null;
  } catch (error) {
    console.error("Error getting member by enrollment:", error);
    throw new Error("Failed to fetch member");
  }
}

/**
 * Get member by email
 */
export async function getMemberByEmail(email: string): Promise<Member | null> {
  try {
    const membersCol = collection(db, MEMBERS_COLLECTION);
    const q = query(membersCol, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data(),
      } as Member;
    }
    return null;
  } catch (error) {
    console.error("Error getting member by email:", error);
    throw new Error("Failed to fetch member");
  }
}

/**
 * Get members by membership type
 */
export async function getMembersByType(membershipType: "regular" | "core" | "alumni"): Promise<Member[]> {
  try {
    const membersCol = collection(db, MEMBERS_COLLECTION);
    const q = query(membersCol, where("membershipType", "==", membershipType), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Member[];
  } catch (error) {
    console.error("Error getting members by type:", error);
    throw new Error("Failed to fetch members");
  }
}

/**
 * Get active members only
 */
export async function getActiveMembers(): Promise<Member[]> {
  try {
    const membersCol = collection(db, MEMBERS_COLLECTION);
    const q = query(membersCol, where("status", "==", "active"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Member[];
  } catch (error) {
    console.error("Error getting active members:", error);
    throw new Error("Failed to fetch active members");
  }
}

/**
 * Update member information
 */
export async function updateMember(
  memberId: string,
  updates: Partial<Omit<Member, "id" | "createdAt">>
): Promise<void> {
  try {
    const memberDoc = doc(db, MEMBERS_COLLECTION, memberId);
    await updateDoc(memberDoc, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating member:", error);
    throw new Error("Failed to update member");
  }
}

/**
 * Delete a member
 */
export async function deleteMember(memberId: string): Promise<void> {
  try {
    const memberDoc = doc(db, MEMBERS_COLLECTION, memberId);
    await deleteDoc(memberDoc);
  } catch (error) {
    console.error("Error deleting member:", error);
    throw new Error("Failed to delete member");
  }
}

/**
 * Get member statistics
 */
export async function getMemberStats(): Promise<{
  total: number;
  active: number;
  inactive: number;
  regular: number;
  core: number;
  alumni: number;
}> {
  try {
    const allMembers = await getAllMembers();
    
    return {
      total: allMembers.length,
      active: allMembers.filter((m) => m.status === "active").length,
      inactive: allMembers.filter((m) => m.status === "inactive").length,
      regular: allMembers.filter((m) => m.membershipType === "regular").length,
      core: allMembers.filter((m) => m.membershipType === "core").length,
      alumni: allMembers.filter((m) => m.membershipType === "alumni").length,
    };
  } catch (error) {
    console.error("Error getting member stats:", error);
    throw new Error("Failed to fetch member statistics");
  }
}

/**
 * Search members by name or enrollment number
 */
export async function searchMembers(searchTerm: string): Promise<Member[]> {
  try {
    const allMembers = await getAllMembers();
    const lowerSearch = searchTerm.toLowerCase();
    
    return allMembers.filter(
      (member) =>
        member.fullName.toLowerCase().includes(lowerSearch) ||
        member.enrollmentNumber.toLowerCase().includes(lowerSearch) ||
        member.email.toLowerCase().includes(lowerSearch)
    );
  } catch (error) {
    console.error("Error searching members:", error);
    throw new Error("Failed to search members");
  }
}
