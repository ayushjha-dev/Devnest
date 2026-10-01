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
  CheckCircle2,
  AlertCircle,
  Loader2,
  Trophy,
  MapPin,
  Users,
  User,
} from "lucide-react";
import type { DesignathonTeammate } from "../../server/designathon-storage";

interface DesignathonApplyDialogProps {
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

export function DesignathonApplyDialog({
  open,
  onOpenChange,
  onSuccess,
}: DesignathonApplyDialogProps) {
  // Team info
  const [teamName, setTeamName] = useState("");
  const [teamSize, setTeamSize] = useState<number>(1);

  // Leader details
  const [leaderName, setLeaderName] = useState("");
  const [leaderRollNumber, setLeaderRollNumber] = useState("");
  const [leaderBranch, setLeaderBranch] = useState("");
  const [leaderSem, setLeaderSem] = useState("");
  const [leaderPhone, setLeaderPhone] = useState("");
  const [leaderEmail, setLeaderEmail] = useState("");

  // Teammates details (indices 0, 1, 2 correspond to Teammate 2, 3, 4)
  const [teammates, setTeammates] = useState<DesignathonTeammate[]>([
    emptyTeammate(),
    emptyTeammate(),
    emptyTeammate(),
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedId, setSubmittedId] = useState("");

  const handleTeamSizeChange = (val: number) => {
    setTeamSize(val);
  };

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

    if (!teamName.trim()) {
      setErrorMessage("Please enter Team Name.");
      return;
    }

    // Validate leader
    if (!leaderName.trim()) {
      setErrorMessage("Please enter Leader Name.");
      return;
    }
    if (!leaderRollNumber.trim()) {
      setErrorMessage("Please enter Leader Roll No.");
      return;
    }
    if (!leaderBranch.trim()) {
      setErrorMessage("Please enter Leader Course with Section Name.");
      return;
    }
    if (!leaderSem.trim()) {
      setErrorMessage("Please enter Leader Semester (Sem).");
      return;
    }
    if (!leaderPhone.trim()) {
      setErrorMessage("Please enter Leader Phone Number.");
      return;
    }
    if (!leaderEmail.trim() || !leaderEmail.includes("@")) {
      setErrorMessage("Please enter a valid Leader Email Address.");
      return;
    }

    // Validate revealed teammates
    if (teamSize > 1) {
      for (let i = 0; i < teamSize - 1; i++) {
        const tm = teammates[i];
        const num = i + 2;
        if (!tm.name.trim()) {
          setErrorMessage(`Please enter Name for Teammate #${num}.`);
          return;
        }
        if (!tm.rollNumber.trim()) {
          setErrorMessage(`Please enter Roll No. for Teammate #${num}.`);
          return;
        }
        if (!tm.branch.trim()) {
          setErrorMessage(`Please enter Course with Section Name for Teammate #${num}.`);
          return;
        }
        if (!tm.sem.trim()) {
          setErrorMessage(`Please enter Sem for Teammate #${num}.`);
          return;
        }
        if (!tm.phone.trim()) {
          setErrorMessage(`Please enter Phone No. for Teammate #${num}.`);
          return;
        }
        if (!tm.email.trim() || !tm.email.includes("@")) {
          setErrorMessage(`Please enter a valid Email for Teammate #${num}.`);
          return;
        }
      }
    }

    setIsSubmitting(true);

    try {
      const payload = {
        teamName: teamName.trim(),
        teamSize,
        fullName: leaderName.trim(),
        rollNumber: leaderRollNumber.trim(),
        branch: leaderBranch.trim(),
        sem: leaderSem.trim(),
        phone: leaderPhone.trim(),
        email: leaderEmail.trim().toLowerCase(),
        teammates: teamSize > 1 ? teammates.slice(0, teamSize - 1) : [],
      };

      const res = await fetch("/api/events/designathon-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit registration.");
      }

      setSubmittedId(data.registration?.id || "Registered");
      setIsSubmitted(true);
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setSubmittedId("");
    setTeamName("");
    setTeamSize(1);
    setLeaderName("");
    setLeaderRollNumber("");
    setLeaderBranch("");
    setLeaderSem("");
    setLeaderPhone("");
    setLeaderEmail("");
    setTeammates([emptyTeammate(), emptyTeammate(), emptyTeammate()]);
    setErrorMessage("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[92vh] overflow-y-auto p-0 rounded-3xl border-2 border-black bg-background shadow-[8px_8px_0px_#000]">
        {/* Header Banner */}
        <div className="bg-[#FFE600] border-b-2 border-black p-6 sm:p-7 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-black text-[#FFE600] text-[11px] font-black uppercase tracking-wider">
                Registrations Open
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/90 text-black border border-black text-[11px] font-bold">
                Open to All Students
              </span>
            </div>

            <DialogTitle className="text-2xl sm:text-3xl font-black font-space text-black tracking-tight">
              DevNest Designathon 2026
            </DialogTitle>
            <DialogDescription className="text-black/85 font-medium text-xs sm:text-sm mt-1">
              Venue: IBM Lab, LTSU Punjab &bull; Trophies &amp; Cash Prizes &bull; 70% UI/UX &bull; 30% Backend
            </DialogDescription>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-7">
          {isSubmitted ? (
            <div className="py-8 text-center space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center text-emerald-600 mx-auto shadow-[3px_3px_0px_#059669]">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black font-space text-foreground">
                  Registration Confirmed!
                </h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Team <strong>{teamName}</strong> is registered for <strong>DevNest Designathon</strong>. See you at IBM Lab, LTSU Punjab!
                </p>
                <div className="inline-block px-4 py-2 rounded-xl bg-secondary/80 border border-border text-xs font-mono font-bold text-foreground">
                  Ref ID: {submittedId}
                </div>
              </div>

              <Button
                onClick={handleReset}
                className="rounded-xl border-2 border-black bg-[#FFE600] text-black font-bold hover:bg-[#FFDE59] shadow-[3px_3px_0px_#000] px-6"
              >
                Done
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* 1. Team Information: Team Name & Single Team Size Dropdown */}
              <div className="p-4 rounded-2xl bg-secondary/40 border border-border/80 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-primary" />
                  <span>Team Setup</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Team Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">
                      Team Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      required
                      placeholder="e.g. DesignMasters"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      className="rounded-xl border-2 border-border focus:border-black bg-background text-xs"
                    />
                  </div>

                  {/* Single Team Size Dropdown */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">
                      Team Size <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={teamSize}
                      onChange={(e) => handleTeamSizeChange(Number(e.target.value))}
                      className="w-full h-10 px-3 rounded-xl border-2 border-border bg-background text-xs font-bold text-foreground focus:border-black cursor-pointer"
                    >
                      <option value={1}>1 Member (Solo)</option>
                      <option value={2}>2 Members</option>
                      <option value={3}>3 Members</option>
                      <option value={4}>4 Members</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 2. Leader Details: Name, Roll No., Branch, Sem, Phone NO., Email */}
              <div className="p-4 rounded-2xl bg-secondary/30 border border-border/80 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-primary" />
                  <span>{teamSize === 1 ? "Participant Details" : "Leader Details"}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      required
                      placeholder="Full Name"
                      value={leaderName}
                      onChange={(e) => setLeaderName(e.target.value)}
                      className="rounded-xl border-2 border-border text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground">
                      Roll No. <span className="text-red-500">*</span>
                    </label>
                    <Input
                      required
                      placeholder="Roll Number"
                      value={leaderRollNumber}
                      onChange={(e) => setLeaderRollNumber(e.target.value)}
                      className="rounded-xl border-2 border-border text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground">
                      Course with Section Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      required
                      placeholder="e.g. B.Tech CSE (AIML) - Sec A"
                      value={leaderBranch}
                      onChange={(e) => setLeaderBranch(e.target.value)}
                      className="rounded-xl border-2 border-border text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground">
                      Sem <span className="text-red-500">*</span>
                    </label>
                    <Input
                      required
                      placeholder="e.g. 1st, 2nd, 3rd, 5th"
                      value={leaderSem}
                      onChange={(e) => setLeaderSem(e.target.value)}
                      className="rounded-xl border-2 border-border text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground">
                      Phone NO. <span className="text-red-500">*</span>
                    </label>
                    <Input
                      required
                      type="tel"
                      placeholder="Phone Number"
                      value={leaderPhone}
                      onChange={(e) => setLeaderPhone(e.target.value)}
                      className="rounded-xl border-2 border-border text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <Input
                      required
                      type="email"
                      placeholder="Email Address"
                      value={leaderEmail}
                      onChange={(e) => setLeaderEmail(e.target.value)}
                      className="rounded-xl border-2 border-border text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Teammates Details (Space revealed when Team Size > 1) */}
              {teamSize > 1 && (
                <div className="space-y-4">
                  {Array.from({ length: teamSize - 1 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-secondary/30 border border-border/80 space-y-3"
                    >
                      <div className="text-xs font-bold text-foreground flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-[10px] flex items-center justify-center font-bold">
                          {idx + 2}
                        </span>
                        <span>Teammate #{idx + 2} Details</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-foreground">
                            Name <span className="text-red-500">*</span>
                          </label>
                          <Input
                            required
                            placeholder="Full Name"
                            value={teammates[idx]?.name || ""}
                            onChange={(e) => handleTeammateChange(idx, "name", e.target.value)}
                            className="rounded-xl border-2 border-border text-xs"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-foreground">
                            Roll No. <span className="text-red-500">*</span>
                          </label>
                          <Input
                            required
                            placeholder="Roll Number"
                            value={teammates[idx]?.rollNumber || ""}
                            onChange={(e) => handleTeammateChange(idx, "rollNumber", e.target.value)}
                            className="rounded-xl border-2 border-border text-xs"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-foreground">
                            Course with Section Name <span className="text-red-500">*</span>
                          </label>
                          <Input
                            required
                            placeholder="e.g. B.Tech CSE (AIML) - Sec A"
                            value={teammates[idx]?.branch || ""}
                            onChange={(e) => handleTeammateChange(idx, "branch", e.target.value)}
                            className="rounded-xl border-2 border-border text-xs"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-foreground">
                            Sem <span className="text-red-500">*</span>
                          </label>
                          <Input
                            required
                            placeholder="e.g. 1st, 2nd, 3rd, 5th"
                            value={teammates[idx]?.sem || ""}
                            onChange={(e) => handleTeammateChange(idx, "sem", e.target.value)}
                            className="rounded-xl border-2 border-border text-xs"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-foreground">
                            Phone NO. <span className="text-red-500">*</span>
                          </label>
                          <Input
                            required
                            type="tel"
                            placeholder="Phone Number"
                            value={teammates[idx]?.phone || ""}
                            onChange={(e) => handleTeammateChange(idx, "phone", e.target.value)}
                            className="rounded-xl border-2 border-border text-xs"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-foreground">
                            Email <span className="text-red-500">*</span>
                          </label>
                          <Input
                            required
                            type="email"
                            placeholder="Email Address"
                            value={teammates[idx]?.email || ""}
                            onChange={(e) => handleTeammateChange(idx, "email", e.target.value)}
                            className="rounded-xl border-2 border-border text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Submit Footer */}
              <div className="pt-3 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-[11px] text-muted-foreground">
                  Venue: <strong>IBM Lab, LTSU Punjab</strong>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    className="w-1/2 sm:w-auto rounded-xl"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-1/2 sm:w-auto rounded-xl border-2 border-black bg-[#FFE600] text-black font-black hover:bg-[#FFDE59] shadow-[3px_3px_0px_#000] cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-1.5" />
                        Submit Registration
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
