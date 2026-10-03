import Head from "next/head";
import Link from "next/link";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { TechIcon } from "@/components/TechIcon";
import {
  getAllBlogs,
  getAllBlogSlugs,
  getBlogBySlug,
  type BlogMeta,
  type BlogPost,
} from "@/lib/blogs";
import { ArrowLeft, ArrowRight, Check, Clock, Share2 } from "lucide-react";
import type { GetStaticPaths, GetStaticProps } from "next";
import { useState } from "react";

interface BlogDetailProps {
  blog: BlogPost;
  relatedBlogs: BlogMeta[];
}

export default function BlogDetailPage({ blog, relatedBlogs }: BlogDetailProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formattedDate = new Date(blog.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const authorInitial = blog.author.trim().charAt(0).toUpperCase();

  return (
    <Layout>
      <Head>
        <title>{`DevNest | ${blog.title}`}</title>
        <meta name="description" content={blog.excerpt} />
      </Head>

      <div className="min-h-screen pb-20">
        <div className="mx-auto mt-8 w-full max-w-4xl px-4 sm:mt-10">
          <article className="rounded-3xl border-2 border-black bg-white p-5 shadow-[6px_6px_0px_#000] sm:p-10 lg:p-12">
            {/* Article Header */}
            <div className="mx-auto max-w-[42rem]">
              <header>
                <span className="inline-block rounded-md border-2 border-black bg-[#FFE600] px-3 py-1 font-space text-[11px] font-bold uppercase tracking-wide text-black shadow-[2px_2px_0px_#000]">
                  {blog.category}
                </span>

                <h1 className="mt-5 font-space text-[1.75rem] font-bold leading-[1.15] tracking-tight text-black sm:text-4xl">
                  {blog.title}
                </h1>

                <p className="mt-4 text-base font-medium leading-relaxed text-black/65 sm:text-lg">
                  {blog.excerpt}
                </p>

                <p className="mt-5 font-space text-xs font-bold text-black/55 sm:text-sm">
                  Posted{" "}
                  <span className="text-black">{formattedDate}</span>
                </p>
              </header>
            </div>

            {/* Featured Visual */}
            <figure className="relative mt-8 h-52 overflow-hidden rounded-2xl border-2 border-black shadow-[4px_4px_0px_#000] sm:h-64 md:h-80">
            {blog.coverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={blog.coverImage}
                alt={blog.title}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#FFE600] via-[#FF70A6] to-[#70D6FF]">
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage: "radial-gradient(#000000 1.4px, transparent 1.4px)",
                    backgroundSize: "22px 22px",
                  }}
                />
                <div className="relative flex h-28 w-28 items-center justify-center rounded-3xl border-3 border-black bg-white shadow-[8px_8px_0px_#000] sm:h-36 sm:w-36">
                  <TechIcon
                    name={blog.thumbnail}
                    className="h-14 w-14 stroke-[2.2] text-black sm:h-20 sm:w-20"
                  />
                </div>
              </div>
            )}
          </figure>

          {/* Author Byline */}
          <div className="mx-auto mt-7 flex max-w-[42rem] items-center justify-between gap-4 border-b-2 border-black/10 pb-5">
            <div className="inline-flex min-w-0 items-center gap-3">
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-2 border-black bg-[#C4B5FD] font-space text-sm font-bold text-black shadow-[2px_2px_0px_#000]">
                {authorInitial}
              </span>
              <span className="truncate font-space text-sm font-bold text-black">
                By {blog.author}
              </span>
            </div>

            <div className="inline-flex shrink-0 items-center gap-1.5 font-space text-xs font-bold text-black/60">
              <Clock className="h-3.5 w-3.5" />
              <span>{blog.readTime}</span>
            </div>
          </div>

          {/* Article Body */}
          <div
            className="prose mx-auto mt-10 max-w-[42rem] break-words text-black prose-pre:overflow-x-auto prose-headings:font-space prose-headings:font-bold prose-headings:text-black prose-h2:mt-12 prose-h2:mb-4 prose-h2:border-l-[6px] prose-h2:border-[#FFE600] prose-h2:pl-4 prose-h2:text-2xl prose-h2:leading-snug prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-xl prose-p:font-medium prose-p:leading-[1.85] prose-p:text-black/75 prose-strong:font-extrabold prose-strong:text-black prose-a:font-bold prose-a:text-black prose-a:underline prose-a:decoration-2 prose-a:underline-offset-4 prose-blockquote:border-l-[6px] prose-blockquote:border-[#FFE600] prose-blockquote:bg-[#FAF7EE] prose-blockquote:px-5 prose-blockquote:py-1 prose-blockquote:font-normal prose-blockquote:not-italic prose-blockquote:text-black/80 prose-ul:my-6 prose-ol:my-6 prose-li:my-1.5 prose-li:font-medium prose-li:text-black/75 prose-li:marker:text-black prose-code:rounded-md prose-code:border prose-code:border-black prose-code:bg-[#FFE600] prose-code:px-1.5 prose-code:py-0.5 prose-code:font-medium prose-code:text-black prose-code:before:content-none prose-code:after:content-none prose-pre:rounded-2xl prose-pre:border-2 prose-pre:border-black prose-pre:bg-[#0A0A0A] prose-pre:text-white prose-pre:shadow-[5px_5px_0px_#000] prose-img:rounded-2xl prose-img:border-2 prose-img:border-black prose-hr:border-t-2 prose-hr:border-black/20 prose-table:border-2 prose-table:border-black prose-th:bg-[#FFE600] prose-th:border-2 prose-th:border-black prose-td:border-2 prose-td:border-black"
            dangerouslySetInnerHTML={{ __html: blog.contentHtml }}
          />

          {/* Share Strip */}
          <div className="mx-auto mt-12 flex max-w-[42rem] flex-col items-center justify-between gap-4 rounded-2xl border-2 border-black bg-[#FAF7EE] p-5 shadow-[4px_4px_0px_#000] sm:mt-14 sm:flex-row sm:p-6">
            <div>
              <h3 className="font-space text-sm font-bold text-black sm:text-base">
                Found this article valuable?
              </h3>
              <p className="text-xs font-medium text-black/60">
                Share it with your peer circle and tech student networks.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="w-full font-space text-sm font-bold sm:w-auto"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="h-3.5 w-3.5" />
                  <span>Copy Article Link</span>
                </>
              )}
            </Button>
          </div>

          {/* About the Author */}
          <section className="mx-auto mt-12 max-w-[42rem]">
            <h3 className="mb-4 font-space text-xs font-bold uppercase tracking-wider text-black/50">
              About the Author
            </h3>

            <div className="flex items-start gap-3 rounded-2xl border-2 border-black bg-white p-4 shadow-[4px_4px_0px_#000] sm:gap-4 sm:p-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-black bg-[#FFE600] text-xl shadow-[3px_3px_0px_#000] sm:h-14 sm:w-14 sm:text-2xl">
                {blog.thumbnail}
              </div>

              <div className="min-w-0">
                <h4 className="mb-1 font-space text-sm font-bold text-black sm:text-base">
                  {blog.author}
                </h4>
                <p className="text-xs font-medium leading-relaxed text-black/60">
                  Passionate builder, developer, and core member at DevNest tech
                  community. Dedicated to mentoring junior engineers and sharing
                  practical knowledge.
                </p>
              </div>
            </div>
          </section>

          {/* Back Link */}
          <div className="mx-auto mt-10 max-w-[42rem]">
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-black bg-white px-4 py-2.5 font-space text-xs font-bold text-black shadow-[3px_3px_0px_#000] transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-[#FAF7EE] hover:shadow-[5px_5px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Knowledge Hub</span>
            </Link>
          </div>
          {/* Related Articles */}
          {relatedBlogs.length > 0 && (
            <section className="mx-auto mt-16 max-w-5xl">
              <h2 className="mb-6 font-space text-2xl font-bold text-black">
                Related Articles
              </h2>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {relatedBlogs.map((relatedBlog) => (
                  <Link
                    key={relatedBlog.slug}
                    href={`/blog/${relatedBlog.slug}`}
                    className="group block h-full"
                  >
                    <article className="flex h-full flex-col justify-between overflow-hidden rounded-3xl border-2 border-black bg-white shadow-[4px_4px_0px_#000] transition-all duration-200 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 group-hover:shadow-[6px_6px_0px_#000]">
                      <div className="relative flex h-40 items-center justify-center overflow-hidden border-b-2 border-black bg-[#FAF7EE] sm:h-32">
                        {relatedBlog.coverImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={relatedBlog.coverImage}
                            alt={relatedBlog.title}
                            loading="lazy"
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-black bg-white shadow-[3px_3px_0px_#000] transition-transform duration-300 group-hover:rotate-3 group-hover:scale-110">
                            <TechIcon
                              name={relatedBlog.thumbnail}
                              className="h-8 w-8 stroke-[2.2] text-black"
                            />
                          </div>
                        )}
                      </div>

                      <div className="flex flex-1 flex-col justify-between p-5">
                        <div>
                          <span className="mb-2 inline-block rounded-md border border-black bg-[#FFE600] px-2 py-0.5 font-space text-[10px] font-bold uppercase text-black shadow-[1px_1px_0px_#000]">
                            {relatedBlog.category}
                          </span>
                          <h3 className="mb-1.5 line-clamp-2 font-space text-sm font-bold text-black sm:text-base">
                            {relatedBlog.title}
                          </h3>
                          <p className="mb-4 line-clamp-2 text-xs font-medium text-black/60">
                            {relatedBlog.excerpt}
                          </p>
                        </div>

                        <div className="inline-flex items-center justify-between border-t-2 border-black/10 pt-3 font-space text-xs font-bold text-black">
                          <span>Read Story</span>
                          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </section>
          )}
          </article>
        </div>
      </div>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: getAllBlogSlugs(),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<BlogDetailProps> = async ({
  params,
}) => {
  const slug = params?.slug as string;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return { notFound: true };
  }

  const allBlogs = getAllBlogs();

  const sameCategory = allBlogs.filter(
    (b) => b.category === blog.category && b.slug !== blog.slug,
  );

  const otherCategories = allBlogs.filter(
    (b) => b.category !== blog.category,
  );

  return {
    props: {
      blog,
      relatedBlogs: [...sameCategory, ...otherCategories].slice(0, 2),
    },
  };
};


