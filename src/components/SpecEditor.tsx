'use client';

import { useState } from 'react';
import { updateSpec } from '../app/actions';
import { Save } from 'lucide-react';
import Link from 'next/link';
import RichTextEditor from './RichTextEditor';
import CertificationManager from './CertificationManager';

interface SpecEditorProps {
    name: string;
    initialContent: string;
}

export default function SpecEditor({ name, initialContent }: SpecEditorProps) {
    const [content, setContent] = useState(() => {
        if (name === 'skills') {
            const certHeaderRegex = /#\s*Certifications/i;
            const match = initialContent.match(certHeaderRegex);
            if (match && match.index !== undefined) {
                return initialContent.substring(0, match.index).trim();
            }
        }
        return initialContent;
    });

    const [certsHtml, setCertsHtml] = useState(() => {
        if (name === 'skills') {
            const certHeaderRegex = /#\s*Certifications/i;
            const match = initialContent.match(certHeaderRegex);
            if (match && match.index !== undefined) {
                return initialContent.substring(match.index + match[0].length).trim();
            }
        }
        return '';
    });
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        let finalContent = content;

        if (name === 'skills') {
            finalContent = `${content}\n\n# Certifications\n\n${certsHtml}`;
        }

        await updateSpec(name, finalContent);
        setSaving(false);
        alert('Saved successfully!');
    };

    return (
        <div className="w-full max-w-5xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold capitalize">{name} Editor</h1>
                <div className="flex gap-4">
                    <Link href="/" className="px-4 py-2 text-slate-600 hover:text-slate-900">
                        Cancel
                    </Link>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" />
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border p-6">
                    <h2 className="text-xl font-semibold mb-4 text-slate-800">
                        {name === 'skills' ? 'Skills Content' : 'Content'}
                    </h2>
                    <RichTextEditor
                        content={content}
                        onChange={setContent}
                    />
                </div>

                {name === 'skills' && (
                    <CertificationManager
                        initialHtml={certsHtml}
                        onChange={setCertsHtml}
                    />
                )}
            </div>
        </div>
    );
}
