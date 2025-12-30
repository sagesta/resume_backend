import { fetchPosts } from '../actions';
import Link from 'next/link';
import { Plus, Edit } from 'lucide-react';

export default async function PostsPage() {
    const posts = await fetchPosts();

    return (
        <main className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <Link href="/" className="text-sm text-slate-500 hover:underline mb-2 block">← Back to Dashboard</Link>
                        <h1 className="text-3xl font-bold">Posts & Projects</h1>
                    </div>
                    <Link href="/posts/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        New Post
                    </Link>
                </div>

                <div className="grid gap-4">
                    {posts.map((post) => (
                        <div key={post.slug} className="bg-white p-4 rounded-xl shadow-sm border flex justify-between items-center hover:shadow-md transition-shadow">
                            <div>
                                <h2 className="text-xl font-semibold">{post.frontmatter.title}</h2>
                                <div className="flex gap-2 text-sm text-slate-500 mt-1">
                                    <span>{new Date(post.frontmatter.published).toLocaleDateString()}</span>
                                    <span>•</span>
                                    <span className="capitalize">{post.frontmatter.category || 'Uncategorized'}</span>
                                    {post.frontmatter.draft && <span className="bg-yellow-100 text-yellow-800 px-2 rounded-full text-xs py-0.5 ml-2">Draft</span>}
                                </div>
                            </div>
                            <Link href={`/posts/${post.slug}`} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                <Edit className="w-5 h-5" />
                            </Link>
                        </div>
                    ))}

                    {posts.length === 0 && (
                        <div className="text-center py-12 text-slate-500">
                            No posts found. Create your first one!
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
