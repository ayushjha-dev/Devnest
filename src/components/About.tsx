import { CheckCircle, Target, Lightbulb, Heart, Code, Users, Rocket, Zap } from "lucide-react";
import ShinyText from "@/components/ShinyText";

export function About() {
  const timeline = [
    {
      year: "Founded",
      title: "DevNest Established",
      description:
        "The official Technical Club of Lamrin Tech Skills University (LTSU) Punjab, inspiring students to explore the limitless world of technology.",
      icon: <span className="emoji-white">🚀</span>,
    },
    {
      year: "Initiative",
      title: "Google Campus Ambassador Led",
      description:
        "Led by Google Campus Ambassadors, DevNest stands as a student-driven initiative dedicated to hands-on learning and innovation.",
      icon: <span className="emoji-white">🎯</span>,
    },
    {
      year: "Domains",
      title: "Multi-Domain Excellence",
      description:
        "Bringing together passionate minds in AI, Cybersecurity, Cloud Computing, Data Science, and Web Development.",
      icon: <span className="emoji-white">🌐</span>,
    },
    {
      year: "Vision",
      title: "Preparing Digital Leaders",
      description:
        "Empowering every student to lead in the digital era through collaboration, creativity, and technical excellence.",
      icon: <span className="emoji-white">🏆</span>,
    },
  ];

  const values = [
    {
      icon: Rocket,
      title: "Collaboration",
      description:
        "Building together, growing together. We believe in the power of teamwork and shared innovation.",
    },
    {
      icon: Lightbulb,
      title: "Curiosity",
      description:
        "Constantly exploring new technologies and pushing boundaries to create impactful solutions.",
    },
    {
      icon: Heart,
      title: "Integrity",
      description:
        "Maintaining ethical standards in all our endeavors and fostering a supportive community.",
    },
    {
      icon: Zap,
      title: "Innovation",
      description:
        "Creating solutions that make a real difference through hands-on projects and real-world experiences.",
    },
  ];

  const activities = [
    {
      icon: Code,
      title: "Hackathons",
      description: "Compete, code, and collaborate to solve real-world challenges and earn Google certifications.",
    },
    {
      icon: Users,
      title: "Workshops & Bootcamps",
      description: "Hands-on sessions led by experts to explore trending technologies like AI, Cloud, and more.",
    },
    {
      icon: Rocket,
      title: "Tech Talks",
      description: "Conversations with innovators and industry leaders to inspire new ideas and insights.",
    },
    {
      icon: Zap,
      title: "Projects & Research",
      description: "Build practical solutions and research emerging technologies to stay ahead of the curve.",
    },
  ];

  return (
    <section className="relative py-16 sm:py-20 overflow-hidden">
      {/* Animated Circuit Pattern Background */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(90deg, transparent 0%, transparent 49%, rgba(0, 184, 113, 0.3) 49%, rgba(0, 184, 113, 0.3) 51%, transparent 51%, transparent 100%),
            linear-gradient(0deg, transparent 0%, transparent 49%, rgba(0, 184, 113, 0.3) 49%, rgba(0, 184, 113, 0.3) 51%, transparent 51%, transparent 100%)
          `,
          backgroundSize: '80px 80px',
          animation: 'float 25s linear infinite'
        }} />
      </div>

      {/* Removed animated background elements - using global background from Layout */}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-poppins font-bold mb-3 sm:mb-4">
            About <ShinyText text="DevNest" className="glow-text" speed={2} />
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto px-2">
            DevNest is the official Technical Club of Lamrin Tech Skills University Punjab, established to inspire and empower students to explore the limitless world of technology.
          </p>
        </div>

        {/* Mission, Vision, Purpose */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-16 sm:mb-20">
          {/* Mission */}
          <div className="glass-effect rounded-2xl p-6 sm:p-8 hover-lift group border border-border hover:border-primary/40 transition-all">
            <div className="text-4xl sm:text-5xl mb-4 group-hover:scale-110 transition-transform"><span className="emoji-white">🎯</span></div>
            <h3 className="text-xl sm:text-2xl font-poppins font-bold mb-3 sm:mb-4 glow-text">Our Mission</h3>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Learn by doing — we provide students with a platform to connect with the outer tech world more vividly and grow through real-world experiences.
            </p>
          </div>

          {/* Vision */}
          <div className="glass-effect rounded-2xl p-6 sm:p-8 hover-lift group border border-border hover:border-primary/40 transition-all">
            <div className="text-4xl sm:text-5xl mb-4 group-hover:scale-110 transition-transform"><span className="emoji-white">🚀</span></div>
            <h3 className="text-xl sm:text-2xl font-poppins font-bold mb-3 sm:mb-4 glow-text">Our Vision</h3>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Cultivating a culture of curiosity, collaboration, and technical excellence that prepares every student to lead in the digital era.
            </p>
          </div>

          {/* Community */}
          <div className="glass-effect rounded-2xl p-6 sm:p-8 hover-lift group border border-border hover:border-primary/40 transition-all">
            <div className="text-4xl sm:text-5xl mb-4 group-hover:scale-110 transition-transform"><span className="emoji-white">🌟</span></div>
            <h3 className="text-xl sm:text-2xl font-poppins font-bold mb-3 sm:mb-4 glow-text">
              Student-Driven
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              A vibrant ecosystem led by Google Campus Ambassadors where diverse technical talents collaborate and innovate together.
            </p>
          </div>
        </div>

        {/* What We Do Section */}
        <div className="mb-16 sm:mb-20">
          <h3 className="text-2xl sm:text-3xl font-poppins font-bold text-center mb-8 sm:mb-12">
            What We <span className="glow-text">Do</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {activities.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <div
                  key={index}
                  className="glass-effect rounded-2xl p-5 sm:p-6 hover-lift transition-all group border border-border hover:border-primary/40"
                >
                  <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-primary mb-3 sm:mb-4 group-hover:scale-110 transition-transform" />
                  <h4 className="text-base sm:text-lg font-poppins font-bold mb-2">{activity.title}</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {activity.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16 sm:mb-20">
          <h3 className="text-2xl sm:text-3xl font-poppins font-bold text-center mb-8 sm:mb-12">
            Core <span className="glow-text">Values</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="glass-effect rounded-2xl p-5 sm:p-6 hover-lift group border border-border hover:border-primary/40 transition-all"
                >
                  <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-primary mb-3 sm:mb-4 group-hover:scale-110 transition-transform" />
                  <h4 className="text-base sm:text-lg font-poppins font-bold mb-2">{value.title}</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Timeline */}
        <div>
          <h3 className="text-2xl sm:text-3xl font-poppins font-bold text-center mb-8 sm:mb-12">
            Our <span className="glow-text">Foundation</span>
          </h3>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary to-secondary opacity-30 hidden lg:block" />

            <div className="space-y-6 sm:space-y-8 md:space-y-12">
              {timeline.map((event, index) => (
                <div
                  key={index}
                  className={`relative lg:flex items-center ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                    }`}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 hidden lg:block">
                    <div className="w-4 h-4 bg-primary rounded-full border-4 border-background shadow-lg shadow-primary/50" />
                  </div>

                  {/* Content */}
                  <div
                    className={`glass-effect rounded-lg p-5 sm:p-6 w-full ${index % 2 === 0
                      ? "lg:mr-auto lg:w-[45%]"
                      : "lg:ml-auto lg:w-[45%]"
                      }`}
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="text-2xl sm:text-3xl flex-shrink-0">{event.icon}</div>
                      <div className="flex-1">
                        <div className="inline-block px-3 py-1 rounded-full bg-primary/25 text-primary text-xs sm:text-sm font-semibold mb-2 border border-primary/20 shadow-sm">
                          {event.year}
                        </div>
                        <h4 className="text-lg sm:text-xl font-poppins font-bold mb-2">
                          {event.title}
                        </h4>
                        <p className="text-muted-foreground text-xs sm:text-sm">
                          {event.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
