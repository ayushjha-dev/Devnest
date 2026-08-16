import { Layout } from "@/components/Layout";

export default function ProjectsPage() {
  return (
    <Layout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="text-center max-w-2xl px-4">
          <div className="mb-8">
            <div className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-medium mb-4">
              Coming Soon
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-poppins font-bold mb-4 glow-text">
            Projects & Showcases
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Discover amazing projects built by our community members.
          </p>
          <div className="glass-effect rounded-lg p-8 inline-block">
            <p className="text-muted-foreground mb-4">
              This section will include:
            </p>
            <ul className="text-left space-y-2 text-muted-foreground text-sm">
              <li>✓ Dynamic project gallery with filters</li>
              <li>✓ Filter by domain, year, and tech stack</li>
              <li>✓ Featured projects with 3D card animations</li>
              <li>✓ Project submission form</li>
              <li>✓ GitHub and demo links</li>
              <li>✓ Team member credits</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}
