'use server';

import { getAllPosts, getPost, savePost, deletePost as removePost, getSpec, saveSpec, Post } from '../lib/api';
import { revalidatePath } from 'next/cache';

export async function fetchPosts(): Promise<Post[]> {
    return getAllPosts();
}

export async function fetchPost(slug: string): Promise<Post | null> {
    return getPost(slug);
}

export async function updatePost(slug: string, frontmatter: Record<string, unknown>, content: string) {
    savePost(slug, frontmatter, content);
    revalidatePath('/posts');
    revalidatePath(`/posts/${slug}`);
}

export async function deletePost(slug: string) {
    removePost(slug);
    revalidatePath('/posts');
}

export async function fetchSpec(name: string) {
    return getSpec(name);
}

export async function updateSpec(name: string, content: string, frontmatter: Record<string, unknown> = {}) {
    saveSpec(name, content, frontmatter);
    revalidatePath(`/specs/${name}`);
}

export async function uploadImage(formData: FormData) {
    const file = formData.get('file') as File;
    if (!file) {
        throw new Error('No file uploaded');
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Target directory in cloud_resume
    // Target directory in cloud_resume
    const path = await import('path');
    const fs = await import('fs');

    const folder = (formData.get('folder') as string) || 'certificates';
    // Validate folder to prevent traversal or random writes? 
    // minimal validation: must be 'certificates' or 'posts'
    const validFolders = ['certificates', 'posts'];
    const targetFolder = validFolders.includes(folder) ? folder : 'certificates';

    const uploadDir = path.join(process.cwd(), `../cloud_resume/public/assets/images/${targetFolder}`);

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Sanitize filename
    const filename = file.name.replace(/[^a-z0-9.]/gi, '_').toLowerCase();
    const filepath = path.join(uploadDir, filename);

    fs.writeFileSync(filepath, buffer);

    return `/assets/images/${targetFolder}/${filename}`;
}
