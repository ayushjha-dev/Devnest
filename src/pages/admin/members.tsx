import { useEffect, useState } from "react";
import Head from "next/head";
import { Layout } from "@/components/Layout";
import {
  getAllMembers,
  getMemberStats,
  deleteMember,
  updateMember,
  searchMembers,
  type Member,
} from "@/lib/firestore/members";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Search,
  Loader2,
  Eye,
  Trash2,
  UserCheck,
  UserX,
  Download,
  RefreshCw,
  TrendingUp,
  Award,
  UserPlus,
} from "lucide-react";
import { Timestamp } from "firebase/firestore";

export default function MembersDashboard() {
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    regular: 0,
    core: 0,
    alumni: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "regular" | "core" | "alumni">("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  // Fetch members and stats
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [membersData, statsData] = await Promise.all([
        getAllMembers(),
        getMemberStats(),
      ]);
      setMembers(membersData);
      setFilteredMembers(membersData);
      setStats(statsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle search
  useEffect(() => {
    if (searchTerm.trim() === "") {
      applyFilters(members);
    } else {
      const searchResults = members.filter(
        (member) =>
          member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.enrollmentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      applyFilters(searchResults);
    }
  }, [searchTerm, filterType, filterStatus, members]);

  // Apply filters
  const applyFilters = (membersList: Member[]) => {
    let filtered = [...membersList];

    if (filterType !== "all") {
      filtered = filtered.filter((m) => m.membershipType === filterType);
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((m) => m.status === filterStatus);
    }

    setFilteredMembers(filtered);
  };

  // Delete member
  const handleDeleteMember = async (memberId: string) => {
    if (!confirm("Are you sure you want to delete this member?")) return;

    try {
      await deleteMember(memberId);
      await fetchData();
    } catch (error) {
      console.error("Error deleting member:", error);
      alert("Failed to delete member");
    }
  };

  // Toggle member status
  const handleToggleStatus = async (member: Member) => {
    try {
      await updateMember(member.id!, {
        status: member.status === "active" ? "inactive" : "active",
      });
      await fetchData();
    } catch (error) {
      console.error("Error updating member status:", error);
      alert("Failed to update member status");
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      "Name",
      "Email",
      "Phone",
      "Enrollment",
      "Branch",
      "Year",
      "Semester",
      "Type",
      "Status",
      "Joining Date",
    ];

    const csvData = filteredMembers.map((member) => [
      member.fullName,
      member.email,
      member.phone,
      member.enrollmentNumber,
      member.branch,
      member.year,
      member.semester,
      member.membershipType,
      member.status,
      member.joiningDate instanceof Timestamp
        ? member.joiningDate.toDate().toLocaleDateString()
        : new Date(member.joiningDate).toLocaleDateString(),
    ]);

    const csv = [headers, ...csvData].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `devnest-members-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  // Format date
  const formatDate = (date: Date | Timestamp) => {
    if (date instanceof Timestamp) {
      return date.toDate().toLocaleDateString();
    }
    return new Date(date).toLocaleDateString();
  };

  return (
    <Layout>
      <Head>
        <title>DevNest | Members Dashboard</title>
      </Head>

      <div className="relative min-h-screen py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Members Dashboard</h1>
            <p className="text-muted-foreground">
              Manage DevNest club members and registrations
            </p>
          </header>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <div className="p-4 rounded-lg border border-border bg-card">
              <div className="flex items-center gap-2 text-primary mb-1">
                <Users className="w-4 h-4" />
                <p className="text-xs font-semibold uppercase">Total</p>
              </div>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>

            <div className="p-4 rounded-lg border border-green-500/30 bg-green-500/5">
              <div className="flex items-center gap-2 text-green-600 mb-1">
                <UserCheck className="w-4 h-4" />
                <p className="text-xs font-semibold uppercase">Active</p>
              </div>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </div>

            <div className="p-4 rounded-lg border border-red-500/30 bg-red-500/5">
              <div className="flex items-center gap-2 text-red-600 mb-1">
                <UserX className="w-4 h-4" />
                <p className="text-xs font-semibold uppercase">Inactive</p>
              </div>
              <p className="text-2xl font-bold text-red-600">{stats.inactive}</p>
            </div>

            <div className="p-4 rounded-lg border border-border bg-card">
              <div className="flex items-center gap-2 text-blue-600 mb-1">
                <UserPlus className="w-4 h-4" />
                <p className="text-xs font-semibold uppercase">Regular</p>
              </div>
              <p className="text-2xl font-bold text-blue-600">{stats.regular}</p>
            </div>

            <div className="p-4 rounded-lg border border-border bg-card">
              <div className="flex items-center gap-2 text-purple-600 mb-1">
                <Award className="w-4 h-4" />
                <p className="text-xs font-semibold uppercase">Core</p>
              </div>
              <p className="text-2xl font-bold text-purple-600">{stats.core}</p>
            </div>

            <div className="p-4 rounded-lg border border-border bg-card">
              <div className="flex items-center gap-2 text-amber-600 mb-1">
                <TrendingUp className="w-4 h-4" />
                <p className="text-xs font-semibold uppercase">Alumni</p>
              </div>
              <p className="text-2xl font-bold text-amber-600">{stats.alumni}</p>
            </div>
          </div>

          {/* Filters and Actions */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-[250px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or enrollment..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="regular">Regular</SelectItem>
                <SelectItem value="core">Core</SelectItem>
                <SelectItem value="alumni">Alumni</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={fetchData} variant="outline" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>

            <Button onClick={handleExportCSV} variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
          </div>

          {/* Members Table */}
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="text-center p-12">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Members Found</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? "Try adjusting your search terms" : "No members registered yet"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Enrollment</TableHead>
                      <TableHead>Branch</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMembers.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell className="font-medium">{member.fullName}</TableCell>
                        <TableCell className="text-sm">{member.email}</TableCell>
                        <TableCell className="text-sm">{member.enrollmentNumber}</TableCell>
                        <TableCell className="text-sm">{member.branch}</TableCell>
                        <TableCell className="text-sm">{member.year}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              member.membershipType === "core"
                                ? "bg-purple-500/10 text-purple-600"
                                : member.membershipType === "alumni"
                                ? "bg-amber-500/10 text-amber-600"
                                : "bg-blue-500/10 text-blue-600"
                            }`}
                          >
                            {member.membershipType}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              member.status === "active"
                                ? "bg-green-500/10 text-green-600"
                                : "bg-red-500/10 text-red-600"
                            }`}
                          >
                            {member.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatDate(member.joiningDate)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSelectedMember(member)}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Member Details</DialogTitle>
                                  <DialogDescription>
                                    Complete information about {member.fullName}
                                  </DialogDescription>
                                </DialogHeader>
                                {selectedMember && (
                                  <div className="space-y-4">
                                    <div>
                                      <h4 className="font-semibold mb-2">Personal Information</h4>
                                      <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div>
                                          <p className="text-muted-foreground">Name</p>
                                          <p className="font-medium">{selectedMember.fullName}</p>
                                        </div>
                                        <div>
                                          <p className="text-muted-foreground">Email</p>
                                          <p className="font-medium">{selectedMember.email}</p>
                                        </div>
                                        <div>
                                          <p className="text-muted-foreground">Phone</p>
                                          <p className="font-medium">{selectedMember.phone}</p>
                                        </div>
                                        <div>
                                          <p className="text-muted-foreground">Enrollment</p>
                                          <p className="font-medium">
                                            {selectedMember.enrollmentNumber}
                                          </p>
                                        </div>
                                      </div>
                                    </div>

                                    <div>
                                      <h4 className="font-semibold mb-2">Academic Information</h4>
                                      <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div>
                                          <p className="text-muted-foreground">Branch</p>
                                          <p className="font-medium">{selectedMember.branch}</p>
                                        </div>
                                        <div>
                                          <p className="text-muted-foreground">Year</p>
                                          <p className="font-medium">{selectedMember.year}</p>
                                        </div>
                                        <div>
                                          <p className="text-muted-foreground">Semester</p>
                                          <p className="font-medium">{selectedMember.semester}</p>
                                        </div>
                                        <div>
                                          <p className="text-muted-foreground">Membership Type</p>
                                          <p className="font-medium capitalize">
                                            {selectedMember.membershipType}
                                          </p>
                                        </div>
                                      </div>
                                    </div>

                                    <div>
                                      <h4 className="font-semibold mb-2">Interests</h4>
                                      <div className="flex flex-wrap gap-2">
                                        {selectedMember.interests.map((interest, idx) => (
                                          <span
                                            key={idx}
                                            className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                                          >
                                            {interest}
                                          </span>
                                        ))}
                                      </div>
                                    </div>

                                    <div>
                                      <h4 className="font-semibold mb-2">Skills</h4>
                                      <div className="flex flex-wrap gap-2">
                                        {selectedMember.skills.map((skill, idx) => (
                                          <span
                                            key={idx}
                                            className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm"
                                          >
                                            {skill}
                                          </span>
                                        ))}
                                      </div>
                                    </div>

                                    {(selectedMember.linkedin ||
                                      selectedMember.github ||
                                      selectedMember.portfolio) && (
                                      <div>
                                        <h4 className="font-semibold mb-2">Social Links</h4>
                                        <div className="space-y-2 text-sm">
                                          {selectedMember.linkedin && (
                                            <p>
                                              <span className="text-muted-foreground">LinkedIn: </span>
                                              <a
                                                href={selectedMember.linkedin}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary hover:underline"
                                              >
                                                {selectedMember.linkedin}
                                              </a>
                                            </p>
                                          )}
                                          {selectedMember.github && (
                                            <p>
                                              <span className="text-muted-foreground">GitHub: </span>
                                              <a
                                                href={selectedMember.github}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary hover:underline"
                                              >
                                                {selectedMember.github}
                                              </a>
                                            </p>
                                          )}
                                          {selectedMember.portfolio && (
                                            <p>
                                              <span className="text-muted-foreground">Portfolio: </span>
                                              <a
                                                href={selectedMember.portfolio}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary hover:underline"
                                              >
                                                {selectedMember.portfolio}
                                              </a>
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleStatus(member)}
                              title={
                                member.status === "active"
                                  ? "Deactivate member"
                                  : "Activate member"
                              }
                            >
                              {member.status === "active" ? (
                                <UserX className="w-4 h-4 text-red-600" />
                              ) : (
                                <UserCheck className="w-4 h-4 text-green-600" />
                              )}
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteMember(member.id!)}
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>

          <div className="mt-4 text-sm text-muted-foreground">
            Showing {filteredMembers.length} of {members.length} members
          </div>
        </div>
      </div>
    </Layout>
  );
}
