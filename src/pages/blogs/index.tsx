import Head from "next/head";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowRight, Clock, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { GetStaticProps } from "next";
import { getAllBlogs, type BlogMeta } from "@/lib/blogs";

interface BlogsPageProps {
  blogs: BlogMeta[];
}

export default function BlogsPage({ blogs }: BlogsPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(blogs.map((b) => b.category)));

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || blog.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      <Head><title>DevNest | Blog</title></Head>
      <div className="min-h-screen py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="mb-6 inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/30">
              <Image
                src="/logo.svg"
                alt="DevNest"
                width={20}
                height={20}
                className="w-5 h-5 object-contain"
              />
              <span className="text-primary text-sm font-medium">Knowledge Hub</span>
            </div>
            <h1 className="text-5xl sm:text-6xl font-poppins font-bold mb-4 glow-text">
              DevNest Blogs
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Insights, tutorials, and stories from our tech community leaders
            </p>
          </div>

          {/* Search and Filter */}
          <div className="mb-12">
            {/* Search Bar */}
            <div className="mb-6 relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search blogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 rounded-lg border border-primary/20 bg-background/50 backdrop-blur-sm focus:border-primary"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 justify-center">
              <Button
                onClick={() => setSelectedCategory(null)}
                variant={selectedCategory === null ? "default" : "outline"}
                className="rounded-full"
              >
                All Categories
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className="rounded-full"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Blogs Grid */}
          {filteredBlogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {filteredBlogs.map((blog, index) => (
                <div
                  key={blog.slug}
                  className="glass-effect rounded-xl overflow-hidden hover-lift transition-all group"
                  style={{
                    animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                  }}
                >
                  {/* Thumbnail */}
                  <div className="relative h-40 bg-gradient-to-br from-primary/20 to-secondary/20 overflow-hidden flex items-center justify-center">
                    <div className="text-6xl group-hover:scale-110 transition-transform duration-300">
                      {blog.thumbnail}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Category Badge */}
                    <div className="mb-3">
                      <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-semibold">
                        {blog.category}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-poppins font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {blog.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {blog.excerpt}
                    </p>

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-4 mb-4 text-xs text-muted-foreground border-t border-border pt-4">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {blog.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {blog.readTime}
                      </div>
                    </div>

                    {/* Read More */}
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="w-full gap-2 group/btn"
                    >
                      <Link href={`/blog/${blog.slug}`}>
                        Read More
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                No blogs found. Try adjusting your search or filters.
              </p>
            </div>
          )}

          {/* CTA Section */}
          <div className="text-center">
            <div className="glass-effect rounded-xl p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-poppins font-bold mb-4">
                Want to contribute?
              </h3>
              <p className="text-muted-foreground mb-6">
                Share your knowledge and insights with the DevNest community. Interested in writing a blog post?
              </p>
              <a href="mailto:devnest.techclub@gmail.com">
                <Button className="bg-primary hover:bg-primary/90 gap-2">
                  Get in Touch
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<BlogsPageProps> = async () => {
  return {
    props: {
      blogs: getAllBlogs(),
    },
  };
};
