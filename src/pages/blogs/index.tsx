import Head from "next/head";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowRight, Calendar, Clock, User, BookOpen, Sparkles, Send } from "lucide-react";
import { TechIcon } from "@/components/TechIcon";
import Link from "next/link";
import { useState } from "react";
import type { GetStaticProps } from "next";
import { getAllBlogs, type BlogMeta } from "@/lib/blogs";

interface BlogsPageProps {
  blogs: BlogMeta[];
}

export default function BlogsPage({ blogs }: BlogsPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    null,
  );

  const categories = Array.from(new Set(blogs.map((blog) => blog.category)));

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      !selectedCategory || blog.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      <Head>
        <title>DevNest | Blog & Technical Insights</title>
        <meta
          name="description"
          content="Articles, tutorials, tech guides, and architectural stories written by DevNest members and engineering leads."
        />
      </Head>

      <div className="min-h-screen py-10 sm:py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Left-Aligned Header */}
          <div className="text-left mb-12">
            <div className="badge-pill mb-4">
              <BookOpen className="w-3.5 h-3.5 text-black" />
              <span>DevNest Knowledge Base</span>
              <span className="text-black/40">•</span>
              <span className="text-black font-bold">Technical Publications</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-space font-bold tracking-tight mb-4 text-foreground">
              Blogs & <span className="text-gradient-primary">Insights</span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
              Curated articles, deep-dives, career pathways, and tech tutorials contributed by our
              community members, domain leads, and mentors.
            </p>
          </div>

          {/* Search and Filter (Left-Aligned Toolbar) */}
          <div className="mb-12 space-y-4">
            {/* Search Bar */}
            <div className="relative max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
              <Input
                type="text"
                placeholder="Search articles by title or keyword..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="pl-11 pr-4 h-12 rounded-2xl border-2 border-black bg-white text-black placeholder:text-zinc-400 shadow-[2px_2px_0px_#000] focus:shadow-[4px_4px_0px_#000] focus:outline-none text-base sm:text-sm transition-all font-medium"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 justify-start">
              <button
                type="button"
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2.5 rounded-xl text-[13px] sm:text-xs font-space font-bold border-2 border-black transition-all duration-150 ${
                  selectedCategory === null
                    ? "bg-[#FFE600] text-black shadow-[2px_2px_0px_#000]"
                    : "bg-white text-black/80 hover:bg-zinc-100"
                }`}
              >
                All Categories ({blogs.length})
              </button>

              {categories.map((category) => (
                <button
                  type="button"
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2.5 rounded-xl text-[13px] sm:text-xs font-space font-bold border-2 border-black transition-all duration-150 ${
                    selectedCategory === category
                      ? "bg-[#FFE600] text-black shadow-[2px_2px_0px_#000]"
                      : "bg-white text-black/80 hover:bg-zinc-100"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Blogs Grid */}
          {filteredBlogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-14 sm:mb-20">
              {filteredBlogs.map((blog) => (
                <Link
                  key={blog.slug}
                  href={`/blog/${blog.slug}`}
                  className="group block h-full"
                >
                  <article className="rounded-3xl overflow-hidden border-2 border-black bg-white shadow-[4px_4px_0px_#000] group-hover:shadow-[6px_6px_0px_#000] group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between h-full">
                    {/* Thumbnail */}
                    <div className="relative h-40 sm:h-44 bg-[#FAF7EE] border-b-2 border-black overflow-hidden flex items-center justify-center">
                      {blog.coverImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={blog.coverImage}
                          alt={blog.title}
                          loading="lazy"
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-3xl bg-white border-2 border-black shadow-[4px_4px_0px_#000] flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                          <TechIcon name={blog.thumbnail} className="w-10 h-10 text-black stroke-[2.2]" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Category Badge */}
                        <div className="mb-2.5">
                          <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#FFE600] text-black border border-black text-[11px] font-space font-bold uppercase shadow-[1px_1px_0px_#000]">
                            {blog.category}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-bold font-space text-foreground group-hover:text-black transition-colors line-clamp-2 mb-2 leading-snug">
                          {blog.title}
                        </h3>

                        {/* Excerpt */}
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4 font-medium">
                          {blog.excerpt}
                        </p>
                      </div>

                      <div>
                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-muted-foreground border-t-2 border-black/10 pt-3.5 mb-3.5">
                          <div className="flex items-center gap-1.5 font-bold text-foreground font-space">
                            <User className="w-3.5 h-3.5 text-black shrink-0" />
                            <span className="truncate">{blog.author}</span>
                          </div>

                          <div className="flex items-center gap-1.5 font-medium">
                            <Calendar className="w-3.5 h-3.5 text-black shrink-0" />
                            <span className="whitespace-nowrap">
                              {new Date(blog.date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 font-medium">
                            <Clock className="w-3.5 h-3.5 text-black shrink-0" />
                            <span>{blog.readTime}</span>
                          </div>
                        </div>

                        {/* Read Link */}
                        <div className="inline-flex items-center justify-between w-full text-xs font-bold text-black font-space pt-1">
                          <span>Read Full Story</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform stroke-[2.5]" />
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 glass-panel rounded-3xl border border-border/80 max-w-md mx-auto mb-20">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-lg font-bold text-foreground mb-1">No Articles Found</h3>
              <p className="text-xs text-muted-foreground mb-4">
                No posts match your current search query or active category filter.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory(null);
                }}
                className="rounded-xl"
              >
                Reset Filters
              </Button>
            </div>
          )}

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <div className="rounded-3xl p-8 sm:p-12 border-3 border-black bg-[#FAF7EE] shadow-[6px_6px_0px_#000] max-w-2xl mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-[#FFE600] border-2 border-black flex items-center justify-center text-black mx-auto mb-4 shadow-[2px_2px_0px_#000]">
                <Sparkles className="w-6 h-6 stroke-[2.2]" />
              </div>

              <h3 className="text-2xl sm:text-3xl font-space font-bold text-foreground mb-3">
                Want to Share Your Knowledge?
              </h3>

              <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6 leading-relaxed font-medium">
                We welcome technical write-ups, project breakdowns, and beginner-friendly guides from DevNest students and alumni.
              </p>

              <a
                href="mailto:devnest.techclub@gmail.com?subject=DevNest%20Blog%20Submission"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#FFE600] text-black sm:py-3 font-space font-extrabold text-sm border-2 border-black shadow-[3px_3px_0px_#000] hover:bg-[#FFE600]/90 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all duration-150"
              >
                <Send className="w-4 h-4" />
                <span>Submit an Article</span>
              </a>
            </div>
          </div>
        </div>
      </div>
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