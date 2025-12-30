'use client';

import { useState, useEffect } from 'react';
import { uploadImage } from '../app/actions';
import { Plus, Trash, Edit, Upload, ExternalLink } from 'lucide-react';

interface Certification {
    id: string;
    name: string;
    url: string;
    image: string;
}

interface CertificationManagerProps {
    initialHtml: string;
    onChange: (html: string) => void;
}

export default function CertificationManager({ initialHtml, onChange }: CertificationManagerProps) {
    const [certs, setCerts] = useState<Certification[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentCert, setCurrentCert] = useState<Certification>({ id: '', name: '', url: '', image: '' });
    const [uploading, setUploading] = useState(false);

    // Parse HTML on mount
    useEffect(() => {
        if (!initialHtml) return;

        const parser = new DOMParser();
        const doc = parser.parseFromString(initialHtml, 'text/html');
        const anchors = doc.querySelectorAll('a.cert-card');

        const parsedCerts: Certification[] = Array.from(anchors).map((a, index) => {
            const img = a.querySelector('img');
            const span = a.querySelector('span');
            return {
                id: index.toString(),
                name: span?.textContent || '',
                url: a.getAttribute('href') || '',
                image: img?.getAttribute('src') || ''
            };
        });

        setCerts(parsedCerts);
    }, []);

    // Sync changes to HTML string
    useEffect(() => {
        const generateHtml = () => {
            if (certs.length === 0) return '';

            const cardsHtml = certs.map(cert => `
  <a href="${cert.url}" target="_blank" class="cert-card" style="text-decoration: none; color: inherit; display: flex; flex-direction: column; align-items: center; gap: 0.5rem; text-align: center;">
    <img src="${cert.image}" width="120" height="120" alt="${cert.name}" style="transition: transform 0.2s;">
    <span style="font-size: 1rem; font-weight: 600;">${cert.name}</span>
  </a>`).join('\n');

            return `<div class="cert-container" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; justify-items: center;">
${cardsHtml}
</div>`;
        };

        if (certs.length > 0) {
            onChange(generateHtml());
        }
    }, [certs, onChange]);

    const handleEdit = (cert: Certification) => {
        setCurrentCert(cert);
        setIsEditing(true);
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this certification?')) {
            setCerts(prev => prev.filter(c => c.id !== id));
        }
    };

    const handleSave = () => {
        if (currentCert.id) {
            setCerts(prev => prev.map(c => c.id === currentCert.id ? currentCert : c));
        } else {
            setCerts(prev => [...prev, { ...currentCert, id: Date.now().toString() }]);
        }
        setIsEditing(false);
        setCurrentCert({ id: '', name: '', url: '', image: '' });
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const url = await uploadImage(formData);
            setCurrentCert(prev => ({ ...prev, image: url }));
        } catch (error) {
            console.error(error);
            alert('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border p-6 mt-6">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-xl font-semibold">Certifications</h2>
                <button
                    onClick={() => { setCurrentCert({ id: '', name: '', url: '', image: '' }); setIsEditing(true); }}
                    className="flex items-center gap-2 bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 text-sm"
                >
                    <Plus className="w-4 h-4" /> Add Certificate
                </button>
            </div>

            {isEditing && (
                <div className="mb-8 p-4 bg-slate-50 rounded-lg border">
                    <h3 className="font-semibold mb-4">{currentCert.id ? 'Edit Certificate' : 'New Certificate'}</h3>
                    <div className="grid gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Name</label>
                            <input
                                type="text"
                                value={currentCert.name}
                                onChange={e => setCurrentCert(prev => ({ ...prev, name: e.target.value }))}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Link URL</label>
                            <input
                                type="text"
                                value={currentCert.url}
                                onChange={e => setCurrentCert(prev => ({ ...prev, url: e.target.value }))}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Logo Image</label>
                            <div className="flex items-center gap-4">
                                {currentCert.image && <img src={currentCert.image} className="w-16 h-16 object-contain bg-white border rounded" />}
                                <label className="cursor-pointer bg-white border px-3 py-2 rounded shadow-sm hover:bg-slate-50 flex items-center gap-2">
                                    <Upload className="w-4 h-4" />
                                    {uploading ? 'Uploading...' : 'Upload Image'}
                                    <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                                </label>
                            </div>
                        </div>
                        <div className="flex gap-2 mt-2">
                            <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Done</button>
                            <button onClick={() => setIsEditing(false)} className="text-slate-600 px-4 py-2 hover:underline">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {certs.map(cert => (
                    <div key={cert.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-slate-50 group">
                        <img src={cert.image} alt={cert.name} className="w-12 h-12 object-contain" />
                        <div className="flex-1">
                            <div className="font-semibold">{cert.name}</div>
                            <a href={cert.url} target="_blank" className="text-xs text-blue-500 hover:underline flex items-center gap-1">
                                View Credential <ExternalLink className="w-3 h-3" />
                            </a>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEdit(cert)} className="p-2 text-slate-500 hover:text-blue-600"><Edit className="w-4 h-4" /></button>
                            <button onClick={() => handleDelete(cert.id)} className="p-2 text-slate-500 hover:text-red-600"><Trash className="w-4 h-4" /></button>
                        </div>
                    </div>
                ))}
                {certs.length === 0 && !isEditing && (
                    <div className="text-center text-slate-500 py-8 col-span-2">No certificates found.</div>
                )}
            </div>
        </div>
    );
}
