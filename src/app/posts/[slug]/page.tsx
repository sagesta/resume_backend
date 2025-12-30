import { fetchPost } from '../../actions';
import PostEditor from '@/components/PostEditor';

export default async function PostEditPage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const isNew = params.slug === 'new';
    let post = null;

    if (!isNew) {
        post = await fetchPost(params.slug);
    }

    const initialData = post ? post.frontmatter : {
        title: '',
        published: new Date().toISOString(),
        description: '',
        tags: [],
        category: '',
        draft: false,
    };

    const initialContent = post ? post.content : '';

    return (
        <main className="min-h-screen bg-slate-50">
            <PostEditor
                slug={params.slug}
                initialData={initialData}
                initialContent={initialContent}
                isNew={isNew}
            />
        </main>
    );
}
