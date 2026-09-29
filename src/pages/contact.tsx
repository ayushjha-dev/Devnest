import Head from "next/head";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Mail,
  MapPin,
  MessageCircle,
  Linkedin,
  Github,
  Clock,
  Sparkles,
  Calendar,
  Users,
  Briefcase,
  MessageSquare,
  CheckCircle2,
  Send,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to deliver message. Please try again.");
      }

      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "An unexpected error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const contactMethods = [
    {
      icon: Mail,
      title: "Direct Email",
      content: "devnest.techclub@gmail.com",
      link: "mailto:devnest.techclub@gmail.com",
      description: "Quickest channel for sponsorships, queries, and student concerns.",
      color: "bg-[#FFE600]",
    },
    {
      icon: MapPin,
      title: "Campus Hub",
      content: "LTSU Campus, Punjab",
      link: "#",
      description: "University School of Engineering & Technology (USET).",
      color: "bg-[#70D6FF]",
    },
    {
      icon: Linkedin,
      title: "LinkedIn",
      content: "DevNest Club",
      link: "https://www.linkedin.com/company/devnest-official",
      description: "Official announcements, alumni stories, and job boards.",
      color: "bg-[#C4B5FD]",
    },
  ];

  const socialLinks = [
    {
      icon: Linkedin,
      url: "https://www.linkedin.com/company/devnest-official",
      label: "LinkedIn",
    },
    {
      icon: Github,
      url: "https://github.com/devnest-tech",
      label: "GitHub",
    },
    {
      icon: Mail,
      url: "mailto:devnest.techclub@gmail.com",
      label: "Email",
    },
  ];

  return (
    <Layout>
      <Head>
        <title>DevNest | Contact & Support</title>
        <meta
          name="description"
          content="Get in touch with the DevNest leadership team, LTSU Punjab campus coordinators, and community mentors."
        />
      </Head>

      <div className="min-h-screen py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Left-Aligned Header */}
          <div className="text-left mb-16 max-w-3xl">
            <div className="badge-pill mb-4">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>Get In Touch</span>
              <span className="text-muted-foreground/60">•</span>
              <span className="text-foreground/80 font-medium">Communication Channels</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-poppins font-bold tracking-tight mb-4 text-foreground">
              Connect With <span className="text-gradient-primary">DevNest</span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Have questions about upcoming hackathons? Want to partner as an industry mentor or sponsor?
              Send us a message and our leadership team will get back to you promptly.
            </p>
          </div>

          {/* Contact Methods Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {contactMethods.map((method, index) => {
              const Icon = method.icon;

              return (
                <a
                  key={index}
                  href={method.link}
                  target={method.link.startsWith("http") ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                  className="rounded-2xl p-6 border-2 border-black bg-white shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between group"
                >
                  <div>
                    <div className={`w-12 h-12 rounded-xl ${method.color} border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center text-black mb-4 group-hover:scale-105 transition-transform duration-200`}>
                      <Icon className="w-6 h-6 stroke-[2.2]" />
                    </div>

                    <h3 className="font-space font-bold text-base text-foreground mb-1">
                      {method.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-black font-mono font-bold truncate mb-2">
                      {method.content}
                    </p>

                    <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                      {method.description}
                    </p>
                  </div>
                </a>
              );
            })}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="rounded-3xl p-6 sm:p-10 border-3 border-black bg-white shadow-[6px_6px_0px_#000]">
                <div className="mb-8">
                  <h2 className="text-2xl sm:text-3xl font-space font-bold text-foreground mb-2">
                    Send Us a Message
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    We will get back to your inquiry within 24 to 48 hours.
                  </p>
                </div>

                {!submitted ? (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {errorMessage && (
                      <div className="p-3.5 rounded-xl bg-destructive/10 border-2 border-destructive text-destructive text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in">
                        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-foreground mb-1.5 font-space">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="e.g. Jordan Lee"
                          className="w-full px-4 h-11 rounded-xl bg-white border-2 border-black text-black placeholder:text-zinc-400 focus:outline-none focus:shadow-[3px_3px_0px_#000] text-sm shadow-[2px_2px_0px_#000] transition-all font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-foreground mb-1.5 font-space">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="jordan@example.com"
                          className="w-full px-4 h-11 rounded-xl bg-white border-2 border-black text-black placeholder:text-zinc-400 focus:outline-none focus:shadow-[3px_3px_0px_#000] text-sm shadow-[2px_2px_0px_#000] transition-all font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-foreground mb-1.5 font-space">
                        Subject *
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Partnership Opportunity / Event Query"
                        className="w-full px-4 h-11 rounded-xl bg-white border-2 border-black text-black placeholder:text-zinc-400 focus:outline-none focus:shadow-[3px_3px_0px_#000] text-sm shadow-[2px_2px_0px_#000] transition-all font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-foreground mb-1.5 font-space">
                        Message *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        placeholder="Describe your inquiry, event feedback, or sponsorship details..."
                        rows={5}
                        className="w-full p-3 rounded-xl bg-white border-2 border-black text-black placeholder:text-zinc-400 focus:outline-none focus:shadow-[3px_3px_0px_#000] text-sm shadow-[2px_2px_0px_#000] transition-all resize-none font-medium"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-12 rounded-xl bg-[#FFE600] hover:bg-[#FFE600]/90 text-black font-space font-extrabold text-sm border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all disabled:opacity-70 cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          <span>Dispatching Message...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          <span>Send Direct Message</span>
                        </>
                      )}
                    </Button>
                  </form>
                ) : (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 rounded-2xl bg-[#88EA73] border-2 border-black text-black flex items-center justify-center mx-auto mb-4 shadow-[4px_4px_0px_#000]">
                      <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
                    </div>

                    <h3 className="text-2xl font-space font-bold text-foreground mb-2">
                      Message Dispatched!
                    </h3>

                    <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto mb-6 leading-relaxed">
                      Thank you for contacting DevNest. One of our community leads will follow up via your email shortly.
                    </p>

                    <Button
                      onClick={() => setSubmitted(false)}
                      variant="outline"
                      className="rounded-xl text-xs font-space font-bold border-2 border-black shadow-[2px_2px_0px_#000]"
                    >
                      Send Another Inquiry
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Info Sidebar */}
            <div className="lg:col-span-1">
              <div className="rounded-3xl p-6 sm:p-8 border-3 border-black bg-white shadow-[6px_6px_0px_#000] space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 font-space">
                    <MapPin className="w-3.5 h-3.5 text-black" />
                    <span>Campus Headquarters</span>
                  </div>
                  <p className="text-sm font-bold text-foreground font-space">
                    Lamrin Tech Skills University
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    Ropar, Punjab 140001, India
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 font-space">
                    <Clock className="w-3.5 h-3.5 text-black" />
                    <span>Response Hours</span>
                  </div>
                  <p className="text-sm font-bold text-foreground font-space">
                    Monday – Friday: 9:00 AM – 6:00 PM IST
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Average response latency: &lt; 24 hours
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 font-space">
                    <Sparkles className="w-3.5 h-3.5 text-black" />
                    <span>Social Channels</span>
                  </div>

                  <div className="flex gap-2">
                    {socialLinks.map((social, index) => {
                      const Icon = social.icon;

                      return (
                        <a
                          key={index}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-xl bg-white hover:bg-[#FFE600] border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center text-black transition-all duration-150 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                          title={social.label}
                          aria-label={social.label}
                        >
                          <Icon className="w-4 h-4" />
                        </a>
                      );
                    })}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#FFE600] border-2 border-black shadow-[3px_3px_0px_#000] text-black">
                  <p className="text-xs font-bold font-space mb-1">
                    Student Member Tip
                  </p>
                  <p className="text-xs text-black/80 font-medium leading-relaxed">
                    For faster queries on ongoing hackathons or team matching, drop a quick note in our community WhatsApp group!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Answers (FAQ) Grid (Left-Aligned) */}
          <div className="mb-12 text-left">
            <div className="mb-8">
              <div className="badge-pill mb-3">
                <span className="w-2 h-2 rounded-full bg-black" />
                <span>Help Desk</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-space font-bold text-foreground">
                Frequently Answered
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="rounded-2xl p-6 border-2 border-black bg-white shadow-[3px_3px_0px_#000] hover:shadow-[5px_5px_0px_#000] transition-all">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-[#FFE600] border-2 border-black shadow-[1.5px_1.5px_0px_#000] flex items-center justify-center text-black shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-sm text-foreground font-space">
                    Event Registrations
                  </h4>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Head over to our Events calendar page to review dates, requirements, and live registration links for upcoming hackathons.
                </p>
              </div>

              <div className="rounded-2xl p-6 border-2 border-black bg-white shadow-[3px_3px_0px_#000] hover:shadow-[5px_5px_0px_#000] transition-all">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-[#70D6FF] border-2 border-black shadow-[1.5px_1.5px_0px_#000] flex items-center justify-center text-black shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-sm text-foreground font-space">
                    Joining the Community
                  </h4>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Fill out our official Membership registration form on the Membership page to join our official active roster and WhatsApp channel.
                </p>
              </div>

              <div className="rounded-2xl p-6 border-2 border-black bg-white shadow-[3px_3px_0px_#000] hover:shadow-[5px_5px_0px_#000] transition-all">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-[#FF70A6] border-2 border-black shadow-[1.5px_1.5px_0px_#000] flex items-center justify-center text-black shrink-0">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-sm text-foreground font-space">
                    Partnerships & Sponsorships
                  </h4>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  We partner with tech organizations and startups for event sponsorships and hackathon prize support. Contact us at devnest.techclub@gmail.com.
                </p>
              </div>

              <div className="rounded-2xl p-6 border-2 border-black bg-white shadow-[3px_3px_0px_#000] hover:shadow-[5px_5px_0px_#000] transition-all">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-[#C4B5FD] border-2 border-black shadow-[1.5px_1.5px_0px_#000] flex items-center justify-center text-black shrink-0">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-sm text-foreground font-space">
                    Mentorship & Talks
                  </h4>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Industry engineers and alumni interested in conducting hands-on masterclasses or mentoring student teams can reach out directly via email.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}