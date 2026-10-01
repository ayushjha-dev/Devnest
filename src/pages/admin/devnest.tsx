import { useEffect, useState, useMemo } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Shield,
  ShieldCheck,
  Lock,
  Users,
  UserCheck,
  Clock,
  Sparkles,
  Search,
  Filter,
  ArrowUpDown,
  Download,
  RefreshCw,
  LogOut,
  Eye,
  Trash2,
  Mail,
  Phone,
  ExternalLink,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Calendar,
  GraduationCap,
  Building2,
  Code2,
  Loader2,
  ChevronRight,
  Brain,
  Flag,
  Trophy,
  Check,
  MapPin,
  X,
  FileSpreadsheet,
} from "lucide-react";
import type { MemberRecord, MemberStats } from "../../../server/members-storage";
import type {
  PrarambhRegistration,
  PrarambhStats,
  AcademicYear,
  CompetitionTrack,
} from "../../../server/prarambh-storage";
import { AdminMessagesView } from "@/components/admin/AdminMessagesView";
import type { MessageRecord, MessageStats } from "../../../server/messages-storage";
import {
  exportToExcel,
  exportMultiSheetExcel,
  exportOfficialAttendanceExcel,
  exportBlankAttendanceFormat,
  OfficialAttendanceParticipant,
  AttendanceTeamSlot,
  AttendanceTeamMember,
} from "@/lib/excel-export";

export default function AdminDevnestPage() {
  // Navigation tabs: 'prarambh', 'members', or 'messages'
  const [adminTab, setAdminTab] = useState<"prarambh" | "members" | "messages">("prarambh");

  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  // DevNest Members Data states
  const [members, setMembers] = useState<MemberRecord[]>([]);
  const [stats, setStats] = useState<MemberStats | null>(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [dataError, setDataError] = useState("");

  // DevNest Members Filter & Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [branchFilter, setBranchFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "name">("newest");

  // DevNest Members Selection & Action states
  const [selectedMember, setSelectedMember] = useState<MemberRecord | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Prarambh Registrations Data states
  const [prarambhRegistrations, setPrarambhRegistrations] = useState<PrarambhRegistration[]>([]);
  const [prarambhStats, setPrarambhStats] = useState<PrarambhStats | null>(null);
  const [prarambhLoading, setPrarambhLoading] = useState(false);
  const [prarambhError, setPrarambhError] = useState("");

  // Prarambh Filter & Search states
  const [prarambhSearchQuery, setPrarambhSearchQuery] = useState("");
  const [prarambhTrackFilter, setPrarambhTrackFilter] = useState<string>("all");
  const [prarambhStatusFilter, setPrarambhStatusFilter] = useState<string>("all");

  // Prarambh Selection & Action states
  const [selectedPrarambh, setSelectedPrarambh] = useState<PrarambhRegistration | null>(null);
  const [prarambhActionLoadingId, setPrarambhActionLoadingId] = useState<string | null>(null);
  const [deletePrarambhConfirmId, setDeletePrarambhConfirmId] = useState<string | null>(null);
  const [adminApplyModalOpen, setAdminApplyModalOpen] = useState(false);
  // Active Event Name & Date (Automatically reflected on the official Attendance Excel top header)
  const [currentEventName, setCurrentEventName] = useState<string>("Prarambh");
  const [currentEventDate, setCurrentEventDate] = useState<string>("23rd September 2026");

  const handleEventNameChange = (val: string) => {
    setCurrentEventName(val);
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("devnest_admin_event_name", val);
      }
    } catch {}
  };

  const handleEventDateChange = (val: string) => {
    setCurrentEventDate(val);
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("devnest_admin_event_date", val);
      }
    } catch {}
  };

  // Contact Messages Data states
  const [messages, setMessages] = useState<MessageRecord[]>([]);
  const [messagesStats, setMessagesStats] = useState<MessageStats | null>(null);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState("");
  const [messageActionLoadingId, setMessageActionLoadingId] = useState<string | null>(null);

  // Check initial session
  useEffect(() => {
    // Clear legacy registration caches to avoid stale records like "Manish"
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("devnest_admin_prarambh_cache");
        localStorage.removeItem("devnest_registered_prarambh");

        const cachedMembers = JSON.parse(localStorage.getItem("devnest_admin_members_cache") || "[]");
        if (Array.isArray(cachedMembers) && cachedMembers.length > 0) {
          setMembers(cachedMembers);
        }
        const cachedMessages = JSON.parse(localStorage.getItem("devnest_admin_messages_cache") || "[]");
        if (Array.isArray(cachedMessages) && cachedMessages.length > 0) {
          setMessages(cachedMessages);
        }
        const savedEventName = localStorage.getItem("devnest_admin_event_name");
        if (savedEventName) {
          setCurrentEventName(savedEventName);
        }
        const savedEventDate = localStorage.getItem("devnest_admin_event_date");
        if (savedEventDate) {
          setCurrentEventDate(savedEventDate);
        }
      }
    } catch {}

    async function checkSession() {
      try {
        const res = await fetch("/api/admin/session");
        const data = await res.json();
        setIsAuthenticated(!!data.authenticated);
        if (data.authenticated) {
          fetchMembers();
          fetchPrarambhRegistrations();
          fetchMessages();
        }
      } catch {
        setIsAuthenticated(false);
      }
    }
    checkSession();
  }, []);

  // Fetch protected members data
  const fetchMembers = async () => {
    setDataLoading(true);
    setDataError("");
    try {
      const res = await fetch("/api/admin/members");
      if (res.status === 401) {
        setIsAuthenticated(false);
        return;
      }
      if (!res.ok) {
        throw new Error("Failed to load membership data");
      }
      const data = await res.json();
      const list = data.members || [];
      setMembers(list);
      setStats(data.stats || null);
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem("devnest_admin_members_cache", JSON.stringify(list));
        }
      } catch {}
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error loading data";
      setDataError(message);
    } finally {
      setDataLoading(false);
    }
  };

  const computePrarambhStats = (list: PrarambhRegistration[]): PrarambhStats => {
    return {
      total: list.length,
      techQuizFreshers: list.filter((r) => r.competition === "tech-quiz").length,
      ctf2ndYear: list.filter((r) => r.competition === "ctf-2nd-year").length,
      ctf3rdYear: list.filter((r) => r.competition === "ctf-3rd-year").length,
      approved: list.filter((r) => r.status === "approved").length,
      pending: list.filter((r) => r.status === "pending").length,
      rejected: list.filter((r) => r.status === "rejected").length,
    };
  };

  // Fetch protected Prarambh registrations data strictly from backend API
  const fetchPrarambhRegistrations = async () => {
    setPrarambhLoading(true);
    setPrarambhError("");
    try {
      const res = await fetch("/api/admin/prarambh-registrations");
      if (res.status === 401) {
        setIsAuthenticated(false);
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to load Prarambh registrations");
      }
      const data = await res.json();
      const list = Array.isArray(data.registrations) ? data.registrations : [];
      setPrarambhRegistrations(list);
      if (data.stats) {
        setPrarambhStats(data.stats);
      } else {
        setPrarambhStats(computePrarambhStats(list));
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Error loading registrations";
      setPrarambhError(message);
    } finally {
      setPrarambhLoading(false);
    }
  };

  // Update Prarambh registration status
  const handleUpdatePrarambhStatus = async (
    id: string,
    status: "pending" | "approved" | "rejected"
  ) => {
    setPrarambhActionLoadingId(id);
    try {
      const res = await fetch("/api/admin/prarambh-registrations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to update status");
      }
      const data = await res.json();
      setPrarambhRegistrations((prev) =>
        prev.map((r) => (r.id === id ? data.registration : r))
      );
      if (data.stats) setPrarambhStats(data.stats);
      if (selectedPrarambh?.id === id) {
        setSelectedPrarambh(data.registration);
      }
    } catch (err: unknown) {
      console.error("Error updating Prarambh registration status:", err);
      setPrarambhError(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setPrarambhActionLoadingId(null);
    }
  };

  // Delete Prarambh registration
  const handleDeletePrarambh = async (id: string) => {
    setPrarambhActionLoadingId(id);
    try {
      const res = await fetch(`/api/admin/prarambh-registrations?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to delete record");
      }
      const data = await res.json();
      setPrarambhRegistrations((prev) => prev.filter((r) => r.id !== id));
      if (data.stats) setPrarambhStats(data.stats);
      setDeletePrarambhConfirmId(null);
      if (selectedPrarambh?.id === id) {
        setSelectedPrarambh(null);
      }
    } catch (err: unknown) {
      console.error("Error deleting Prarambh registration:", err);
      setPrarambhError(err instanceof Error ? err.message : "Failed to delete record");
    } finally {
      setPrarambhActionLoadingId(null);
    }
  };

  // Handle Admin Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    setLoginLoading(true);
    setLoginError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.error || "Incorrect password. Access denied.");
        return;
      }

      setIsAuthenticated(true);
      setPassword("");
      fetchMembers();
      fetchPrarambhRegistrations();
      fetchMessages();
    } catch {
      setLoginError("Connection failed. Please verify server is running.");
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle Admin Logout
  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } finally {
      setIsAuthenticated(false);
      setMembers([]);
      setStats(null);
      setPrarambhRegistrations([]);
      setPrarambhStats(null);
      setMessages([]);
      setMessagesStats(null);
    }
  };

  // Update member status
  const handleStatusChange = async (id: string, newStatus: "active" | "pending" | "inactive") => {
    setActionLoadingId(id);
    try {
      const res = await fetch("/api/admin/members", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        const data = await res.json();
        setMembers((prev) =>
          prev.map((m) => (m.id === id ? { ...m, status: newStatus } : m))
        );
        if (selectedMember && selectedMember.id === id) {
          setSelectedMember((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
        if (data.stats) setStats(data.stats);
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Delete member
  const handleDeleteMember = async (id: string) => {
    setActionLoadingId(id);
    try {
      const res = await fetch("/api/admin/members", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        const data = await res.json();
        setMembers((prev) => prev.filter((m) => m.id !== id));
        if (selectedMember && selectedMember.id === id) {
          setSelectedMember(null);
        }
        setDeleteConfirmId(null);
        if (data.stats) setStats(data.stats);
      }
    } catch (error) {
      console.error("Failed to delete member:", error);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Fetch protected contact messages
  const fetchMessages = async () => {
    setMessagesLoading(true);
    setMessagesError("");
    try {
      const res = await fetch("/api/admin/messages");
      if (res.status === 401) {
        setIsAuthenticated(false);
        return;
      }
      if (!res.ok) {
        throw new Error("Failed to load contact messages");
      }
      const data = await res.json();
      const list = data.messages || [];
      setMessages(list);
      setMessagesStats(data.stats || null);
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem("devnest_admin_messages_cache", JSON.stringify(list));
        }
      } catch {}
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error loading messages";
      setMessagesError(message);
    } finally {
      setMessagesLoading(false);
    }
  };

  // Update contact message status
  const handleUpdateMessageStatus = async (
    id: string,
    status: "unread" | "read" | "replied"
  ) => {
    setMessageActionLoadingId(id);
    try {
      const res = await fetch("/api/admin/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => {
          const updated = prev.map((m) => (m.id === id ? { ...m, status } : m));
          try {
            if (typeof window !== "undefined") {
              localStorage.setItem("devnest_admin_messages_cache", JSON.stringify(updated));
            }
          } catch {}
          return updated;
        });
        if (data.stats) setMessagesStats(data.stats);
      }
    } catch (error) {
      console.error("Failed to update message status:", error);
    } finally {
      setMessageActionLoadingId(null);
    }
  };

  // Delete contact message
  const handleDeleteMessage = async (id: string) => {
    setMessageActionLoadingId(id);
    try {
      const res = await fetch(`/api/admin/messages?id=${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => {
          const updated = prev.filter((m) => m.id !== id);
          try {
            if (typeof window !== "undefined") {
              localStorage.setItem("devnest_admin_messages_cache", JSON.stringify(updated));
            }
          } catch {}
          return updated;
        });
        if (data.stats) setMessagesStats(data.stats);
      }
    } catch (error) {
      console.error("Failed to delete message:", error);
    } finally {
      setMessageActionLoadingId(null);
    }
  };

  // Export to Excel (.xlsx)
  const handleExportMembersExcel = () => {
    if (filteredMembers.length === 0) return;

    exportToExcel({
      filename: `devnest_members_${new Date().toISOString().split("T")[0]}.xlsx`,
      sheetName: "DevNest Members",
      data: filteredMembers,
      columns: [
        { header: "ID", accessor: (m) => m.id, width: 22 },
        { header: "Full Name", accessor: (m) => m.fullName, width: 22 },
        { header: "Email", accessor: (m) => m.email, width: 28 },
        { header: "Phone", accessor: (m) => m.phone, width: 16 },
        { header: "Enrollment ID", accessor: (m) => m.enrollmentNumber || "N/A", width: 18 },
        { header: "College", accessor: (m) => m.college || "", width: 32 },
        { header: "Branch", accessor: (m) => m.branch, width: 24 },
        { header: "Year", accessor: (m) => m.year, width: 14 },
        { header: "Semester", accessor: (m) => m.semester, width: 12 },
        { header: "Status", accessor: (m) => m.status, width: 14 },
        { header: "Interests", accessor: (m) => (m.interests || []).join(", "), width: 30 },
        { header: "Skills", accessor: (m) => (m.skills || []).join(", "), width: 25 },
        { header: "GitHub", accessor: (m) => m.github || "", width: 25 },
        { header: "LinkedIn", accessor: (m) => m.linkedin || "", width: 25 },
        { header: "Portfolio", accessor: (m) => m.portfolio || "", width: 25 },
        { header: "Submitted At", accessor: (m) => new Date(m.createdAt).toLocaleString(), width: 22 },
      ],
    });
  };

  // Filter & sort members
  const filteredMembers = useMemo(() => {
    return members
      .filter((m) => {
        const query = searchQuery.toLowerCase().trim();
        const fullName = (m.fullName || "").toLowerCase();
        const email = (m.email || "").toLowerCase();
        const phone = m.phone || "";
        const enrollmentNumber = (m.enrollmentNumber || "").toLowerCase();
        const college = (m.college || "").toLowerCase();
        const branch = (m.branch || "").toLowerCase();

        const matchesQuery =
          !query ||
          fullName.includes(query) ||
          email.includes(query) ||
          phone.includes(query) ||
          enrollmentNumber.includes(query) ||
          college.includes(query) ||
          branch.includes(query);

        const matchesStatus = statusFilter === "all" || m.status === statusFilter;
        const matchesBranch = branchFilter === "all" || m.branch === branchFilter;

        return matchesQuery && matchesStatus && matchesBranch;
      })
      .sort((a, b) => {
        if (sortBy === "newest") {
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        }
        if (sortBy === "oldest") {
          return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
        }
        if (sortBy === "name") {
          return (a.fullName || "").localeCompare(b.fullName || "");
        }
        return 0;
      });
  }, [members, searchQuery, statusFilter, branchFilter, sortBy]);

  // Unique branches for filter dropdown
  const availableBranches = useMemo(() => {
    const set = new Set<string>();
    members.forEach((m) => {
      if (m.branch) set.add(m.branch);
    });
    return Array.from(set);
  }, [members]);

  // Filter & sort Prarambh registrations
  const filteredPrarambh = useMemo(() => {
    return prarambhRegistrations
      .filter((r) => {
        const query = prarambhSearchQuery.toLowerCase().trim();
        const fullName = (r.fullName || "").toLowerCase();
        const email = (r.email || "").toLowerCase();
        const phone = r.phone || "";
        const rollNumber = (r.rollNumber || "").toLowerCase();
        const teamName = (r.teamName || "").toLowerCase();
        const branch = (r.branch || "").toLowerCase();

        const matchesQuery =
          !query ||
          fullName.includes(query) ||
          email.includes(query) ||
          phone.includes(query) ||
          rollNumber.includes(query) ||
          teamName.includes(query) ||
          branch.includes(query);

        const matchesTrack =
          prarambhTrackFilter === "all" || r.competition === prarambhTrackFilter;
        const matchesStatus =
          prarambhStatusFilter === "all" || r.status === prarambhStatusFilter;

        return matchesQuery && matchesTrack && matchesStatus;
      })
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }, [prarambhRegistrations, prarambhSearchQuery, prarambhTrackFilter, prarambhStatusFilter]);

  // Export event registrations in official University attendance format matching Downloads/format
  const handleExportPrarambhExcel = () => {
    if (filteredPrarambh.length === 0) return;

    // Filter registrations by competition track
    const ctf3rdYearRegistrations = filteredPrarambh.filter(
      (r) => r.competition === "ctf-3rd-year" || (r.competition.includes("ctf") && r.year === "3rd Year")
    );
    const ctf2ndYearRegistrations = filteredPrarambh.filter(
      (r) => r.competition === "ctf-2nd-year" || (r.competition.includes("ctf") && r.year === "2nd Year")
    );
    const techQuizRegistrations = filteredPrarambh.filter(
      (r) => r.competition === "tech-quiz" || r.year === "1st Year"
    );

    // Helper to map registrations into AttendanceTeamSlot array (4 rows per slot in official standard format)
    const mapToTeamSlots = (list: typeof filteredPrarambh, defaultSem?: string): AttendanceTeamSlot[] => {
      return list.map((r, teamIdx) => {
        const isDuo = r.teamSize === 2 && Boolean(r.teammateName);
        const sem = defaultSem || (r.year === "3rd Year" ? "5th" : r.year === "2nd Year" ? "3rd" : "1st");
        const teamName = r.teamName || (r.competition === "tech-quiz" && !isDuo ? "" : `Team G${teamIdx + 1}`);

        const members: AttendanceTeamMember[] = [
          {
            name: isDuo ? `${r.fullName} (Leader)` : r.fullName,
            rollNo: r.rollNumber || "N/A",
            branch: r.branch || "CSE",
            sem: sem,
            phone: r.phone || "N/A",
            email: r.email || "N/A",
            sign: "",
          },
        ];

        if (isDuo && r.teammateName) {
          members.push({
            name: `${r.teammateName} (Member)`,
            rollNo: r.teammateRollNumber || "N/A",
            branch: r.branch || "CSE",
            sem: sem,
            phone: r.teammatePhone || "N/A",
            email: r.email ? `Team: ${r.email}` : "N/A",
            sign: "",
          });
        }

        return {
          srNo: teamIdx + 1,
          teamName: teamName,
          teamSize: isDuo ? 2 : 1,
          members: members,
        };
      });
    };

    const ctf2ndYearTeams = mapToTeamSlots(ctf2ndYearRegistrations, "3rd");
    const ctf3rdYearTeams = mapToTeamSlots(ctf3rdYearRegistrations, "5th");
    const techQuizTeams = mapToTeamSlots(techQuizRegistrations, "1st");
    const allTeams = mapToTeamSlots(filteredPrarambh);

    const activeEvent = (currentEventName || "Prarambh").trim();
    const dateFormatted = (currentEventDate || "23rd September 2026").trim();
    const safeEvent = activeEvent.toLowerCase().replace(/[^a-z0-9_-]+/g, "_");
    const todayStr = new Date().toISOString().split("T")[0];

    // Build sheets based on selected track filter:
    // If a specific track/year is selected (e.g. 2nd Year, 3rd Year, or Tech Quiz),
    // only export that single selected sheet instead of all sub-sheet groups.
    let exportSheets: {
      sheetName: string;
      trackTitle?: string;
      date?: string;
      teams?: AttendanceTeamSlot[];
      slotsCount?: number;
    }[] = [];
    let fileSuffix = "all_tracks";

    if (prarambhTrackFilter === "ctf-2nd-year") {
      fileSuffix = "ctf_2nd_year";
      exportSheets = [
        {
          sheetName: "CTF 2nd Year",
          trackTitle: "CTF 2nd Year",
          date: dateFormatted,
          teams: ctf2ndYearTeams,
        },
      ];
    } else if (prarambhTrackFilter === "ctf-3rd-year") {
      fileSuffix = "ctf_3rd_year";
      exportSheets = [
        {
          sheetName: "CTF 3rd Year",
          trackTitle: "CTF 3rd Year",
          date: dateFormatted,
          teams: ctf3rdYearTeams,
        },
      ];
    } else if (prarambhTrackFilter === "tech-quiz") {
      fileSuffix = "tech_quiz";
      exportSheets = [
        {
          sheetName: "Tech Quiz",
          trackTitle: "Tech Quiz",
          date: dateFormatted,
          teams: techQuizTeams,
        },
      ];
    } else {
      // "all" - export all tracks in standard university attendance format
      fileSuffix = "all_tracks";
      exportSheets = [
        {
          sheetName: "CTF 3rd Year",
          trackTitle: "CTF 3rd Year",
          date: dateFormatted,
          teams: ctf3rdYearTeams,
        },
        {
          sheetName: "CTF 2nd Year",
          trackTitle: "CTF 2nd Year",
          date: dateFormatted,
          teams: ctf2ndYearTeams,
        },
        {
          sheetName: "Tech Quiz",
          trackTitle: "Tech Quiz",
          date: dateFormatted,
          teams: techQuizTeams,
        },
        {
          sheetName: "All Participants",
          trackTitle: "All Participants Attendance",
          date: dateFormatted,
          teams: allTeams,
        },
      ];
    }

    exportOfficialAttendanceExcel({
      filename: `devnest_${safeEvent}_${fileSuffix}_attendance_${todayStr}.xlsx`,
      eventName: activeEvent,
      defaultDate: dateFormatted,
      sheets: exportSheets,
    });
  };

  // Export blank official university event attendance template
  const handleDownloadBlankFormat = () => {
    const activeEvent = (currentEventName || "Prarambh").trim();
    const dateFormatted = (currentEventDate || "23rd September 2026").trim();

    exportBlankAttendanceFormat({
      eventName: activeEvent,
      date: dateFormatted,
      trackTitle:
        prarambhTrackFilter !== "all"
          ? prarambhTrackFilter === "tech-quiz"
            ? "Tech Quiz"
            : prarambhTrackFilter === "ctf-2nd-year"
            ? "CTF 2nd Year"
            : "CTF 3rd Year"
          : "Tech Quiz",
      slotsCount: 30,
    });
  };

  // Loading state while verifying session
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <Head>
          <title>DevNest Admin Portal | Authenticating...</title>
        </Head>
        <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4 animate-pulse">
          <Shield className="w-6 h-6" />
        </div>
        <p className="text-sm font-medium text-muted-foreground">Verifying secure admin credentials...</p>
      </div>
    );
  }

  // LOGIN SCREEN: Rendered when not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-4 py-12 relative selection:bg-primary/20 selection:text-primary">
        <Head>
          <title>DevNest Admin | Protected Login</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>

        {/* Ambient glow */}
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[28rem] h-[28rem] bg-primary/[0.06] rounded-full blur-[140px]" />
        </div>

        <div className="w-full max-w-md relative z-10">
          {/* Brand header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-3 group mb-4">
              <div className="w-12 h-12 rounded-2xl p-1 bg-gradient-to-b from-primary/20 to-transparent border border-primary/30 flex items-center justify-center shadow-subtle group-hover:scale-105 transition-transform duration-200">
                <Image
                  src="/logo.svg"
                  alt="DevNest Logo"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-poppins font-bold text-2xl tracking-tight text-foreground">
                Dev<span className="text-primary">Nest</span>
              </span>
            </Link>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Authentication Portal</span>
            </div>
            <h1 className="text-2xl font-poppins font-bold tracking-tight text-foreground">
              Sign In to DevNest Admin
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Enter the authorized administration security key to continue.
            </p>
          </div>

          {/* Login Card */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-border/80 shadow-premium">
            <form onSubmit={handleLogin} className="space-y-5">
              {loginError && (
                <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <div className="space-y-2 text-left">
                <label
                  htmlFor="admin-password"
                  className="text-xs font-semibold text-foreground tracking-wide uppercase"
                >
                  Admin Master Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                    <Lock className="w-4 h-4" />
                  </div>
                  <Input
                    id="admin-password"
                    type="password"
                    placeholder="Enter security key..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoFocus
                    className="pl-10 h-12 rounded-xl bg-background/80 border-border text-base sm:text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loginLoading || !password}
                className="w-full h-12 rounded-xl font-semibold bg-primary hover:bg-primary/95 text-primary-foreground shadow-glow-primary transition-all duration-200 gap-2 text-sm sm:text-base"
              >
                {loginLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Authenticate & Access Dashboard</span>
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-border/60 text-center">
              <p className="text-[11px] text-muted-foreground flex items-center justify-center gap-1.5">
                <Lock className="w-3 h-3 text-muted-foreground" />
                <span>Protected by encrypted HTTP-only session tokens.</span>
              </p>
            </div>
          </div>

          <div className="text-center mt-6">
            <Link
              href="/"
              className="text-xs text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
            >
              <span>← Return to Public Website</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // AUTHENTICATED DASHBOARD
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20 selection:text-primary">
      <Head>
        <title>DevNest Admin | Membership Applications Portal</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      {/* Admin Top Navigation Bar */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/85 border-b border-border/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Left Brand */}
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-10 h-10 rounded-xl p-1 bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Image
                    src="/logo.svg"
                    alt="DevNest Logo"
                    width={36}
                    height={36}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-poppins font-bold text-lg leading-none">
                    Dev<span className="text-primary">Nest</span>
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mt-0.5">
                    Admin Portal
                  </span>
                </div>
              </Link>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                Live Session
              </span>
            </div>

            {/* Right Action Bar */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (adminTab === "prarambh") fetchPrarambhRegistrations();
                  else if (adminTab === "members") fetchMembers();
                  else fetchMessages();
                }}
                disabled={dataLoading || prarambhLoading || messagesLoading}
                className="rounded-xl h-10 px-3 sm:px-4 border-border/80 gap-1.5 text-xs font-medium cursor-pointer"
                title="Refresh Records"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${(dataLoading || prarambhLoading || messagesLoading) ? "animate-spin" : ""}`} />
                <span className="hidden sm:inline">Refresh</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (adminTab === "prarambh") handleExportPrarambhExcel();
                  else if (adminTab === "members") handleExportMembersExcel();
                }}
                disabled={
                  adminTab === "prarambh"
                    ? filteredPrarambh.length === 0
                    : adminTab === "members"
                    ? filteredMembers.length === 0
                    : messages.length === 0
                }
                className="rounded-xl h-10 px-3 sm:px-4 border-border/80 gap-1.5 text-xs font-medium cursor-pointer"
                title="Export Filtered Records to Excel (.xlsx)"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Export Excel</span>
              </Button>

              <Button
                variant="destructive"
                size="sm"
                onClick={handleLogout}
                className="rounded-xl h-10 px-3 sm:px-4 gap-1.5 text-xs font-semibold cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Sub-Navigation: Switch between Prarambh Registrations and DevNest Memberships */}
      <div className="border-b border-border/70 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="inline-flex p-1 rounded-2xl bg-secondary/80 border border-border/80 shadow-subtle shrink-0">
            <button
              type="button"
              onClick={() => setAdminTab("prarambh")}
              className={`inline-flex items-center gap-2 px-3.5 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                adminTab === "prarambh"
                  ? "bg-primary text-primary-foreground shadow-subtle"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>Prarambh (Concluded)</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                  adminTab === "prarambh"
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                {prarambhStats ? prarambhStats.total : prarambhRegistrations.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setAdminTab("members")}
              className={`inline-flex items-center gap-2 px-3.5 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                adminTab === "members"
                  ? "bg-primary text-primary-foreground shadow-subtle"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Society Members</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                  adminTab === "members"
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                {stats ? stats.total : members.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setAdminTab("messages")}
              className={`inline-flex items-center gap-2 px-3.5 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                adminTab === "messages"
                  ? "bg-primary text-primary-foreground shadow-subtle"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Contact Messages</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                  adminTab === "messages"
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : messagesStats && messagesStats.unread > 0
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "bg-muted text-foreground"
                }`}
              >
                {messagesStats
                  ? messagesStats.unread > 0
                    ? `${messagesStats.unread} new`
                    : messagesStats.total
                  : messages.length}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {adminTab === "prarambh" && (
              <Button
                size="sm"
                onClick={() => setAdminApplyModalOpen(true)}
                className="rounded-xl h-9 px-3 text-xs font-semibold gap-1.5 shadow-subtle cursor-pointer"
              >
                <Trophy className="w-3.5 h-3.5" />
                <span>+ Register Participant</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Admin Dashboard Container */}
      <main className="flex-grow py-6 sm:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8">
        {adminTab === "prarambh" ? (
          <>
            {/* Prarambh Metric Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
              {/* Total Applications */}
              <div className="glass-panel rounded-2xl p-4 border border-border/80 flex flex-col justify-between shadow-subtle">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Total Applications
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <Trophy className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-2xl sm:text-3xl font-poppins font-bold text-foreground">
                    {prarambhStats ? prarambhStats.total : prarambhRegistrations.length}
                  </span>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Prarambh 2026</p>
                </div>
              </div>

              {/* Tech Quiz (1st Year) */}
              <div className="glass-panel rounded-2xl p-4 border border-blue-500/30 bg-blue-500/[0.02] flex flex-col justify-between shadow-subtle">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-blue-500 uppercase tracking-wider">
                    Tech Quiz (Freshers)
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
                    <Brain className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-2xl sm:text-3xl font-poppins font-bold text-blue-500">
                    {prarambhStats
                      ? prarambhStats.techQuizFreshers
                      : prarambhRegistrations.filter((r) => r.competition === "tech-quiz").length}
                  </span>
                  <p className="text-[11px] text-muted-foreground mt-0.5">1st Year Students Only</p>
                </div>
              </div>

              {/* CTF 2nd Year Section */}
              <div className="glass-panel rounded-2xl p-4 border border-emerald-500/30 bg-emerald-500/[0.02] flex flex-col justify-between shadow-subtle">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-emerald-500 uppercase tracking-wider">
                    CTF (2nd Year)
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                    <Flag className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-2xl sm:text-3xl font-poppins font-bold text-emerald-500">
                    {prarambhStats
                      ? prarambhStats.ctf2ndYear
                      : prarambhRegistrations.filter((r) => r.competition === "ctf-2nd-year").length}
                  </span>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Senior Track A</p>
                </div>
              </div>

              {/* CTF 3rd Year Section */}
              <div className="glass-panel rounded-2xl p-4 border border-purple-500/30 bg-purple-500/[0.02] flex flex-col justify-between shadow-subtle">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-purple-500 uppercase tracking-wider">
                    CTF (3rd Year)
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500">
                    <Flag className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-2xl sm:text-3xl font-poppins font-bold text-purple-500">
                    {prarambhStats
                      ? prarambhStats.ctf3rdYear
                      : prarambhRegistrations.filter((r) => r.competition === "ctf-3rd-year").length}
                  </span>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Senior Track B</p>
                </div>
              </div>

              {/* Approved / Shortlisted */}
              <div className="glass-panel rounded-2xl p-4 border border-amber-500/30 bg-amber-500/[0.02] flex flex-col justify-between shadow-subtle col-span-2 sm:col-span-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                    Approved
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-2xl sm:text-3xl font-poppins font-bold text-amber-600 dark:text-amber-400">
                    {prarambhStats
                      ? prarambhStats.approved
                      : prarambhRegistrations.filter((r) => r.status === "approved").length}
                  </span>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Verified Participants</p>
                </div>
              </div>
            </div>

            {/* Official University Attendance Sheet (Downloads/format) Export Panel */}
            <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-emerald-500/30 bg-gradient-to-r from-emerald-500/[0.04] via-background/40 to-primary/[0.04] shadow-subtle flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0 shadow-sm">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-poppins font-bold text-foreground">
                      Official University Attendance Format
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20">
                      Standard Template (Unlimited Size)
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    LTSU-compliant format: Row 1 University, Row 2 Event Heading, Row 3 Track &amp; Date, Row 4 Team headers with 4-row slots, coordinators signatures. Not limited to 30 serial numbers.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                {/* Event Name Configuration */}
                <div className="flex items-center gap-2 bg-background/80 border border-border/80 rounded-xl px-3 h-10 text-xs shadow-sm">
                  <span className="text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">
                    Event:
                  </span>
                  <Input
                    value={currentEventName}
                    onChange={(e) => handleEventNameChange(e.target.value)}
                    placeholder="Event Name (e.g. Prarambh)"
                    className="h-7 w-28 sm:w-36 px-2 py-0 border-none bg-transparent text-xs font-bold text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                    title="Change this to any event name; it automatically updates Row 2 'Devnest Technical Event <EventName>' across all sheets in the Excel download"
                  />
                </div>

                {/* Event Date Configuration */}
                <div className="flex items-center gap-1.5 bg-background/80 border border-border/80 rounded-xl px-3 h-10 text-xs shadow-sm">
                  <Calendar className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  <Input
                    value={currentEventDate}
                    onChange={(e) => handleEventDateChange(e.target.value)}
                    placeholder="Date (e.g. 23rd September 2026)"
                    className="h-7 w-32 sm:w-40 px-2 py-0 border-none bg-transparent text-xs font-medium text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                    title="Printed in Row 3 (Dated : <Date>) of the attendance sheet"
                  />
                </div>

                {/* Download Registered Attendance Button */}
                <Button
                  onClick={handleExportPrarambhExcel}
                  disabled={filteredPrarambh.length === 0}
                  className="rounded-xl h-10 px-4 text-xs font-semibold gap-2 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-subtle shrink-0"
                  title={`Download Excel attendance file with registrations for: ${currentEventName}`}
                >
                  <Download className="w-4 h-4" />
                  <span>
                    {prarambhTrackFilter === "ctf-2nd-year"
                      ? `Export CTF 2nd Year (${filteredPrarambh.length})`
                      : prarambhTrackFilter === "ctf-3rd-year"
                      ? `Export CTF 3rd Year (${filteredPrarambh.length})`
                      : prarambhTrackFilter === "tech-quiz"
                      ? `Export Tech Quiz (${filteredPrarambh.length})`
                      : `Export All Tracks (${filteredPrarambh.length})`}
                  </span>
                </Button>

                {/* Download Blank Format Template Button */}
                <Button
                  variant="outline"
                  onClick={handleDownloadBlankFormat}
                  className="rounded-xl h-10 px-3.5 text-xs font-semibold gap-1.5 border-emerald-500/40 hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 cursor-pointer shadow-subtle shrink-0"
                  title={`Download blank attendance template in official format for: ${currentEventName}`}
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Blank Format</span>
                </Button>
              </div>
            </div>

            {/* Prarambh Filter & Search Bar */}
            <div className="glass-panel rounded-2xl p-4 border border-border/80 shadow-subtle space-y-3">
              <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
                {/* Search Bar */}
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <Input
                    placeholder="Search candidate by name, email, roll no, team, branch..."
                    value={prarambhSearchQuery}
                    onChange={(e) => setPrarambhSearchQuery(e.target.value)}
                    className="pl-9 h-10 rounded-xl bg-background/60 border-border/70 text-xs sm:text-sm"
                  />
                  {prarambhSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setPrarambhSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Filter Selectors */}
                <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                  {/* Track Filter */}
                  <div className="flex items-center gap-1.5 bg-background/60 border border-border/70 rounded-xl px-2.5 h-10 text-xs">
                    <Filter className="w-3.5 h-3.5 text-primary" />
                    <select
                      value={prarambhTrackFilter}
                      onChange={(e) => setPrarambhTrackFilter(e.target.value)}
                      className="bg-transparent border-none text-xs font-semibold focus:outline-none cursor-pointer"
                    >
                      <option value="all">All Tracks</option>
                      <option value="tech-quiz">Tech Quiz (1st Year Freshers)</option>
                      <option value="ctf-2nd-year">CTF (2nd Year Section)</option>
                      <option value="ctf-3rd-year">CTF (3rd Year Section)</option>
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div className="flex items-center gap-1.5 bg-background/60 border border-border/70 rounded-xl px-2.5 h-10 text-xs">
                    <select
                      value={prarambhStatusFilter}
                      onChange={(e) => setPrarambhStatusFilter(e.target.value)}
                      className="bg-transparent border-none text-xs font-semibold focus:outline-none cursor-pointer"
                    >
                      <option value="all">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>

                  <span className="text-xs text-muted-foreground font-medium whitespace-nowrap ml-1">
                    Showing <strong className="text-foreground">{filteredPrarambh.length}</strong> of{" "}
                    {prarambhRegistrations.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Prarambh Applications Table / Cards */}
            {prarambhLoading ? (
              <div className="glass-panel rounded-3xl p-12 text-center border border-border/80">
                <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
                <p className="text-xs font-medium text-muted-foreground">Loading Prarambh applications...</p>
              </div>
            ) : filteredPrarambh.length === 0 ? (
              <div className="glass-panel rounded-3xl p-12 text-center border border-border/80 max-w-md mx-auto">
                <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-30" />
                <h3 className="text-base font-bold text-foreground mb-1">
                  {prarambhRegistrations.length === 0 ? "No Prarambh Registrations Yet" : "No Matches Found"}
                </h3>
                <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                  {prarambhRegistrations.length === 0
                    ? "Candidates applying via the 'Apply for Prarambh' button on the website will be securely logged and managed here."
                    : "Try adjusting your search query or track/status filters."}
                </p>
                <Button
                  size="sm"
                  onClick={() => setAdminApplyModalOpen(true)}
                  className="rounded-xl text-xs gap-1.5 font-semibold cursor-pointer shadow-subtle"
                >
                  <Trophy className="w-3.5 h-3.5" />
                  <span>Register Participant Now</span>
                </Button>
              </div>
            ) : (
              <div className="glass-panel rounded-3xl border border-border/80 overflow-hidden shadow-subtle">
                {/* Responsive Mobile Card View (< lg) */}
                <div className="block lg:hidden divide-y divide-border/60">
                  {filteredPrarambh.map((reg) => (
                    <div key={reg.id} className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-sm font-bold text-foreground">{reg.fullName}</h4>
                          <p className="text-xs text-muted-foreground">{reg.email}</p>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            reg.status === "approved"
                              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                              : reg.status === "rejected"
                              ? "bg-destructive/15 text-destructive border border-destructive/30"
                              : "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                          }`}
                        >
                          {reg.status}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 text-xs">
                        <span className="px-2 py-0.5 rounded-md bg-secondary text-foreground font-semibold border border-border/60 text-[11px]">
                          {reg.year}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-md font-bold text-[11px] border ${
                            reg.competition === "tech-quiz"
                              ? "bg-blue-500/10 text-blue-500 border-blue-500/30"
                              : reg.competition === "ctf-2nd-year"
                              ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
                              : "bg-purple-500/10 text-purple-500 border-purple-500/30"
                          }`}
                        >
                          {reg.competition === "tech-quiz"
                            ? "Tech Quiz (Freshers)"
                            : reg.competition === "ctf-2nd-year"
                            ? "CTF (2nd Year)"
                            : "CTF (3rd Year)"}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-secondary/80 text-muted-foreground font-semibold text-[11px]">
                          {reg.teamSize === 2 ? "Duo (2)" : "Solo (1)"}
                        </span>
                        <span className="text-muted-foreground text-[11px]">
                          Roll: {reg.rollNumber}
                        </span>
                      </div>

                      {reg.teamSize === 2 && reg.teammateName && (
                        <div className="text-[11px] text-muted-foreground bg-secondary/40 p-2 rounded-xl border border-border/50">
                          <span className="font-bold text-foreground">Member 2:</span> {reg.teammateName}{" "}
                          {reg.teammatePhone && <span className="opacity-80">({reg.teammatePhone})</span>}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t border-border/40">
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(reg.createdAt).toLocaleDateString()}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedPrarambh(reg)}
                            className="h-7 px-2 text-xs rounded-lg cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 mr-1" />
                            View
                          </Button>
                          {reg.status !== "approved" && (
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={prarambhActionLoadingId === reg.id}
                              onClick={() => handleUpdatePrarambhStatus(reg.id, "approved")}
                              className="h-7 px-2 text-xs rounded-lg border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 cursor-pointer"
                            >
                              Approve
                            </Button>
                          )}
                          <Button
                            variant="destructive"
                            size="sm"
                            disabled={prarambhActionLoadingId === reg.id}
                            onClick={() => setDeletePrarambhConfirmId(reg.id)}
                            className="h-7 px-2 text-xs font-space font-bold border-2 border-black bg-[#FF5F56] text-white hover:bg-[#FA4D44] shadow-[1.5px_1.5px_0px_#000] rounded-lg cursor-pointer gap-1"
                            title="Delete Registration"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table View (>= lg) */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-border/80 bg-secondary/50 text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">
                        <th className="py-3.5 px-4">Candidate</th>
                        <th className="py-3.5 px-3">Year &amp; Track</th>
                        <th className="py-3.5 px-3">Team &amp; Format</th>
                        <th className="py-3.5 px-3">Roll &amp; Branch</th>
                        <th className="py-3.5 px-3">Status</th>
                        <th className="py-3.5 px-3">Registered At</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {filteredPrarambh.map((reg) => (
                        <tr key={reg.id} className="hover:bg-muted/30 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-foreground text-sm">{reg.fullName}</div>
                            <div className="text-muted-foreground text-xs">{reg.email}</div>
                            <div className="text-muted-foreground/80 text-[11px]">{reg.phone}</div>
                          </td>
                          <td className="py-3.5 px-3">
                            <div className="space-y-1">
                              <span className="inline-block px-2 py-0.5 rounded bg-secondary text-foreground text-[11px] font-semibold border border-border/60">
                                {reg.year}
                              </span>
                              <div>
                                <span
                                  className={`inline-block px-2 py-0.5 rounded font-bold text-[11px] border ${
                                    reg.competition === "tech-quiz"
                                      ? "bg-blue-500/10 text-blue-500 border-blue-500/30"
                                      : reg.competition === "ctf-2nd-year"
                                      ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
                                      : "bg-purple-500/10 text-purple-500 border-purple-500/30"
                                  }`}
                                >
                                  {reg.competition === "tech-quiz"
                                    ? "Tech Quiz (1st Yr Freshers)"
                                    : reg.competition === "ctf-2nd-year"
                                    ? "CTF (2nd Yr Section)"
                                    : "CTF (3rd Yr Section)"}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5">
                                <span
                                  className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                    reg.teamSize === 2
                                      ? "bg-primary/15 text-primary border border-primary/30"
                                      : "bg-secondary text-muted-foreground border border-border/60"
                                  }`}
                                >
                                  {reg.teamSize === 2 ? "Duo (2)" : "Solo (1)"}
                                </span>
                                {reg.teamName && (
                                  <span className="text-foreground font-semibold text-xs truncate max-w-[120px]" title={reg.teamName}>
                                    {reg.teamName}
                                  </span>
                                )}
                              </div>
                              {reg.teamSize === 2 && reg.teammateName && (
                                <div className="text-[11px] text-muted-foreground">
                                  <span className="font-semibold text-foreground">M2: {reg.teammateName}</span>
                                  {reg.teammatePhone && <span className="opacity-75 block text-[10px]">{reg.teammatePhone}</span>}
                                </div>
                              )}
                              {reg.handleOrGithub && (
                                <div className="text-primary text-[10px] font-mono truncate max-w-[140px]">
                                  {reg.handleOrGithub}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="py-3.5 px-3">
                            <div className="font-mono text-foreground font-semibold">{reg.rollNumber}</div>
                            <div className="text-muted-foreground text-[11px] max-w-[150px] truncate">
                              {reg.branch}
                            </div>
                          </td>
                          <td className="py-3.5 px-3">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                reg.status === "approved"
                                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                                  : reg.status === "rejected"
                                  ? "bg-destructive/15 text-destructive border border-destructive/30"
                                  : "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                              }`}
                            >
                              {reg.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-muted-foreground text-[11px]">
                            {new Date(reg.createdAt).toLocaleDateString()}{" "}
                            <span className="text-[10px] opacity-70">
                              {new Date(reg.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedPrarambh(reg)}
                                className="h-8 px-2.5 rounded-xl text-xs font-medium cursor-pointer"
                                title="View Application Details"
                              >
                                <Eye className="w-3.5 h-3.5 mr-1" />
                                Details
                              </Button>

                              {reg.status !== "approved" ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  disabled={prarambhActionLoadingId === reg.id}
                                  onClick={() => handleUpdatePrarambhStatus(reg.id, "approved")}
                                  className="h-8 px-2.5 rounded-xl text-xs font-semibold text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10 cursor-pointer"
                                  title="Approve Participant"
                                >
                                  Approve
                                </Button>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  disabled={prarambhActionLoadingId === reg.id}
                                  onClick={() => handleUpdatePrarambhStatus(reg.id, "pending")}
                                  className="h-8 px-2 rounded-xl text-xs text-muted-foreground border-border hover:bg-muted cursor-pointer"
                                  title="Reset to Pending"
                                >
                                  Reset
                                </Button>
                              )}

                              {reg.status !== "rejected" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  disabled={prarambhActionLoadingId === reg.id}
                                  onClick={() => handleUpdatePrarambhStatus(reg.id, "rejected")}
                                  className="h-8 px-2 text-xs text-destructive hover:bg-destructive/10 rounded-xl cursor-pointer"
                                  title="Reject Application"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </Button>
                              )}

                              <Button
                                variant="destructive"
                                size="sm"
                                disabled={prarambhActionLoadingId === reg.id}
                                onClick={() => setDeletePrarambhConfirmId(reg.id)}
                                className="h-8 px-2.5 text-xs font-space font-bold border-2 border-black bg-[#FF5F56] text-white hover:bg-[#FA4D44] shadow-[2px_2px_0px_#000] rounded-xl cursor-pointer gap-1"
                                title="Delete Registration"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete</span>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        ) : adminTab === "members" ? (
          <>
            {/* DevNest Members Metric Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {/* Total Submissions */}
          <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-border/80 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Total Submissions
              </span>
              <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl sm:text-3xl font-poppins font-bold text-foreground">
                {stats ? stats.total : members.length}
              </span>
              <p className="text-[11px] text-muted-foreground mt-0.5">All registered applications</p>
            </div>
          </div>

          {/* Active Members */}
          <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-emerald-500/30 bg-emerald-500/[0.02] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Active Members
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <UserCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl sm:text-3xl font-poppins font-bold text-emerald-600 dark:text-emerald-400">
                {stats ? stats.active : members.filter((m) => m.status === "active").length}
              </span>
              <p className="text-[11px] text-muted-foreground mt-0.5">Approved & onboarded</p>
            </div>
          </div>

          {/* Pending Applications */}
          <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-amber-500/30 bg-amber-500/[0.02] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                Pending Review
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl sm:text-3xl font-poppins font-bold text-amber-600 dark:text-amber-400">
                {stats ? stats.pending : members.filter((m) => m.status === "pending").length}
              </span>
              <p className="text-[11px] text-muted-foreground mt-0.5">Awaiting club verification</p>
            </div>
          </div>

          {/* Recent Registrations */}
          <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-primary/30 bg-primary/[0.02] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                Recent This Week
              </span>
              <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl sm:text-3xl font-poppins font-bold text-primary">
                {stats ? stats.recentThisWeek : 0}
              </span>
              <p className="text-[11px] text-muted-foreground mt-0.5">Submissions in last 7 days</p>
            </div>
          </div>
        </div>

        {/* Toolbar: Search, Filters, Sorters */}
        <div className="glass-panel rounded-2xl p-4 border border-border/80 space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-3">
          {/* Search Box */}
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
              <Search className="w-4 h-4" />
            </div>
            <Input
              type="text"
              placeholder="Search by name, email, roll number, or branch..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 rounded-xl bg-background/60 border-border text-base sm:text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-muted-foreground hover:text-foreground"
              >
                Clear
              </button>
            )}
          </div>

          {/* Filters Row */}
          <div className="grid grid-cols-3 sm:flex sm:items-center gap-2">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-11 px-3 rounded-xl bg-card border border-border text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            {/* Branch Filter */}
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="h-11 px-3 rounded-xl bg-card border border-border text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Branches</option>
              {availableBranches.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>

            {/* Sorter */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "newest" | "oldest" | "name")}
              className="h-11 px-3 rounded-xl bg-card border border-border text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
          <span>
            Showing <strong className="text-foreground">{filteredMembers.length}</strong> of{" "}
            {members.length} submissions
          </span>
          {(searchQuery || statusFilter !== "all" || branchFilter !== "all") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
                setBranchFilter("all");
              }}
              className="text-primary hover:underline font-medium"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* DATA PRESENTATION */}
        {dataLoading ? (
          <div className="py-20 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Loading member records...</p>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="glass-panel rounded-3xl p-10 sm:p-14 text-center border border-border/80 max-w-lg mx-auto space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto">
              <Users className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold font-poppins text-foreground">
                {searchQuery || statusFilter !== "all" || branchFilter !== "all"
                  ? "No matching records found"
                  : "No Membership Submissions Yet"}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                {searchQuery || statusFilter !== "all" || branchFilter !== "all"
                  ? "Try adjusting or clearing your search filters."
                  : "The database is clean and ready. When students register through the membership form, their applications will appear here in real time."}
              </p>
            </div>
            {!searchQuery && statusFilter === "all" && branchFilter === "all" && (
              <div className="pt-2">
                <Button asChild size="sm" className="rounded-xl font-semibold gap-1.5 shadow-subtle">
                  <Link href="/membership" target="_blank">
                    <span>Open /membership Form</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* MOBILE VIEW: Thumb-Friendly Responsive Cards (< 768px) */}
            <div className="md:hidden space-y-3">
              {filteredMembers.map((member) => (
                <div
                  key={member.id}
                  className="glass-panel rounded-2xl p-4 border border-border/80 shadow-subtle hover:border-primary/40 transition-all duration-200"
                >
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-poppins font-bold text-base text-foreground">
                          {member.fullName}
                        </span>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                            member.status === "active"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                              : member.status === "pending"
                                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                                : "bg-muted text-muted-foreground border border-border"
                          }`}
                        >
                          {member.status}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {member.branch} • {member.year} ({member.semester} Sem)
                      </p>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedMember(member)}
                      className="rounded-xl h-9 px-2.5 text-primary hover:bg-primary/10"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-1 text-xs text-muted-foreground mb-3.5">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      <a href={`mailto:${member.email}`} className="hover:text-primary truncate">
                        {member.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      <a href={`tel:${member.phone}`} className="hover:text-primary">
                        {member.phone}
                      </a>
                    </div>
                    {member.enrollmentNumber && member.enrollmentNumber !== "N/A" && (
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        <span>ID: {member.enrollmentNumber}</span>
                      </div>
                    )}
                  </div>

                  {/* Mobile Thumb-Friendly Action Row */}
                  <div className="pt-3 border-t border-border/60 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      {member.status !== "active" && (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={actionLoadingId === member.id}
                          onClick={() => handleStatusChange(member.id, "active")}
                          className="rounded-xl h-9 px-3 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10"
                        >
                          Approve
                        </Button>
                      )}
                      {member.status === "active" && (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={actionLoadingId === member.id}
                          onClick={() => handleStatusChange(member.id, "inactive")}
                          className="rounded-xl h-9 px-3 text-xs font-semibold text-muted-foreground border-border hover:bg-muted"
                        >
                          Deactivate
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedMember(member)}
                        className="rounded-xl h-9 px-3 text-xs font-semibold text-foreground hover:bg-muted"
                      >
                        Details
                      </Button>
                    </div>

                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={actionLoadingId === member.id}
                      onClick={() => setDeleteConfirmId(member.id)}
                      className="rounded-xl h-9 px-3 text-xs font-space font-bold border-2 border-black bg-[#FF5F56] text-white hover:bg-[#FA4D44] shadow-[2px_2px_0px_#000] gap-1"
                      title="Delete Member"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* DESKTOP VIEW: Sleek Responsive Data Table (>= 768px) */}
            <div className="hidden md:block glass-panel rounded-2xl border border-border/80 overflow-hidden shadow-subtle">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold text-[11px] uppercase tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4">Applicant</th>
                      <th className="py-3.5 px-4">Contact</th>
                      <th className="py-3.5 px-4">Academics</th>
                      <th className="py-3.5 px-4">Domains</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Submitted</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {filteredMembers.map((member) => (
                      <tr
                        key={member.id}
                        className="hover:bg-muted/30 transition-colors duration-150"
                      >
                        {/* Applicant Name & ID */}
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-foreground">{member.fullName}</div>
                          <div className="text-[11px] text-muted-foreground">
                            {member.enrollmentNumber || "N/A"}
                          </div>
                        </td>

                        {/* Contact */}
                        <td className="py-3.5 px-4">
                          <a
                            href={`mailto:${member.email}`}
                            className="block hover:text-primary truncate max-w-[180px]"
                          >
                            {member.email}
                          </a>
                          <a
                            href={`tel:${member.phone}`}
                            className="block text-[11px] text-muted-foreground hover:text-primary"
                          >
                            {member.phone}
                          </a>
                        </td>

                        {/* Academics */}
                        <td className="py-3.5 px-4">
                          <div className="font-medium">{member.branch}</div>
                          <div className="text-[11px] text-muted-foreground">
                            {member.year} • {member.semester} Sem
                          </div>
                        </td>

                        {/* Domains & Interests */}
                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {(member.interests || []).slice(0, 2).map((interest, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded-full text-[10px] bg-muted border border-border/80 text-foreground/80"
                              >
                                {interest}
                              </span>
                            ))}
                            {(member.interests || []).length > 2 && (
                              <span className="text-[10px] text-muted-foreground">
                                +{(member.interests || []).length - 2} more
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap shrink-0 ${
                              member.status === "active"
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                                : member.status === "pending"
                                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                                  : "bg-muted text-muted-foreground border border-border"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                member.status === "active"
                                  ? "bg-emerald-500"
                                  : member.status === "pending"
                                    ? "bg-amber-500"
                                    : "bg-muted-foreground"
                              }`}
                            />
                            {member.status}
                          </span>
                        </td>

                        {/* Submitted Date */}
                        <td className="py-3.5 px-4 text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(member.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedMember(member)}
                              className="rounded-xl h-8 px-2.5 text-xs text-foreground hover:bg-muted"
                              title="View Application Details"
                            >
                              <Eye className="w-3.5 h-3.5 mr-1" />
                              <span>Details</span>
                            </Button>

                            {member.status !== "active" ? (
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={actionLoadingId === member.id}
                                onClick={() => handleStatusChange(member.id, "active")}
                                className="rounded-xl h-8 px-2.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10"
                                title="Approve Application"
                              >
                                Approve
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={actionLoadingId === member.id}
                                onClick={() => handleStatusChange(member.id, "inactive")}
                                className="rounded-xl h-8 px-2.5 text-xs font-medium text-muted-foreground border-border hover:bg-muted"
                                title="Set Inactive"
                              >
                                Deactivate
                              </Button>
                            )}

                            <Button
                              variant="destructive"
                              size="sm"
                              disabled={actionLoadingId === member.id}
                              onClick={() => setDeleteConfirmId(member.id)}
                              className="rounded-xl h-8 px-2.5 text-xs font-space font-bold border-2 border-black bg-[#FF5F56] text-white hover:bg-[#FA4D44] shadow-[2px_2px_0px_#000] gap-1 cursor-pointer"
                              title="Delete Submission"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </>
    ) : (
      <AdminMessagesView
        messages={messages}
        stats={messagesStats}
        loading={messagesLoading}
        onUpdateStatus={handleUpdateMessageStatus}
        onDeleteMessage={handleDeleteMessage}
        actionLoadingId={messageActionLoadingId}
        onRefresh={fetchMessages}
      />
    )}
  </main>

      {/* SUBMISSION DETAILS MODAL */}
      <Dialog open={!!selectedMember} onOpenChange={(open) => !open && setSelectedMember(null)}>
        <DialogContent className="max-w-xl rounded-3xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
          {selectedMember && (
            <>
              <DialogHeader className="text-left pb-4 border-b border-border/60">
                <div className="flex items-center justify-between gap-3">
                  <div className="badge-pill mb-1">
                    <Sparkles className="w-3 h-3 text-primary" />
                    <span>Member Dossier</span>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                      selectedMember.status === "active"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                        : selectedMember.status === "pending"
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                          : "bg-muted text-muted-foreground border border-border"
                    }`}
                  >
                    {selectedMember.status}
                  </span>
                </div>
                <DialogTitle className="text-xl sm:text-2xl font-poppins font-bold text-foreground">
                  {selectedMember.fullName}
                </DialogTitle>
                <DialogDescription className="text-xs sm:text-sm text-muted-foreground">
                  Applied on {new Date(selectedMember.createdAt).toLocaleString()} • ID:{" "}
                  <code className="text-xs font-mono">{selectedMember.id}</code>
                </DialogDescription>
              </DialogHeader>

              <div className="py-4 space-y-5 text-left text-xs sm:text-sm">
                {/* Contact Section */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Contact Information
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <a
                      href={`mailto:${selectedMember.email}`}
                      className="p-3 rounded-xl bg-muted/40 border border-border flex items-center gap-2.5 hover:border-primary/40 transition-colors"
                    >
                      <Mail className="w-4 h-4 text-primary shrink-0" />
                      <div className="truncate">
                        <span className="text-[10px] text-muted-foreground block">Email Address</span>
                        <span className="font-medium text-foreground truncate block">
                          {selectedMember.email}
                        </span>
                      </div>
                    </a>
                    <a
                      href={`tel:${selectedMember.phone}`}
                      className="p-3 rounded-xl bg-muted/40 border border-border flex items-center gap-2.5 hover:border-primary/40 transition-colors"
                    >
                      <Phone className="w-4 h-4 text-primary shrink-0" />
                      <div>
                        <span className="text-[10px] text-muted-foreground block">Phone / WhatsApp</span>
                        <span className="font-medium text-foreground block">
                          {selectedMember.phone}
                        </span>
                      </div>
                    </a>
                  </div>
                </div>

                {/* Academic Section */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Academic Background
                  </h4>
                  <div className="p-3.5 rounded-xl bg-muted/40 border border-border space-y-2">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-muted-foreground shrink-0" />
                      <span className="font-medium text-foreground">
                        {selectedMember.college || "Lamrin Tech Skills University Punjab"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <GraduationCap className="w-4 h-4 shrink-0" />
                      <span>
                        {selectedMember.branch} • {selectedMember.year} ({selectedMember.semester}{" "}
                        Semester)
                      </span>
                    </div>
                    {selectedMember.enrollmentNumber && selectedMember.enrollmentNumber !== "N/A" && (
                      <div className="text-muted-foreground">
                        Student ID / Roll:{" "}
                        <strong className="text-foreground">{selectedMember.enrollmentNumber}</strong>
                      </div>
                    )}
                  </div>
                </div>

                {/* Domains & Technical Skills */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Domains & Interests
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {(selectedMember.interests || []).map((interest, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-medium"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>

                  {(selectedMember.skills || []).length > 0 && (
                    <>
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pt-2">
                        Skills & Tools
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedMember.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-full bg-card border border-border text-foreground text-xs font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Social Profiles */}
                {(selectedMember.github || selectedMember.linkedin || selectedMember.portfolio) && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Online Profiles
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedMember.github && (
                        <a
                          href={selectedMember.github}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card border border-border text-xs font-medium hover:border-primary/50 text-foreground transition-colors"
                        >
                          <Code2 className="w-3.5 h-3.5 text-primary" />
                          <span>GitHub Profile</span>
                          <ExternalLink className="w-3 h-3 text-muted-foreground" />
                        </a>
                      )}
                      {selectedMember.linkedin && (
                        <a
                          href={selectedMember.linkedin}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card border border-border text-xs font-medium hover:border-primary/50 text-foreground transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-primary" />
                          <span>LinkedIn Profile</span>
                        </a>
                      )}
                      {selectedMember.portfolio && (
                        <a
                          href={selectedMember.portfolio}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card border border-border text-xs font-medium hover:border-primary/50 text-foreground transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-primary" />
                          <span>Personal Portfolio</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Motivation Statement */}
                {selectedMember.statement && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Why DevNest? (Statement)
                    </h4>
                    <div className="p-3.5 rounded-xl bg-muted/30 border border-border text-xs sm:text-sm text-foreground italic leading-relaxed">
                      "{selectedMember.statement}"
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Quick Actions */}
              <div className="pt-4 border-t border-border/60 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant={selectedMember.status === "active" ? "secondary" : "default"}
                    onClick={() =>
                      handleStatusChange(
                        selectedMember.id,
                        selectedMember.status === "active" ? "inactive" : "active"
                      )
                    }
                    className="rounded-xl font-semibold text-xs"
                  >
                    {selectedMember.status === "active" ? "Mark Inactive" : "Approve Application"}
                  </Button>
                  {selectedMember.status !== "pending" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusChange(selectedMember.id, "pending")}
                      className="rounded-xl text-xs font-medium"
                    >
                      Mark Pending
                    </Button>
                  )}
                </div>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    setDeleteConfirmId(selectedMember.id);
                    setSelectedMember(null);
                  }}
                  className="rounded-xl text-xs font-space font-bold border-2 border-black bg-[#FF5F56] text-white hover:bg-[#FA4D44] shadow-[3px_3px_0px_#000] gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Member</span>
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRMATION DIALOG */}
      <Dialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <DialogContent className="max-w-md rounded-3xl p-6">
          <DialogHeader className="text-left">
            <div className="w-10 h-10 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center justify-center text-destructive mb-2">
              <Trash2 className="w-5 h-5" />
            </div>
            <DialogTitle className="text-lg font-bold font-poppins text-foreground">
              Delete Member Application?
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-muted-foreground">
              Are you sure you want to permanently remove this application? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="pt-4 flex items-center justify-end gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteConfirmId(null)}
              className="rounded-xl text-xs font-medium"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              disabled={!deleteConfirmId || actionLoadingId === deleteConfirmId}
              onClick={() => deleteConfirmId && handleDeleteMember(deleteConfirmId)}
              className="rounded-xl text-xs font-semibold gap-1.5"
            >
              {actionLoadingId === deleteConfirmId ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <span>Confirm Delete</span>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* PRARAMBH APPLICANT DETAILS MODAL */}
      <Dialog open={!!selectedPrarambh} onOpenChange={(open) => !open && setSelectedPrarambh(null)}>
        <DialogContent className="max-w-xl rounded-3xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
          {selectedPrarambh && (
            <>
              <DialogHeader className="text-left pb-4 border-b border-border/60">
                <div className="flex items-center justify-between gap-3">
                  <div className="badge-pill mb-1">
                    <Trophy className="w-3 h-3 text-primary" />
                    <span>Prarambh 2026 Applicant</span>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                      selectedPrarambh.status === "approved"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                        : selectedPrarambh.status === "pending"
                        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                        : "bg-destructive/10 text-destructive border border-destructive/20"
                    }`}
                  >
                    {selectedPrarambh.status}
                  </span>
                </div>
                <DialogTitle className="text-xl sm:text-2xl font-poppins font-bold text-foreground">
                  {selectedPrarambh.fullName}
                </DialogTitle>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">
                    Registered on {new Date(selectedPrarambh.createdAt).toLocaleString()}
                  </span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="flex items-center gap-1 text-xs text-rose-500 font-semibold">
                    <MapPin className="w-3.5 h-3.5" />
                    {selectedPrarambh.venue || "IBM Lab in Lamrin Tech Skills University Punjab"}
                  </span>
                </div>
              </DialogHeader>

              <div className="py-4 space-y-5 text-left text-xs sm:text-sm">
                {/* Competition Allocation Card */}
                <div className="p-4 rounded-2xl bg-secondary/60 border border-border/70 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Assigned Competition Track
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                        selectedPrarambh.competition === "tech-quiz"
                          ? "bg-blue-500/10 text-blue-500 border-blue-500/30"
                          : selectedPrarambh.competition === "ctf-2nd-year"
                          ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
                          : "bg-purple-500/10 text-purple-500 border-purple-500/30"
                      }`}
                    >
                      {selectedPrarambh.competition === "tech-quiz"
                        ? "Tech Quiz (1st Year Freshers Only)"
                        : selectedPrarambh.competition === "ctf-2nd-year"
                        ? "Capture The Flag (2nd Year Section)"
                        : "Capture The Flag (3rd Year Section)"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {selectedPrarambh.competition === "tech-quiz"
                      ? "Exclusive for 1st Year Freshers. Rapid-fire algorithmic & CS fundamentals quiz."
                      : selectedPrarambh.competition === "ctf-2nd-year"
                      ? "Exclusive for 2nd Year Seniors. Web exploitation, cryptography & forensics."
                      : "Exclusive for 3rd Year Seniors. Reverse engineering, binary exploitation & PWN."}
                  </p>
                </div>

                {/* Participation Format & Team Details */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Participation Format &amp; Team Details
                  </h4>
                  <div className="p-3.5 rounded-xl bg-muted/40 border border-border space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Format:</span>
                      <span className="font-bold text-foreground">
                        {selectedPrarambh.teamSize === 2 ? "Team of 2 (Duo)" : "Individual (Solo)"}
                      </span>
                    </div>

                    {selectedPrarambh.teamSize === 2 && (
                      <div className="pt-2 border-t border-border/60 space-y-2">
                        <div className="text-xs font-bold text-primary flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5" />
                          <span>Team Member 2:</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          <div className="p-2.5 rounded-lg bg-background/70 border border-border/70">
                            <span className="text-muted-foreground text-[10px] block">Full Name</span>
                            <span className="font-semibold text-foreground text-xs">{selectedPrarambh.teammateName || "N/A"}</span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-background/70 border border-border/70">
                            <span className="text-muted-foreground text-[10px] block">Phone / WhatsApp</span>
                            {selectedPrarambh.teammatePhone ? (
                              <a href={`tel:${selectedPrarambh.teammatePhone}`} className="font-semibold text-primary hover:underline text-xs">
                                {selectedPrarambh.teammatePhone}
                              </a>
                            ) : (
                              <span className="text-muted-foreground text-xs">N/A</span>
                            )}
                          </div>
                          {selectedPrarambh.teammateRollNumber && (
                            <div className="p-2.5 rounded-lg bg-background/70 border border-border/70 sm:col-span-2">
                              <span className="text-muted-foreground text-[10px] block">University Roll / ID Number</span>
                              <span className="font-mono text-foreground font-semibold text-xs">{selectedPrarambh.teammateRollNumber}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {selectedPrarambh.year === "1st Year" || selectedPrarambh.competition === "tech-quiz" ? (
                      <div className="pt-1 text-xs">
                        <span className="text-muted-foreground">Participation: </span>
                        <strong className="text-foreground">Individual (Solo Fresher)</strong>
                      </div>
                    ) : selectedPrarambh.teamName ? (
                      <div className="pt-1 text-xs">
                        <span className="text-muted-foreground">Team Name: </span>
                        <strong className="text-foreground">{selectedPrarambh.teamName}</strong>
                      </div>
                    ) : null}
                    {selectedPrarambh.handleOrGithub && (
                      <div className="text-xs">
                        <span className="text-muted-foreground">Handle / Profile: </span>
                        <span className="font-mono text-primary font-medium">{selectedPrarambh.handleOrGithub}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Candidate 1 Contact Details
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <a
                      href={`mailto:${selectedPrarambh.email}`}
                      className="p-3 rounded-xl bg-muted/40 border border-border flex items-center gap-2.5 hover:border-primary/40 transition-colors"
                    >
                      <Mail className="w-4 h-4 text-primary shrink-0" />
                      <div className="truncate">
                        <span className="text-[10px] text-muted-foreground block">Email Address</span>
                        <span className="font-medium text-foreground truncate block">
                          {selectedPrarambh.email}
                        </span>
                      </div>
                    </a>
                    <a
                      href={`tel:${selectedPrarambh.phone}`}
                      className="p-3 rounded-xl bg-muted/40 border border-border flex items-center gap-2.5 hover:border-primary/40 transition-colors"
                    >
                      <Phone className="w-4 h-4 text-primary shrink-0" />
                      <div>
                        <span className="text-[10px] text-muted-foreground block">WhatsApp / Phone</span>
                        <span className="font-medium text-foreground block">
                          {selectedPrarambh.phone}
                        </span>
                      </div>
                    </a>
                  </div>
                </div>

                {/* Academic Background */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Academic Info
                  </h4>
                  <div className="p-3.5 rounded-xl bg-muted/40 border border-border space-y-2">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-muted-foreground shrink-0" />
                      <span className="font-medium text-foreground">{selectedPrarambh.college}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <GraduationCap className="w-4 h-4 shrink-0" />
                      <span>
                        {selectedPrarambh.course ? `${selectedPrarambh.course} - ${selectedPrarambh.specialization}` : selectedPrarambh.branch} • <strong className="text-foreground">{selectedPrarambh.year}</strong>
                      </span>
                    </div>
                    {selectedPrarambh.section && (
                      <div className="text-muted-foreground">
                        Class Section: <strong className="text-foreground font-mono">{selectedPrarambh.section}</strong>
                      </div>
                    )}
                    <div className="text-muted-foreground">
                      University Roll Number: <strong className="text-foreground font-mono">{selectedPrarambh.rollNumber}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="pt-4 border-t border-border/60 flex flex-wrap items-center justify-between gap-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Set Status:</span>
                  <Button
                    size="sm"
                    variant={selectedPrarambh.status === "approved" ? "default" : "outline"}
                    disabled={prarambhActionLoadingId === selectedPrarambh.id}
                    onClick={() => handleUpdatePrarambhStatus(selectedPrarambh.id, "approved")}
                    className="h-8 rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedPrarambh.status === "pending" ? "default" : "outline"}
                    disabled={prarambhActionLoadingId === selectedPrarambh.id}
                    onClick={() => handleUpdatePrarambhStatus(selectedPrarambh.id, "pending")}
                    className="h-8 rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Pending
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedPrarambh.status === "rejected" ? "destructive" : "outline"}
                    disabled={prarambhActionLoadingId === selectedPrarambh.id}
                    onClick={() => handleUpdatePrarambhStatus(selectedPrarambh.id, "rejected")}
                    className="h-8 rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Reject
                  </Button>
                </div>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setDeletePrarambhConfirmId(selectedPrarambh.id);
                  }}
                  className="rounded-xl text-xs font-space font-bold border-2 border-black bg-[#FF5F56] text-white hover:bg-[#FA4D44] shadow-[3px_3px_0px_#000] gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Registration</span>
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* DELETE PRARAMBH CONFIRMATION DIALOG */}
      <Dialog
        open={!!deletePrarambhConfirmId}
        onOpenChange={(open) => !open && setDeletePrarambhConfirmId(null)}
      >
        <DialogContent className="max-w-md rounded-3xl p-6">
          <DialogHeader className="text-left">
            <div className="w-10 h-10 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center justify-center text-destructive mb-2">
              <Trash2 className="w-5 h-5" />
            </div>
            <DialogTitle className="text-lg font-bold font-poppins text-foreground">
              Delete Prarambh Registration?
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-muted-foreground">
              Are you sure you want to permanently remove this registration? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="pt-4 flex items-center justify-end gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeletePrarambhConfirmId(null)}
              className="rounded-xl text-xs font-medium cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              disabled={!deletePrarambhConfirmId || prarambhActionLoadingId === deletePrarambhConfirmId}
              onClick={() => deletePrarambhConfirmId && handleDeletePrarambh(deletePrarambhConfirmId)}
              className="rounded-xl text-xs font-semibold gap-1.5 cursor-pointer"
            >
              {prarambhActionLoadingId === deletePrarambhConfirmId ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <span>Confirm Delete</span>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
