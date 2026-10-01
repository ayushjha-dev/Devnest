import React, { useState, useMemo } from "react";
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
  Sparkles,
  Trophy,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  Download,
  RefreshCw,
  Eye,
  Trash2,
  Mail,
  Phone,
  ExternalLink,
  MapPin,
  Palette,
  Server,
  Layers,
  FileSpreadsheet,
  Check,
  X,
  Loader2,
} from "lucide-react";
import type {
  DesignathonRegistration,
  DesignathonStats,
  DesignathonTrack,
} from "../../../server/designathon-storage";
import {
  exportToExcel,
  exportOfficialAttendanceExcel,
  exportBlankAttendanceFormat,
  AttendanceTeamSlot,
  AttendanceTeamMember,
} from "@/lib/excel-export";

interface AdminDesignathonViewProps {
  registrations: DesignathonRegistration[];
  stats: DesignathonStats | null;
  loading: boolean;
  error: string;
  onRefresh: () => void;
  onStatusChange: (id: string, status: "pending" | "approved" | "rejected") => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onOpenAddModal: () => void;
}

export function AdminDesignathonView({
  registrations,
  stats,
  loading,
  error,
  onRefresh,
  onStatusChange,
  onDelete,
  onOpenAddModal,
}: AdminDesignathonViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [trackFilter, setTrackFilter] = useState<string>("all");
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "name">("newest");

  const [selectedReg, setSelectedReg] = useState<DesignathonRegistration | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Filtered and sorted registrations
  const filteredRegistrations = useMemo(() => {
    return registrations
      .filter((reg) => {
        if (statusFilter !== "all" && reg.status !== statusFilter) return false;
        if (trackFilter !== "all" && reg.trackOrFocus !== trackFilter) return false;
        if (yearFilter !== "all" && reg.year !== yearFilter) return false;

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchesMain =
            reg.fullName.toLowerCase().includes(q) ||
            reg.rollNumber.toLowerCase().includes(q) ||
            reg.email.toLowerCase().includes(q) ||
            reg.phone.toLowerCase().includes(q) ||
            reg.teamName.toLowerCase().includes(q) ||
            reg.branch.toLowerCase().includes(q);

          const matchesTeammate = reg.teammates?.some(
            (t) =>
              t.name.toLowerCase().includes(q) ||
              t.rollNumber.toLowerCase().includes(q) ||
              t.phone.toLowerCase().includes(q)
          );

          if (!matchesMain && !matchesTeammate) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "newest") {
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        }
        if (sortBy === "oldest") {
          return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
        }
        if (sortBy === "name") {
          return a.fullName.localeCompare(b.fullName);
        }
        return 0;
      });
  }, [registrations, statusFilter, trackFilter, yearFilter, searchQuery, sortBy]);

  // Export official attendance workbook
  const handleExportAttendance = () => {
    const listToExport = filteredRegistrations.length > 0 ? filteredRegistrations : registrations;

    const teamSlots: AttendanceTeamSlot[] = listToExport.map((reg, idx) => {
      const members: AttendanceTeamMember[] = [
        {
          name: reg.fullName,
          rollNo: reg.rollNumber,
          branch: reg.branch,
          sem: reg.sem || reg.semester || "1st Sem",
          phone: reg.phone,
          email: reg.email,
          sign: "",
        },
      ];

      if (reg.teammates && Array.isArray(reg.teammates)) {
        for (const tm of reg.teammates) {
          members.push({
            name: tm.name,
            rollNo: tm.rollNumber,
            branch: tm.branch || reg.branch,
            sem: tm.sem || reg.sem || "1st Sem",
            phone: tm.phone,
            email: tm.email || "",
            sign: "",
          });
        }
      }

      return {
        srNo: idx + 1,
        teamName: reg.teamName,
        teamSize: members.length,
        members,
      };
    });

    exportOfficialAttendanceExcel({
      filename: "Devnest_Designathon_Attendance.xlsx",
      eventName: "Designathon",
      institutionName: "University School of Engineering & Technology, LTSU Punjab",
      defaultDate: "October 2026",
      sheets: [
        {
          sheetName: "Designathon Teams",
          trackTitle: "Designathon",
          date: "October 2026",
          teams: teamSlots,
        },
      ],
    });
  };

  // Export registrations data spreadsheet
  const handleExportData = () => {
    const listToExport = filteredRegistrations.length > 0 ? filteredRegistrations : registrations;
    const rowsWithIndex = listToExport.map((reg, idx) => ({ ...reg, srNo: idx + 1 }));

    exportToExcel({
      filename: "Devnest_Designathon_Registrations",
      sheetName: "Registrations",
      data: rowsWithIndex,
      columns: [
        { header: "Sr No.", accessor: (r) => r.srNo, width: 8 },
        { header: "Team Name", accessor: (r) => r.teamName, width: 22 },
        { header: "Team Size", accessor: (r) => r.teamSize, width: 12 },
        { header: "Name", accessor: (r) => r.fullName, width: 22 },
        { header: "Roll No.", accessor: (r) => r.rollNumber, width: 16 },
        { header: "Branch", accessor: (r) => r.branch, width: 20 },
        { header: "Sem", accessor: (r) => r.sem || r.semester || "1st Sem", width: 12 },
        { header: "Phone NO.", accessor: (r) => r.phone, width: 16 },
        { header: "Email", accessor: (r) => r.email, width: 26 },
        {
          header: "Teammates Details",
          accessor: (r) =>
            r.teammates && r.teammates.length > 0
              ? r.teammates
                  .map(
                    (t) =>
                      `${t.name} (Roll: ${t.rollNumber}, Branch: ${t.branch}, Sem: ${t.sem}, Phone: ${t.phone}, Email: ${t.email})`
                  )
                  .join(" | ")
              : "None",
          width: 45,
        },
        { header: "Status", accessor: (r) => r.status.toUpperCase(), width: 12 },
        {
          header: "Registered At",
          accessor: (r) => (r.createdAt ? new Date(r.createdAt).toLocaleString("en-IN") : "N/A"),
          width: 22,
        },
      ],
    });
  };

  // Export blank attendance format
  const handleExportBlank = () => {
    exportBlankAttendanceFormat({
      filename: "Devnest_Designathon_Blank_Attendance_Format.xlsx",
      eventName: "Designathon",
      trackTitle: "Designathon",
      date: "October 2026",
      slotsCount: 30,
    });
  };

  const handleStatusChangeInternal = async (
    id: string,
    newStatus: "pending" | "approved" | "rejected"
  ) => {
    setActionLoadingId(id);
    try {
      await onStatusChange(id, newStatus);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteInternal = async (id: string) => {
    setActionLoadingId(id);
    try {
      await onDelete(id);
      setDeleteConfirmId(null);
      if (selectedReg?.id === id) setSelectedReg(null);
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Metric Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Total Registrations */}
        <div className="glass-panel rounded-2xl p-4 border border-border/80 flex flex-col justify-between shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Total Teams &amp; Solos
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#FFE600] border border-black flex items-center justify-center text-black">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-poppins font-bold text-foreground">
              {stats ? stats.total : registrations.length}
            </span>
            <p className="text-[11px] text-muted-foreground mt-0.5">Designathon 2026</p>
          </div>
        </div>

        {/* Approved Teams */}
        <div className="glass-panel rounded-2xl p-4 border border-emerald-500/30 bg-emerald-500/[0.02] flex flex-col justify-between shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Approved
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-poppins font-bold text-emerald-600 dark:text-emerald-400">
              {stats ? stats.approved : registrations.filter((r) => r.status === "approved").length}
            </span>
            <p className="text-[11px] text-muted-foreground mt-0.5">Verified participants</p>
          </div>
        </div>

        {/* Pending Review */}
        <div className="glass-panel rounded-2xl p-4 border border-amber-500/30 bg-amber-500/[0.02] flex flex-col justify-between shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              Pending Review
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-poppins font-bold text-amber-600 dark:text-amber-400">
              {stats ? stats.pending : registrations.filter((r) => r.status === "pending").length}
            </span>
            <p className="text-[11px] text-muted-foreground mt-0.5">Action required</p>
          </div>
        </div>

        {/* Teams vs Solo */}
        <div className="glass-panel rounded-2xl p-4 border border-purple-500/30 bg-purple-500/[0.02] flex flex-col justify-between shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
              Participation Mode
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-poppins font-bold text-purple-600 dark:text-purple-400">
                {stats ? stats.teamCount : registrations.filter((r) => r.teamSize > 1).length}
              </span>
              <span className="text-xs text-muted-foreground font-semibold">Teams</span>
              <span className="text-sm text-muted-foreground">/</span>
              <span className="text-lg font-bold text-foreground">
                {stats ? stats.soloCount : registrations.filter((r) => r.teamSize === 1).length}
              </span>
              <span className="text-xs text-muted-foreground">Solo</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">No slot limits • Open to all</p>
          </div>
        </div>

        {/* Venue & Evaluation */}
        <div className="glass-panel rounded-2xl p-4 border border-blue-500/30 bg-blue-500/[0.02] flex flex-col justify-between shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Venue &amp; Prizes
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-sm font-bold text-foreground truncate">
              IBM Lab, LTSU Punjab
            </div>
            <p className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold mt-0.5">
              80% UI/UX &bull; 30% Backend &bull; Trophies &amp; Cash
            </p>
          </div>
        </div>
      </div>

      {/* Toolbar: Search, Filters, Sorters & Export */}
      <div className="glass-panel rounded-2xl p-4 border border-border/80 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
              <Search className="w-4 h-4" />
            </div>
            <Input
              type="text"
              placeholder="Search by participant name, roll number, team name, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-background/50 border-border/60 rounded-xl text-xs sm:text-sm"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Refresh & Manual Entry */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={loading}
              className="rounded-xl h-10 px-3 text-xs gap-1.5 shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>

            <Button
              size="sm"
              onClick={onOpenAddModal}
              className="rounded-xl h-10 px-3.5 text-xs font-bold gap-1.5 border-2 border-black bg-[#FFE600] text-black hover:bg-[#FFDE59] shadow-[2px_2px_0px_#000] shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>+ Add Participant</span>
            </Button>
          </div>
        </div>

        {/* Second Row: Filters and Excel Export Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/60">
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 px-3 rounded-xl border border-border/80 bg-background text-xs font-medium text-foreground focus:outline-none"
            >
              <option value="all">All Statuses ({registrations.length})</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>

            {/* Focus Filter */}
            <select
              value={trackFilter}
              onChange={(e) => setTrackFilter(e.target.value)}
              className="h-9 px-3 rounded-xl border border-border/80 bg-background text-xs font-medium text-foreground focus:outline-none"
            >
              <option value="all">All Focus Tracks</option>
              <option value="fullstack">UI/UX + Backend</option>
              <option value="ui-ux">UI/UX (80%)</option>
              <option value="backend">Backend (30%)</option>
            </select>

            {/* Year Filter */}
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="h-9 px-3 rounded-xl border border-border/80 bg-background text-xs font-medium text-foreground focus:outline-none"
            >
              <option value="all">All Years</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "newest" | "oldest" | "name")}
              className="h-9 px-3 rounded-xl border border-border/80 bg-background text-xs font-medium text-foreground focus:outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>

          {/* Export Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportAttendance}
              className="rounded-xl h-9 px-3 text-xs gap-1.5 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Export Attendance Excel</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleExportData}
              className="rounded-xl h-9 px-3 text-xs gap-1.5 border-primary/40 text-primary hover:bg-primary/10 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export All Registrations</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleExportBlank}
              className="rounded-xl h-9 px-2.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <span>Blank Template</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
        <span>
          Showing <strong className="text-foreground">{filteredRegistrations.length}</strong> of{" "}
          {registrations.length} Designathon teams / participants
        </span>
        {(searchQuery || statusFilter !== "all" || trackFilter !== "all" || yearFilter !== "all") && (
          <button
            onClick={() => {
              setSearchQuery("");
              setStatusFilter("all");
              setTrackFilter("all");
              setYearFilter("all");
            }}
            className="text-primary hover:underline font-medium cursor-pointer"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Data Presentation */}
      {loading ? (
        <div className="py-20 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Loading Designathon records...</p>
        </div>
      ) : filteredRegistrations.length === 0 ? (
        <div className="glass-panel rounded-3xl p-10 sm:p-14 text-center border border-border/80 max-w-lg mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#FFE600] border-2 border-black flex items-center justify-center text-black mx-auto shadow-[3px_3px_0px_#000]">
            <Sparkles className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold font-poppins text-foreground">
              {searchQuery || statusFilter !== "all" || trackFilter !== "all" || yearFilter !== "all"
                ? "No matching registrations found"
                : "No Designathon Registrations Yet"}
            </h3>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto">
              {searchQuery || statusFilter !== "all" || trackFilter !== "all" || yearFilter !== "all"
                ? "Try clearing filters or search terms to inspect more registrations."
                : "Registrations are live on the website. As participants apply, their entries will show here."}
            </p>
          </div>
          <div className="pt-2">
            <Button
              onClick={onOpenAddModal}
              className="rounded-xl border-2 border-black bg-[#FFE600] text-black font-bold hover:bg-[#FFDE59] shadow-[2px_2px_0px_#000] text-xs"
            >
              + Register First Participant Manually
            </Button>
          </div>
        </div>
      ) : (
        <div className="glass-panel rounded-3xl border border-border/80 overflow-hidden shadow-subtle">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border/80 bg-secondary/50 font-semibold text-muted-foreground">
                  <th className="py-3.5 px-3 w-10 text-center">#</th>
                  <th className="py-3.5 px-3">Team Name</th>
                  <th className="py-3.5 px-3">Team Size</th>
                  <th className="py-3.5 px-3">Name</th>
                  <th className="py-3.5 px-3">Roll No.</th>
                  <th className="py-3.5 px-3">Branch</th>
                  <th className="py-3.5 px-3">Sem</th>
                  <th className="py-3.5 px-3">Phone NO.</th>
                  <th className="py-3.5 px-3">Email</th>
                  <th className="py-3.5 px-3 text-center">Status</th>
                  <th className="py-3.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredRegistrations.map((reg, idx) => (
                  <tr
                    key={reg.id}
                    className="hover:bg-secondary/30 transition-colors group"
                  >
                    <td className="py-3.5 px-3 text-center text-muted-foreground font-mono">
                      {idx + 1}
                    </td>

                    {/* Team Name */}
                    <td className="py-3.5 px-3">
                      <span className="font-bold text-foreground">{reg.teamName}</span>
                    </td>

                    {/* Team Size */}
                    <td className="py-3.5 px-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-secondary text-foreground text-[11px] font-semibold">
                        <Users className="w-3 h-3 text-primary" />
                        {reg.teamSize === 1 ? "1 (Solo)" : `${reg.teamSize} Members`}
                      </span>
                    </td>

                    {/* Name */}
                    <td className="py-3.5 px-3">
                      <span className="font-semibold text-foreground">{reg.fullName}</span>
                      {reg.teammates && reg.teammates.length > 0 && (
                        <div className="text-[10px] text-muted-foreground">
                          +{reg.teammates.length} teammate{reg.teammates.length > 1 ? "s" : ""}
                        </div>
                      )}
                    </td>

                    {/* Roll No. */}
                    <td className="py-3.5 px-3">
                      <span className="font-mono text-muted-foreground">{reg.rollNumber}</span>
                    </td>

                    {/* Branch */}
                    <td className="py-3.5 px-3">
                      <span className="text-foreground">{reg.branch}</span>
                    </td>

                    {/* Sem */}
                    <td className="py-3.5 px-3">
                      <span className="text-muted-foreground">{reg.sem || reg.semester || "1st Sem"}</span>
                    </td>

                    {/* Phone NO. */}
                    <td className="py-3.5 px-3">
                      <a href={`tel:${reg.phone}`} className="hover:text-primary transition-colors">
                        {reg.phone}
                      </a>
                    </td>

                    {/* Email */}
                    <td className="py-3.5 px-3">
                      <a href={`mailto:${reg.email}`} className="truncate max-w-[140px] block hover:text-primary transition-colors">
                        {reg.email}
                      </a>
                    </td>

                    {/* Status Badge with Quick Update Dropdown */}
                    <td className="py-3.5 px-3 text-center">
                      <div className="inline-flex items-center gap-1">
                        <select
                          value={reg.status}
                          disabled={actionLoadingId === reg.id}
                          onChange={(e) =>
                            handleStatusChangeInternal(
                              reg.id,
                              e.target.value as "pending" | "approved" | "rejected"
                            )
                          }
                          className={`h-7 px-2 rounded-lg text-[10px] font-bold border cursor-pointer focus:outline-none transition-colors ${
                            reg.status === "approved"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                              : reg.status === "rejected"
                              ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30"
                              : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                          }`}
                        >
                          <option value="approved">Approved</option>
                          <option value="pending">Pending</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>
                    </td>

                    {/* Actions: View Details and Delete */}
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedReg(reg)}
                          className="h-8 w-8 p-0 rounded-lg text-muted-foreground hover:text-foreground"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteConfirmId(reg.id)}
                          className="h-8 w-8 p-0 rounded-lg text-rose-500/70 hover:text-rose-500 hover:bg-rose-500/10"
                          title="Delete Registration"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Registration Details Modal */}
      {selectedReg && (
        <Dialog open={!!selectedReg} onOpenChange={(open) => !open && setSelectedReg(null)}>
          <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto p-6 rounded-3xl border-2 border-black bg-background shadow-[8px_8px_0px_#000]">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    selectedReg.status === "approved"
                      ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/30"
                      : selectedReg.status === "rejected"
                      ? "bg-rose-500/10 text-rose-600 border border-rose-500/30"
                      : "bg-amber-500/10 text-amber-600 border border-amber-500/30"
                  }`}
                >
                  {selectedReg.status}
                </span>
                <span className="text-[10px] font-mono text-muted-foreground">
                  {selectedReg.id}
                </span>
              </div>
              <DialogTitle className="text-xl font-black font-space mt-1">
                {selectedReg.teamName}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Venue: {selectedReg.venue} &bull; Team Size: {selectedReg.teamSize === 1 ? "1 Member (Solo)" : `${selectedReg.teamSize} Members`}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 pt-3 text-xs">
              {/* Leader Details */}
              <div className="p-3.5 rounded-2xl bg-secondary/40 border border-border/80 space-y-2">
                <div className="font-bold text-foreground">
                  {selectedReg.teamSize === 1 ? "Participant Details" : "Leader Details"}
                </div>
                <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                  <div>
                    <span className="font-semibold text-foreground">Name:</span> {selectedReg.fullName}
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">Roll No.:</span> {selectedReg.rollNumber}
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">Branch:</span> {selectedReg.branch}
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">Sem:</span> {selectedReg.sem || selectedReg.semester || "1st Sem"}
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">Phone NO.:</span> {selectedReg.phone}
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">Email:</span> {selectedReg.email}
                  </div>
                </div>
              </div>

              {/* Teammates List */}
              {selectedReg.teammates && selectedReg.teammates.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-secondary/40 border border-border/80 space-y-2">
                  <div className="font-bold text-foreground">
                    Teammates ({selectedReg.teammates.length})
                  </div>
                  <div className="space-y-2">
                    {selectedReg.teammates.map((tm, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-background border border-border/60 space-y-1.5"
                      >
                        <span className="text-[11px] font-bold text-foreground block">
                          Teammate #{idx + 2}
                        </span>
                        <div className="grid grid-cols-2 gap-2 text-muted-foreground text-[11px]">
                          <div>
                            <span className="font-semibold text-foreground">Name:</span> {tm.name}
                          </div>
                          <div>
                            <span className="font-semibold text-foreground">Roll No.:</span> {tm.rollNumber}
                          </div>
                          <div>
                            <span className="font-semibold text-foreground">Branch:</span> {tm.branch}
                          </div>
                          <div>
                            <span className="font-semibold text-foreground">Sem:</span> {tm.sem}
                          </div>
                          <div>
                            <span className="font-semibold text-foreground">Phone NO.:</span> {tm.phone}
                          </div>
                          <div>
                            <span className="font-semibold text-foreground">Email:</span> {tm.email}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions in Dialog */}
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <div className="flex items-center gap-1.5">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStatusChangeInternal(selectedReg.id, "approved")}
                    className="rounded-xl text-xs text-emerald-600 border-emerald-500/40"
                  >
                    <Check className="w-3.5 h-3.5 mr-1" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStatusChangeInternal(selectedReg.id, "rejected")}
                    className="rounded-xl text-xs text-rose-600 border-rose-500/40"
                  >
                    <X className="w-3.5 h-3.5 mr-1" />
                    Reject
                  </Button>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedReg(null)}
                  className="rounded-xl text-xs"
                >
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
          <DialogContent className="max-w-md p-6 rounded-3xl border-2 border-black bg-background shadow-[8px_8px_0px_#000]">
            <DialogHeader>
              <div className="w-10 h-10 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mb-2">
                <Trash2 className="w-5 h-5" />
              </div>
              <DialogTitle className="text-lg font-bold">Delete Registration Record?</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                This will permanently delete this Designathon entry from the database. This action cannot be undone.
              </DialogDescription>
            </DialogHeader>

            <div className="flex items-center justify-end gap-2 pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeleteConfirmId(null)}
                className="rounded-xl text-xs"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDeleteInternal(deleteConfirmId)}
                disabled={actionLoadingId === deleteConfirmId}
                className="rounded-xl text-xs font-bold"
              >
                {actionLoadingId === deleteConfirmId ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                    Deleting...
                  </>
                ) : (
                  "Delete Record"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
