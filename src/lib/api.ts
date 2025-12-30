import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), '../cloud_resume/src/content/posts');
const specDirectory = path.join(process.cwd(), '../cloud_resume/src/content/spec');

export interface Post {
    slug: string;
    frontmatter: Record<string, unknown>;
    content: string;
}

export function getAllPosts(): Post[] {
    // Ensure directory exists
    if (!fs.existsSync(postsDirectory)) {
        return [];
    }

    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames
        .filter((fileName) => fileName.endsWith('.md'))
        .map((fileName) => {
            const slug = fileName.replace(/\.md$/, '');
            const fullPath = path.join(postsDirectory, fileName);
            const fileContents = fs.readFileSync(fullPath, 'utf8');
            const { data, content } = matter(fileContents);

            return {
                slug,
                frontmatter: data,
                content,
            };
        });

    // Sort posts by date
    return allPostsData.sort((a, b) => {
        if (a.frontmatter.published < b.frontmatter.published) {
            return 1;
        } else {
            return -1;
        }
    });
}

export function getPost(slug: string): Post | null {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    if (!fs.existsSync(fullPath)) {
        return null;
    }
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    return {
        slug,
        frontmatter: data,
        content,
    };
}

export function savePost(slug: string, frontmatter: Record<string, unknown>, content: string) {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    const fileContent = matter.stringify(content, frontmatter);
    fs.writeFileSync(fullPath, fileContent);
}

export function deletePost(slug: string) {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
    }
}

export function getSpec(name: string) {
    const fullPath = path.join(specDirectory, `${name}.md`);
    if (!fs.existsSync(fullPath)) {
        return null;
    }
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    return {
        name,
        frontmatter: data,
        content,
    };
}

export function saveSpec(name: string, content: string, frontmatter: Record<string, unknown> = {}) {
    const fullPath = path.join(specDirectory, `${name}.md`);
    // If frontmatter is empty and file had none, matter.stringify might add specific empty fm?
    // We should probably preserve existing logic or just use what's passed.
    // For specs in this project, they have simple frontmatter.
    const fileContent = matter.stringify(content, frontmatter);
    fs.writeFileSync(fullPath, fileContent);
}
