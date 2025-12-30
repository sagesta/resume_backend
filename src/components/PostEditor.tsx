'use client';

import { useState } from 'react';
import { updatePost, deletePost } from '../app/actions';
import { Save, Trash } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import RichTextEditor from './RichTextEditor';



interface PostEditorProps {
    slug: string;
    initialData: PostData;
    initialContent: string;
    isNew?: boolean;
}

interface PostData {
    title: string;
    published: string | Date;
    description: string;
    tags: string[];
    category: string;
    draft: boolean;
    [key: string]: string | number | boolean | Date | string[];
}

export default function PostEditor({ slug, initialData, initialContent, isNew }: PostEditorProps) {
    const router = useRouter();
    const [formData, setFormData] = useState<PostData>(initialData);
    const [content, setContent] = useState(initialContent);
    const [saving, setSaving] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const tags = e.target.value.split(',').map(t => t.trim());
        setFormData((prev) => ({ ...prev, tags }));
    };

    const handleSave = async () => {
        setSaving(true);
        // If new, use the slug from title or let user specify? For simplicity, slug is handled via param or generated here.
        // If it's new, we need a slug.
        let finalSlug = slug;
        if (isNew && slug === 'new') {
            finalSlug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        }

        // Ensure date is a Date object or string correct for YAML
        let publishedDate = new Date();
        if (formData.published) {
            const parsed = new Date(formData.published);
            if (!isNaN(parsed.getTime())) {
                publishedDate = parsed;
            }
        }

        const dataToSave = {
            ...formData,
            published: publishedDate
        };

        await updatePost(finalSlug, dataToSave, content);
        setSaving(false);
        alert('Saved successfully!');
        if (isNew) {
            router.push(`/posts/${finalSlug}`);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
            return;
        }
        await deletePost(slug);
        router.push('/posts');
    };

    return (
        <div className="w-full max-w-5xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">{isNew ? 'Create New Post' : `Editing: ${formData.title}`}</h1>
                <div className="flex gap-4">
                    <Link href="/posts" className="px-4 py-2 text-slate-600 hover:text-slate-900">
                        Cancel
                    </Link>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" />
                        {saving ? 'Saving...' : 'Save Post'}
                    </button>
                    {!isNew && (
                        <button
                            onClick={handleDelete}
                            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                        >
                            <Trash className="w-4 h-4" />
                            Delete
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Content (Markdown)</label>
                        <RichTextEditor
                            content={content}
                            onChange={setContent}
                        />
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
                        <h3 className="font-semibold text-lg border-b pb-2">Metadata</h3>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Slug (URL)</label>
                            <input
                                type="text"
                                value={isNew ? (formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')) : slug}
                                readOnly
                                disabled={!isNew}
                                className="w-full p-2 border rounded-md bg-slate-100 text-slate-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Published Date</label>
                            <input
                                type="date"
                                name="published"
                                value={formData.published ? new Date(formData.published).toISOString().split('T')[0] : ''}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                                className="w-full p-2 border rounded-md"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                            <input
                                type="text"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Tags (comma separated)</label>
                            <input
                                type="text"
                                name="tags"
                                value={formData.tags.join(', ')}
                                onChange={handleTagsChange}
                                className="w-full p-2 border rounded-md"
                            />
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                            <input
                                type="checkbox"
                                name="draft"
                                checked={formData.draft}
                                onChange={(e) => setFormData(prev => ({ ...prev, draft: e.target.checked }))}
                                className="w-4 h-4 text-blue-600 rounded"
                            />
                            <label className="text-sm font-medium text-slate-700">Draft</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
