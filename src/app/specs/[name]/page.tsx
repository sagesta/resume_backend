import { fetchSpec } from '../../actions';
import SpecEditor from '@/components/SpecEditor';

export default async function SpecPage(props: { params: Promise<{ name: string }> }) {
    const params = await props.params;
    const spec = await fetchSpec(params.name);

    if (!spec) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center p-24">
                <h1 className="text-2xl font-bold">Spec &quot;{params.name}&quot; not found</h1>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50">
            <SpecEditor key={params.name} name={params.name} initialContent={spec.content} />
        </main>
    );
}
