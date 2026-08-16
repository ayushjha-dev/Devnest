import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const postsDirectory = path.join(process.cwd(), "src/content/blogs");

export interface BlogMeta {
	slug: string;
	title: string;
	author: string;
	date: string;
	category: string;
	thumbnail: string;
	excerpt: string;
	readTime: string;
}

export interface BlogPost extends BlogMeta {
	contentHtml: string;
}

function getPostFilenames() {
	return fs.readdirSync(postsDirectory).filter((file) => file.endsWith(".md"));
}

export function getAllBlogs(): BlogMeta[] {
	const fileNames = getPostFilenames();

	const allBlogs = fileNames.map((fileName) => {
		const slug = fileName.replace(/\.md$/, "");
		const fullPath = path.join(postsDirectory, fileName);
		const fileContents = fs.readFileSync(fullPath, "utf8");
		const { data } = matter(fileContents);

		return {
			slug,
			title: String(data.title ?? "Untitled"),
			author: String(data.author ?? "DevNest"),
			date: String(data.date ?? "1970-01-01"),
			category: String(data.category ?? "General"),
			thumbnail: String(data.thumbnail ?? "📝"),
			excerpt: String(data.excerpt ?? ""),
			readTime: String(data.readTime ?? "5 min read"),
		};
	});

	return allBlogs.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getAllBlogSlugs() {
	return getPostFilenames().map((fileName) => ({
		params: {
			slug: fileName.replace(/\.md$/, ""),
		},
	}));
}

export async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
	const fullPath = path.join(postsDirectory, `${slug}.md`);

	if (!fs.existsSync(fullPath)) {
		return null;
	}

	const fileContents = fs.readFileSync(fullPath, "utf8");
	const { data, content } = matter(fileContents);
	const processedContent = await remark().use(html).process(content);

	return {
		slug,
		title: String(data.title ?? "Untitled"),
		author: String(data.author ?? "DevNest"),
		date: String(data.date ?? "1970-01-01"),
		category: String(data.category ?? "General"),
		thumbnail: String(data.thumbnail ?? "📝"),
		excerpt: String(data.excerpt ?? ""),
		readTime: String(data.readTime ?? "5 min read"),
		contentHtml: processedContent.toString(),
	};
}
