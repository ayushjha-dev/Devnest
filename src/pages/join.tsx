import Head from "next/head";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CheckCircle, Zap, Users, Trophy, Lightbulb } from "lucide-react";

export default function JoinPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    college: "",
    year: "",
    domain: "",
    github: "",
    linkedin: "",
    experience: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: "",
        email: "",
        college: "",
        year: "",
        domain: "",
        github: "",
        linkedin: "",
        experience: "",
      });
    }, 3000);
  };

  const joinBenefits = [
    {
      icon: Zap,
      title: "Access to Events",
      description: "Participate in hackathons, workshops, and tech talks.",
    },
    {
      icon: Users,
      title: "Community",
      description: "Network with 500+ passionate tech enthusiasts.",
    },
    {
      icon: Trophy,
      title: "Opportunities",
      description: "Win certifications, prizes, and recognition.",
    },
    {
      icon: Lightbulb,
      title: "Learn & Build",
      description: "Work on real-world projects and gain practical experience.",
    },
  ];

  const joinSteps = [
    {
      number: "01",
      title: "Fill the Form",
      description: "Complete your membership form with basic details.",
    },
    {
      number: "02",
      title: "Attend Orientation",
      description: "Join our orientation session to meet the team.",
    },
    {
      number: "03",
      title: "Join Community",
      description: "Get access to Discord and all member resources.",
    },
    {
      number: "04",
      title: "Start Building",
      description: "Attend events, participate in projects, and innovate!",
    },
  ];

  return (
    <Layout>
      <Head><title>DevNest | Join Us</title></Head>
      <div className="min-h-screen py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {!submitted ? (
            <>
              {/* Header */}
              <div className="text-center mb-16">
                <div className="mb-6 inline-block">
                  <span className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-medium">
                    <span className="emoji-white">🎯</span> Join the Innovation Nest
                  </span>
                </div>
                <h1 className="text-5xl sm:text-6xl font-poppins font-bold mb-4 glow-text">
                  Join DevNest
                </h1>
                <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                  Become part of a community where passion meets purpose. Whether you're a coder, designer, or curious learner — DevNest is your launchpad to innovation.
                </p>
              </div>

              {/* Benefits Section */}
              <div className="mb-20">
                <h2 className="text-3xl font-poppins font-bold text-center mb-12">
                  Why Join <span className="glow-text">DevNest?</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {joinBenefits.map((benefit, index) => {
                    const Icon = benefit.icon;
                    return (
                      <div
                        key={index}
                        className="glass-effect rounded-lg p-6 hover-lift"
                      >
                        <Icon className="w-8 h-8 text-primary mb-4" />
                        <h3 className="font-poppins font-bold mb-2">
                          {benefit.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {benefit.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* How to Join Section */}
              <div className="mb-20">
                <h2 className="text-3xl font-poppins font-bold text-center mb-12">
                  How to <span className="glow-text">Join</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {joinSteps.map((step, index) => (
                    <div key={index} className="relative">
                      <div className="glass-effect rounded-lg p-6 text-center hover-lift">
                        <div className="text-4xl font-poppins font-bold text-primary mb-4">
                          {step.number}
                        </div>
                        <h3 className="font-poppins font-bold mb-2">
                          {step.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                      {index < joinSteps.length - 1 && (
                        <div className="hidden md:block absolute top-1/2 -right-3 text-2xl text-primary transform -translate-y-1/2">
                          →
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Membership Form */}
              <div className="max-w-3xl mx-auto mb-20">
                <h2 className="text-3xl font-poppins font-bold text-center mb-8">
                  Membership <span className="glow-text">Form</span>
                </h2>

                <form
                  onSubmit={handleSubmit}
                  className="glass-effect rounded-xl p-8 space-y-6"
                >
                  {/* Row 1 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Your full name"
                        className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="your.email@example.com"
                        className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      />
                    </div>
                  </div>

                  {/* Row 2 */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        College/University *
                      </label>
                      <input
                        type="text"
                        name="college"
                        value={formData.college}
                        onChange={handleChange}
                        required
                        placeholder="Your college name"
                        className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Year of Study *
                      </label>
                      <select
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      >
                        <option value="">Select year</option>
                        <option value="1st">1st Year</option>
                        <option value="2nd">2nd Year</option>
                        <option value="3rd">3rd Year</option>
                        <option value="4th">4th Year</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Domain Interest *
                      </label>
                      <select
                        name="domain"
                        value={formData.domain}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      >
                        <option value="">Select domain</option>
                        <option value="ai-ml">Artificial Intelligence & ML</option>
                        <option value="web">Web Development</option>
                        <option value="cyber">Cybersecurity</option>
                        <option value="cloud">Cloud Computing</option>
                        <option value="data-science">Data Science</option>
                        <option value="multiple">Multiple Domains</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 3 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        GitHub Profile (Optional)
                      </label>
                      <input
                        type="text"
                        name="github"
                        value={formData.github}
                        onChange={handleChange}
                        placeholder="github.com/username"
                        className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        LinkedIn Profile (Optional)
                      </label>
                      <input
                        type="text"
                        name="linkedin"
                        value={formData.linkedin}
                        onChange={handleChange}
                        placeholder="linkedin.com/in/username"
                        className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      />
                    </div>
                  </div>

                  {/* Row 4 */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      What's your tech experience? (Optional)
                    </label>
                    <textarea
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      placeholder="Tell us about your tech background and what you'd like to learn..."
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                    />
                  </div>

                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                    <div className="flex gap-3">
                      <Zap className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-semibold text-foreground mb-1">
                          What happens next?
                        </p>
                        <p className="text-muted-foreground">
                          After submission, you'll receive a confirmation email with Discord community link and orientation details. Join our orientation session and start your DevNest journey!
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2 font-semibold"
                  >
                    <Zap className="w-5 h-5" />
                    Join the Nest Now
                  </Button>
                </form>
              </div>

              {/* Bottom CTA */}
              <div className="text-center">
                <p className="text-muted-foreground mb-4">
                  Together, we build. Together, we innovate. Together, we are DevNest.
                </p>
              </div>
            </>
          ) : (
            <div className="text-center max-w-md mx-auto">
              <div className="mb-6 flex justify-center">
                <CheckCircle className="w-20 h-20 text-primary" />
              </div>
              <h2 className="text-4xl font-poppins font-bold mb-3">
                Welcome to DevNest! <span className="emoji-white">🎉</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-2">
                Your registration has been submitted successfully!
              </p>
              <p className="text-muted-foreground mb-8">
                Check your email for a confirmation link, Discord community invitation, and upcoming orientation details. Get ready to innovate!
              </p>
              <Button
                onClick={() => (window.location.href = "/")}
                className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
              >
                <Zap className="w-4 h-4" />
                Back to Home
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
