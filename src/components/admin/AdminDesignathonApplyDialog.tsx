import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sparkles,
  AlertCircle,
  Loader2,
  Users,
  User,
} from "lucide-react";
import type { DesignathonTeammate } from "../../../server/designathon-storage";

interface AdminDesignathonApplyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const emptyTeammate = (): DesignathonTeammate => ({
  name: "",
  rollNumber: "",
  branch: "",
  sem: "",
  phone: "",
  email: "",
});

export function AdminDesignathonApplyDialog({
  open,
  onOpenChange,
  onSuccess,
}: AdminDesignathonApplyDialogProps) {
  const [teamName, setTeamName] = useState("");
  const [teamSize, setTeamSize] = useState<number>(1);
  const [status, setStatus] = useState<"pending" | "approved">("approved");

  // Leader details
  const [leaderName, setLeaderName] = useState("");
  const [leaderRollNumber, setLeaderRollNumber] = useState("");
  const [leaderBranch, setLeaderBranch] = useState("");
  const [leaderSem, setLeaderSem] = useState("");
  const [leaderPhone, setLeaderPhone] = useState("");
  const [leaderEmail, setLeaderEmail] = useState("");

  // Teammates details
  const [teammates, setTeammates] = useState<DesignathonTeammate[]>([
    emptyTeammate(),
    emptyTeammate(),
    emptyTeammate(),
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleTeammateChange = (
    index: number,
    field: keyof DesignathonTeammate,
    value: string
  ) => {
    setTeammates((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!teamName.trim() || !leaderName.trim() || !leaderRollNumber.trim() || !leaderBranch.trim() || !leaderSem.trim() || !leaderPhone.trim() || !leaderEmail.trim()) {
      setErrorMessage("Please fill all required Leader and Team details.");
      return;
    }

    if (teamSize > 1) {
      for (let i = 0; i < teamSize - 1; i++) {
        const tm = teammates[i];
        if (!tm.name.trim() || !tm.rollNumber.trim() || !tm.branch.trim() || !tm.sem.trim() || !tm.phone.trim() || !tm.email.trim()) {
          setErrorMessage(`Please fill all required details for Teammate #${i + 2}.`);
          return;
        }
      }
    }

    setIsSubmitting(true);

    try {
      const payload = {
        teamName: teamName.trim(),
        teamSize,
        status,
        fullName: leaderName.trim(),
        rollNumber: leaderRollNumber.trim(),
        branch: leaderBranch.trim(),
        sem: leaderSem.trim(),
        phone: leaderPhone.trim(),
        email: leaderEmail.trim().toLowerCase(),
        teammates: teamSize > 1 ? teammates.slice(0, teamSize - 1) : [],
      };

      const res = await fetch("/api/admin/designathon-registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to register participant.");
      }

      onOpenChange(false);
      // Reset form
      setTeamName("");
      setTeamSize(1);
      setLeaderName("");
      setLeaderRollNumber("");
      setLeaderBranch("");
      setLeaderSem("");
      setLeaderPhone("");
      setLeaderEmail("");
      setTeammates([emptyTeammate(), emptyTeammate(), emptyTeammate()]);
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error saving participant";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto p-6 rounded-3xl border-2 border-black bg-background shadow-[8px_8px_0px_#000]">
        <DialogHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#FFE600] text-black border border-black text-[10px] font-black uppercase">
              Admin Manual Entry
            </span>
          </div>
          <DialogTitle className="text-xl font-black font-space">
            Register Designathon Participant
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Enter team and participant information matching the official attendance format.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-xs flex items-center gap-2 border border-destructive/20">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Team Configuration */}
          <div className="p-3.5 rounded-2xl bg-secondary/40 border border-border/80 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1 sm:col-span-1">
                <label className="text-xs font-bold text-foreground">Team Name *</label>
                <Input
                  required
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Team Name"
                  className="rounded-xl border-2 border-border text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Team Size *</label>
                <select
                  value={teamSize}
                  onChange={(e) => setTeamSize(Number(e.target.value))}
                  className="w-full h-9 px-3 rounded-xl border-2 border-border bg-background text-xs font-bold"
                >
                  <option value={1}>1 Member (Solo)</option>
                  <option value={2}>2 Members</option>
                  <option value={3}>3 Members</option>
                  <option value={4}>4 Members</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Initial Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as "pending" | "approved")}
                  className="w-full h-9 px-3 rounded-xl border-2 border-border bg-background text-xs font-medium"
                >
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
          </div>

          {/* Leader Details */}
          <div className="p-3.5 rounded-2xl bg-secondary/30 border border-border/80 space-y-2">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-primary" />
              <span>Leader Details</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <Input
                required
                placeholder="Name *"
                value={leaderName}
                onChange={(e) => setLeaderName(e.target.value)}
                className="rounded-xl text-xs"
              />
              <Input
                required
                placeholder="Roll No. *"
                value={leaderRollNumber}
                onChange={(e) => setLeaderRollNumber(e.target.value)}
                className="rounded-xl text-xs"
              />
              <Input
                required
                placeholder="Branch *"
                value={leaderBranch}
                onChange={(e) => setLeaderBranch(e.target.value)}
                className="rounded-xl text-xs"
              />
              <Input
                required
                placeholder="Sem *"
                value={leaderSem}
                onChange={(e) => setLeaderSem(e.target.value)}
                className="rounded-xl text-xs"
              />
              <Input
                required
                type="tel"
                placeholder="Phone NO. *"
                value={leaderPhone}
                onChange={(e) => setLeaderPhone(e.target.value)}
                className="rounded-xl text-xs"
              />
              <Input
                required
                type="email"
                placeholder="Email *"
                value={leaderEmail}
                onChange={(e) => setLeaderEmail(e.target.value)}
                className="rounded-xl text-xs"
              />
            </div>
          </div>

          {/* Teammates Details (Space revealed when Team Size > 1) */}
          {teamSize > 1 && (
            <div className="space-y-3">
              {Array.from({ length: teamSize - 1 }).map((_, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-secondary/30 border border-border/80 space-y-2">
                  <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-primary" />
                    <span>Teammate #{idx + 2} Details</span>
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <Input
                      required
                      placeholder="Name *"
                      value={teammates[idx]?.name || ""}
                      onChange={(e) => handleTeammateChange(idx, "name", e.target.value)}
                      className="rounded-xl text-xs"
                    />
                    <Input
                      required
                      placeholder="Roll No. *"
                      value={teammates[idx]?.rollNumber || ""}
                      onChange={(e) => handleTeammateChange(idx, "rollNumber", e.target.value)}
                      className="rounded-xl text-xs"
                    />
                    <Input
                      required
                      placeholder="Branch *"
                      value={teammates[idx]?.branch || ""}
                      onChange={(e) => handleTeammateChange(idx, "branch", e.target.value)}
                      className="rounded-xl text-xs"
                    />
                    <Input
                      required
                      placeholder="Sem *"
                      value={teammates[idx]?.sem || ""}
                      onChange={(e) => handleTeammateChange(idx, "sem", e.target.value)}
                      className="rounded-xl text-xs"
                    />
                    <Input
                      required
                      type="tel"
                      placeholder="Phone NO. *"
                      value={teammates[idx]?.phone || ""}
                      onChange={(e) => handleTeammateChange(idx, "phone", e.target.value)}
                      className="rounded-xl text-xs"
                    />
                    <Input
                      required
                      type="email"
                      placeholder="Email *"
                      value={teammates[idx]?.email || ""}
                      onChange={(e) => handleTeammateChange(idx, "email", e.target.value)}
                      className="rounded-xl text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-xl text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl border-2 border-black bg-[#FFE600] text-black hover:bg-[#FFDE59] font-black text-xs shadow-[2px_2px_0px_#000]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                  Saving...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                  Save Registration
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
