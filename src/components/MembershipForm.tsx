import { useState } from "react";
import { useForm } from "react-hook-form";
import { addMember, getMemberByEnrollment, getMemberByEmail } from "@/lib/firestore/members";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserPlus, Loader2, CheckCircle2, AlertCircle, MessageCircle } from "lucide-react";
import { WHATSAPP_GROUP_LINK, WHATSAPP_GROUP_NAME } from "@/config/whatsapp";

interface MembershipFormData {
  fullName: string;
  email: string;
  phone: string;
  enrollmentNumber: string;
  branch: string;
  year: string;
  semester: string;
  interests: string;
  skills: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
}

const branches = [
  "Computer Science",
  "Information Technology",
  "Electronics & Communication",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Other",
];

const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
const semesters = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"];

export function MembershipForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<MembershipFormData>();

  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (data: MembershipFormData) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      // Check if enrollment number already exists (only if provided)
      if (data.enrollmentNumber && data.enrollmentNumber.trim() !== "") {
        const existingByEnrollment = await getMemberByEnrollment(data.enrollmentNumber);
        if (existingByEnrollment) {
          setErrorMessage("This enrollment number is already registered!");
          setSubmitStatus("error");
          setIsSubmitting(false);
          return;
        }
      }

      // Check if email already exists
      const existingByEmail = await getMemberByEmail(data.email);
      if (existingByEmail) {
        setErrorMessage("This email is already registered!");
        setSubmitStatus("error");
        setIsSubmitting(false);
        return;
      }

      // Parse interests and skills
      const interestsArray = data.interests
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item.length > 0);

      const skillsArray = data.skills
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item.length > 0);

      // Add member to Firestore
      await addMember({
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        enrollmentNumber: data.enrollmentNumber?.trim() || "N/A",
        branch: selectedBranch,
        year: selectedYear,
        semester: selectedSemester,
        membershipType: "regular",
        joiningDate: new Date(),
        interests: interestsArray,
        skills: skillsArray,
        linkedin: data.linkedin || "",
        github: data.github || "",
        portfolio: data.portfolio || "",
        status: "active",
      });

      setSubmitStatus("success");
      reset();
      setSelectedBranch("");
      setSelectedYear("");
      setSelectedSemester("");

      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus("idle");
      }, 5000);
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrorMessage("Failed to submit registration. Please try again.");
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 rounded-xl border border-border bg-card">
      <div className="mb-6 text-center">
        <div className="inline-flex items-center gap-2 mb-3">
          <UserPlus className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold">DevNest Membership Registration</h2>
        </div>
        <p className="text-muted-foreground">
          Join our community of tech enthusiasts and innovators
        </p>
      </div>

      {submitStatus === "success" && (
        <div className="mb-6 space-y-4">
          <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-semibold text-green-600">Registration Successful!</p>
              <p className="text-sm text-green-600/80">
                Welcome to DevNest! Join our WhatsApp group to stay connected.
              </p>
            </div>
          </div>
          
          <a
            href={WHATSAPP_GROUP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <div className="p-4 rounded-lg bg-green-600 hover:bg-green-500 transition-colors cursor-pointer flex items-center justify-center gap-3 text-white font-semibold">
              <MessageCircle className="w-5 h-5" />
              Join {WHATSAPP_GROUP_NAME}
            </div>
          </a>
        </div>
      )}

      {submitStatus === "error" && (
        <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <div>
            <p className="font-semibold text-red-600">Registration Failed</p>
            <p className="text-sm text-red-600/80">{errorMessage}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b border-border pb-2">
            Personal Information
          </h3>

          <div>
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              placeholder="John Doe"
              {...register("fullName", { required: "Full name is required" })}
              className="mt-1"
            />
            {errors.fullName && (
              <p className="text-sm text-red-600 mt-1">{errors.fullName.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                className="mt-1"
              />
              {errors.email && (
                <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+91 98765 43210"
                {...register("phone", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^[\d\s\-+()]+$/,
                    message: "Invalid phone number",
                  },
                })}
                className="mt-1"
              />
              {errors.phone && (
                <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Academic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b border-border pb-2">
            Academic Information
          </h3>

          <div>
            <Label htmlFor="enrollmentNumber">Enrollment Number</Label>
            <Input
              id="enrollmentNumber"
              placeholder="241000100001 (Optional)"
              {...register("enrollmentNumber")}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="branch">Branch *</Label>
            <Select
              value={selectedBranch}
              onValueChange={(value) => {
                setSelectedBranch(value);
                setValue("branch", value);
              }}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select your branch" />
              </SelectTrigger>
              <SelectContent>
                {branches.map((branch) => (
                  <SelectItem key={branch} value={branch}>
                    {branch}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!selectedBranch && errors.branch && (
              <p className="text-sm text-red-600 mt-1">Branch is required</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="year">Year *</Label>
              <Select
                value={selectedYear}
                onValueChange={(value) => {
                  setSelectedYear(value);
                  setValue("year", value);
                }}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="semester">Semester *</Label>
              <Select
                value={selectedSemester}
                onValueChange={(value) => {
                  setSelectedSemester(value);
                  setValue("semester", value);
                }}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  {semesters.map((sem) => (
                    <SelectItem key={sem} value={sem}>
                      {sem}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Interests & Skills */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b border-border pb-2">
            Interests & Skills
          </h3>

          <div>
            <Label htmlFor="interests">Interests *</Label>
            <Textarea
              id="interests"
              placeholder="Web Development, AI/ML, Cybersecurity, etc. (comma separated)"
              {...register("interests", { required: "Please list your interests" })}
              className="mt-1"
              rows={3}
            />
            {errors.interests && (
              <p className="text-sm text-red-600 mt-1">{errors.interests.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="skills">Skills *</Label>
            <Textarea
              id="skills"
              placeholder="JavaScript, Python, React, Node.js, etc. (comma separated)"
              {...register("skills", { required: "Please list your skills" })}
              className="mt-1"
              rows={3}
            />
            {errors.skills && (
              <p className="text-sm text-red-600 mt-1">{errors.skills.message}</p>
            )}
          </div>
        </div>

        {/* Social Links (Optional) */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b border-border pb-2">
            Social Links <span className="text-sm text-muted-foreground">(Optional)</span>
          </h3>

          <div>
            <Label htmlFor="linkedin">LinkedIn Profile</Label>
            <Input
              id="linkedin"
              type="url"
              placeholder="https://linkedin.com/in/yourprofile"
              {...register("linkedin")}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="github">GitHub Profile</Label>
            <Input
              id="github"
              type="url"
              placeholder="https://github.com/yourusername"
              {...register("github")}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="portfolio">Portfolio Website</Label>
            <Input
              id="portfolio"
              type="url"
              placeholder="https://yourportfolio.com"
              {...register("portfolio")}
              className="mt-1"
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4 mr-2" />
              Register for Membership
            </>
          )}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          By registering, you agree to participate in DevNest activities and events.
        </p>
      </form>
    </div>
  );
}
