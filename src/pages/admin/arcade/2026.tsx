import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { Download, RefreshCw, Users } from "lucide-react";
import React, { useEffect, useState } from "react";

interface ArcadeUser {
  id: string;
  name: string;
  email: string;
  totalXp: number;
  gamesPlayed: number;
  registeredAt: string;
}

export default function ArcadeAdmin2026() {
  const [users, setUsers] = useState<ArcadeUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalXp: 0,
    avgXp: 0,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const usersRef = collection(db, "arcade_users");
      const q = query(usersRef, orderBy("totalXp", "desc"));
      const snapshot = await getDocs(q);

      const userData: ArcadeUser[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          email: data.email,
          totalXp: data.totalXp || 0,
          gamesPlayed: data.gamesPlayed || 0,
          registeredAt: data.registeredAt,
        };
      });

      setUsers(userData);

      // Calculate stats
      const totalXp = userData.reduce((sum, user) => sum + user.totalXp, 0);
      setStats({
        totalUsers: userData.length,
        totalXp,
        avgXp: userData.length > 0 ? Math.round(totalXp / userData.length) : 0,
      });
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = ["Name", "Email", "Total XP", "Games Played", "Registered At"];
    const rows = users.map((user) => [
      user.name,
      user.email,
      user.totalXp,
      user.gamesPlayed,
      new Date(user.registeredAt).toLocaleString(),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `arcade-users-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <Layout>
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Arcade Admin - 2026</h1>
            <p className="text-muted-foreground">
              Manage and view arcade participants and statistics
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">
                  Total Participants
                </span>
              </div>
              <div className="text-3xl font-bold">{stats.totalUsers}</div>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm text-muted-foreground">Total XP Earned</span>
              </div>
              <div className="text-3xl font-bold font-mono">{stats.totalXp}</div>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm text-muted-foreground">Average XP</span>
              </div>
              <div className="text-3xl font-bold font-mono">{stats.avgXp}</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 mb-6">
            <Button onClick={fetchUsers} variant="outline" disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button onClick={exportToCSV} variant="outline" disabled={users.length === 0}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>

          {/* Users Table */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold mb-4">Participants</h2>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading participants...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg text-muted-foreground">No participants yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rank</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead className="text-right">Total XP</TableHead>
                      <TableHead className="text-right">Games Played</TableHead>
                      <TableHead>Registered</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user, index) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">#{index + 1}</TableCell>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell className="text-muted-foreground">{user.email}</TableCell>
                        <TableCell className="text-right font-mono font-semibold text-primary">
                          {user.totalXp}
                        </TableCell>
                        <TableCell className="text-right">{user.gamesPlayed}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(user.registeredAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
