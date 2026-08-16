import Head from "next/head";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Mail, MapPin, Phone, MessageCircle, Instagram, Linkedin, Github } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
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
        subject: "",
        message: "",
      });
    }, 3000);
  };

  const contactMethods = [
    {
      icon: Mail,
      title: "Email",
      content: "devnest.techclub@gmail.com",
      link: "mailto:devnest.techclub@gmail.com",
      description: "Get in touch with our team directly",
    },
    {
      icon: MapPin,
      title: "Location",
      content: "Lamrin Tech Skills University, Punjab",
      link: "#",
      description: "Visit us at our campus",
    },
    {
      icon: Linkedin,
      title: "LinkedIn",
      content: "DevNest Official",
      link: "https://www.linkedin.com/company/devnestclub",
      description: "Follow us for updates and opportunities",
    },
    {
      icon: Instagram,
      title: "Instagram",
      content: "@devnest_tech_club",
      link: "https://www.instagram.com/devnest_tech_club/",
      description: "See our latest events and announcements",
    },
  ];

  const socialLinks = [
    { icon: Instagram, url: "https://www.instagram.com/devnest_tech_club/", label: "Instagram" },
    { icon: Linkedin, url: "https://www.linkedin.com/company/devnestclub", label: "LinkedIn" },
    { icon: Github, url: "https://github.com", label: "GitHub" },
    { icon: MessageCircle, url: "mailto:devnest.techclub@gmail.com", label: "Email" },
  ];

  return (
    <Layout>
      <Head><title>DevNest | Contact</title></Head>
      <div className="min-h-screen py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="mb-6 inline-block">
              <span className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-medium">
                <span className="emoji-white">📞</span> Get In Touch
              </span>
            </div>
            <h1 className="text-5xl sm:text-6xl font-poppins font-bold mb-4 glow-text">
              Connect With Us
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Have questions? Want to collaborate? Or just curious about DevNest? Reach out to us anytime. We'd love to hear from you!
            </p>
          </div>

          {/* Contact Methods Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {contactMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <a
                  key={index}
                  href={method.link}
                  target={method.link.startsWith("http") ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                  className="glass-effect rounded-lg p-6 hover-lift transition-all hover:bg-primary/5 group"
                >
                  <Icon className="w-10 h-10 text-primary mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="font-poppins font-bold mb-2">{method.title}</h3>
                  <p className="text-sm text-primary font-semibold mb-2">
                    {method.content}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {method.description}
                  </p>
                </a>
              );
            })}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-poppins font-bold mb-8">
                Send us a <span className="glow-text">Message</span>
              </h2>

              {!submitted ? (
                <form
                  onSubmit={handleSubmit}
                  className="glass-effect rounded-xl p-8 space-y-6"
                >
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Your name"
                      className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="What is this about?"
                      className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder="Tell us what's on your mind..."
                      rows={6}
                      className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2 font-semibold"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Send Message
                  </Button>
                </form>
              ) : (
                <div className="glass-effect rounded-xl p-8 text-center">
                  <div className="text-4xl mb-4">✨</div>
                  <h3 className="text-2xl font-poppins font-bold mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Thank you for reaching out! We'll get back to you as soon as possible.
                  </p>
                  <Button
                    onClick={() => setSubmitted(false)}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Send Another Message
                  </Button>
                </div>
              )}
            </div>

            {/* Info Sidebar */}
            <div className="lg:col-span-1">
              <div className="glass-effect rounded-xl p-8 sticky top-24 space-y-8">
                <div>
                  <h3 className="font-poppins font-bold mb-4">
                    <span className="emoji-white">📍</span> Location
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Lamrin Tech Skills University<br />
                    Punjab, India
                  </p>
                </div>

                <div>
                  <h3 className="font-poppins font-bold mb-4">
                    <span className="emoji-white">📧</span> Email
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    <a href="mailto:devnest.techclub@gmail.com" className="text-primary hover:underline">
                      devnest.techclub@gmail.com
                    </a>
                  </p>
                </div>

                <div>
                  <h3 className="font-poppins font-bold mb-4">
                    ⏰ Response Time
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    We typically respond within 24-48 hours during business days.
                  </p>
                </div>

                <div>
                  <h3 className="font-poppins font-bold mb-4">
                    🤝 Follow Us
                  </h3>
                  <div className="flex gap-3 flex-wrap">
                    {socialLinks.map((social, index) => {
                      const Icon = social.icon;
                      return (
                        <a
                          key={index}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
                          title={social.label}
                        >
                          <Icon className="w-5 h-5 text-primary" />
                        </a>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg p-4 border border-primary/30">
                  <p className="text-sm font-semibold text-foreground mb-2">
                    <span className="emoji-white">💡</span> Pro Tip
                  </p>
                  <p className="text-xs text-muted-foreground">
                    For quick questions, join our Discord community and connect with the team directly!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ or Additional Info */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-poppins font-bold text-center mb-8">
              Quick <span className="glow-text">Answers</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-effect rounded-lg p-6">
                <h4 className="font-poppins font-bold mb-2"><span className="emoji-white">🎯</span> Event Registration</h4>
                <p className="text-sm text-muted-foreground">
                  Head to our Events page to see upcoming events and register.
                </p>
              </div>
              <div className="glass-effect rounded-lg p-6">
                <h4 className="font-poppins font-bold mb-2"><span className="emoji-white">👥</span> Join the Community</h4>
                <p className="text-sm text-muted-foreground">
                  Fill out the membership form on the Join page to become a member.
                </p>
              </div>
              <div className="glass-effect rounded-lg p-6">
                <h4 className="font-poppins font-bold mb-2"><span className="emoji-white">💼</span> Collaboration</h4>
                <p className="text-sm text-muted-foreground">
                  Interested in partnering? Email us your proposal at devnest.techclub@gmail.com
                </p>
              </div>
              <div className="glass-effect rounded-lg p-6">
                <h4 className="font-poppins font-bold mb-2"><span className="emoji-white">💬</span> Discord Server</h4>
                <p className="text-sm text-muted-foreground">
                  Join our Discord to connect with 500+ members and stay updated.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
