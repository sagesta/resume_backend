'use client';

import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { Markdown } from 'tiptap-markdown';
import { Bold, Italic, List, ListOrdered, Link as LinkIcon, Image as ImageIcon, Heading1, Heading2, Quote, Code, Terminal, Upload } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { uploadImage } from '../app/actions';

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
    className?: string;
}

const MenuBar = ({ editor }: { editor: Editor | null }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!editor) {
        return null;
    }

    const addImage = () => {
        const url = window.prompt('URL');
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);

        // cancelled
        if (url === null) {
            return;
        }

        // empty
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        // update link
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const formData = new FormData();
            formData.append('file', file);
            formData.append('folder', 'posts');

            try {
                const url = await uploadImage(formData);
                editor.chain().focus().setImage({ src: url }).run();
            } catch (error) {
                console.error('Upload failed:', error);
                alert('Upload failed: ' + error);
            }
        }
    };

    return (
        <div className="flex flex-wrap gap-2 p-2 border-b bg-slate-50 rounded-t-lg">
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                className={`p-2 rounded ${editor.isActive('bold') ? 'bg-slate-200' : 'hover:bg-slate-200'}`}
                title="Bold"
            >
                <Bold className="w-4 h-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                className={`p-2 rounded ${editor.isActive('italic') ? 'bg-slate-200' : 'hover:bg-slate-200'}`}
                title="Italic"
            >
                <Italic className="w-4 h-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleCode().run()}
                disabled={!editor.can().chain().focus().toggleCode().run()}
                className={`p-2 rounded ${editor.isActive('code') ? 'bg-slate-200' : 'hover:bg-slate-200'}`}
                title="Inline Code"
            >
                <Code className="w-4 h-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={`p-2 rounded ${editor.isActive('heading', { level: 1 }) ? 'bg-slate-200' : 'hover:bg-slate-200'}`}
                title="Heading 1"
            >
                <Heading1 className="w-4 h-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`p-2 rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-slate-200' : 'hover:bg-slate-200'}`}
                title="Heading 2"
            >
                <Heading2 className="w-4 h-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`p-2 rounded ${editor.isActive('bulletList') ? 'bg-slate-200' : 'hover:bg-slate-200'}`}
                title="Bullet List"
            >
                <List className="w-4 h-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`p-2 rounded ${editor.isActive('orderedList') ? 'bg-slate-200' : 'hover:bg-slate-200'}`}
                title="Ordered List"
            >
                <ListOrdered className="w-4 h-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={`p-2 rounded ${editor.isActive('blockquote') ? 'bg-slate-200' : 'hover:bg-slate-200'}`}
                title="Blockquote"
            >
                <Quote className="w-4 h-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                className={`p-2 rounded ${editor.isActive('codeBlock') ? 'bg-slate-200' : 'hover:bg-slate-200'}`}
                title="Code Block"
            >
                <Terminal className="w-4 h-4" />
            </button>
            <button
                onClick={setLink}
                className={`p-2 rounded ${editor.isActive('link') ? 'bg-slate-200' : 'hover:bg-slate-200'}`}
                title="Link"
            >
                <LinkIcon className="w-4 h-4" />
            </button>
            <button
                onClick={addImage}
                className="p-2 rounded hover:bg-slate-200"
                title="External Image URL"
            >
                <ImageIcon className="w-4 h-4" />
            </button>
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleUpload}
            />
            <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded hover:bg-slate-200"
                title="Upload Image"
            >
                <Upload className="w-4 h-4" />
            </button>
        </div>
    );
};

export default function RichTextEditor({ content, onChange, className = '' }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Link.configure({
                openOnClick: false,
            }),
            Image,
            Markdown,
        ],
        content,
        onUpdate: ({ editor }) => {
            // We want markdown output
            const markdown = (editor.storage as unknown as { markdown: { getMarkdown: () => string } }).markdown.getMarkdown();
            onChange(markdown);
        },
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] p-4',
            },
        },
    });

    // Update content if changed externally (e.g., initial load)
    useEffect(() => {
        if (editor && content !== (editor.storage as unknown as { markdown: { getMarkdown: () => string } }).markdown.getMarkdown()) {
            // Avoid cursor jumping issues by only setting if significantly different or empty
            // Since we sync out, this might cause loops if not careful. 
            // For this simple case, we'll assume content prop is source of truth mainly on init.
            // editor.commands.setContent(content); 
        }
    }, [content, editor]);

    return (
        <div className={`border rounded-lg overflow-hidden bg-white ${className}`}>
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
}
