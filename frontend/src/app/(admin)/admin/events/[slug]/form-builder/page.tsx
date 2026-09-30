"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Save, Trash2, GripVertical, FileText } from "lucide-react";
import Link from "next/link";
import { apiClient } from "@/lib/api/client";
import { motion, Reorder } from "framer-motion";


const defaultFields = [
  { id: 'f1', type: 'text', label: 'Name', required: true },
  { id: 'f2', type: 'text', label: 'Email', required: true },
  { id: 'f3', type: 'number', label: 'Phone No', required: true },
  { id: 'f4', type: 'text', label: 'Roll No', required: true },
  { id: 'f5', type: 'dropdown', label: 'University / College', required: true, options: ['JSS Academy of Technical Education Noida', 'Other'] }
];

export default function FormBuilderPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  
  const [event, setEvent] = useState<any>(null);
  const [fields, setFields] = useState<any[]>([]);
  const [header, setHeader] = useState<{ title: string; description: string; emoji: string; coverUrl?: string }>({ title: "", description: "", emoji: "", coverUrl: "" });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    apiClient.get(`/events/${resolvedParams.slug}`).then((res) => {
      setEvent(res.data);
      if (res.data.formSchema) {
        try {
          const schema = JSON.parse(res.data.formSchema);
          setFields((schema.fields && schema.fields.length > 0) ? schema.fields : defaultFields);
          setHeader(schema.header || { title: "", description: "", emoji: "" });
        } catch (e) {}
      } else {
        setFields(defaultFields);
        setHeader({ title: res.data.title + " Registration", description: res.data.description || "", emoji: "🎉" });
      }
    });
  }, [resolvedParams.slug]);

  const addField = (type: string) => {
    setFields([...fields, { id: Date.now().toString(), type, label: "New Question", required: true, options: type === 'dropdown' || type === 'checkbox' ? ["Option 1"] : [] }]);
  };

  const updateField = (id: string, updates: any) => {
    setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const removeField = (id: string) => {
    setFields(fields.filter(f => f.id !== id));
  };

  const saveSchema = async () => {
    setIsSaving(true);
    const schemaStr = JSON.stringify({ header, fields });
    try {
      await apiClient.put(`/events/${resolvedParams.slug}`, { ...event, formSchema: schemaStr });
      alert("Form saved successfully!");
    } catch (err) {
      alert("Failed to save form.");
    }
    setIsSaving(false);
  };

  if (!event) return <div className="p-10">Loading...</div>;

  return (
    <div className="font-['Outfit'] pb-20">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/events" className="p-2 hover:bg-black/5 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-black">Form Builder: {event.title}</h1>
        </div>
        <button onClick={saveSchema} disabled={isSaving} className="px-6 py-2.5 bg-[#111] text-white font-bold rounded-xl flex items-center gap-2 hover:bg-black transition-colors">
          <Save className="w-4 h-4" /> {isSaving ? "Saving..." : "Save Form"}
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white/70 backdrop-blur-xl p-6 rounded-[2rem] border border-white shadow-sm">
            <h2 className="text-lg font-black mb-4">Header Configuration</h2>
            <div className="space-y-4">
              
              
              <div>
                <label className="block text-sm font-bold mb-1 flex justify-between">Cover Image URL <span className="text-neutral-400 font-normal">(optional)</span></label>
                <input type="text" value={header.coverUrl || ''} onChange={e => setHeader({...header, coverUrl: e.target.value})} placeholder="https://..." className="w-full px-4 py-2 bg-white/50 border border-black/5 rounded-xl" />
              </div>

              <div>
                <label className="block text-sm font-bold mb-1">Title</label>
                <input type="text" value={header.title} onChange={e => setHeader({...header, title: e.target.value})} placeholder="e.g. Register for Workshop!" className="w-full px-4 py-2 bg-white/50 border border-black/5 rounded-xl" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Description</label>
                <textarea value={header.description} onChange={e => setHeader({...header, description: e.target.value})} placeholder="e.g. Join us for an amazing session..." className="w-full px-4 py-2 bg-white/50 border border-black/5 rounded-xl min-h-[100px]" />
              </div>
            </div>
          </div>

          <Reorder.Group axis="y" values={fields} onReorder={setFields} className="space-y-4">
            {fields.map((f) => (
              <Reorder.Item key={f.id} value={f} id={f.id} className="bg-white/70 backdrop-blur-xl p-6 rounded-[2rem] border border-white shadow-sm flex gap-4 cursor-grab active:cursor-grabbing">
                <div className="text-neutral-400 mt-2"><GripVertical className="w-5 h-5" /></div>
                <div className="flex-1 space-y-4 cursor-auto" onPointerDownCapture={(e) => e.stopPropagation()}>
                  <div className="flex justify-between items-start">
                    <input type="text" value={f.label} onChange={e => updateField(f.id, { label: e.target.value })} className="font-bold text-lg bg-transparent border-b border-dashed border-black/20 focus:outline-none focus:border-black/50 px-1 py-1 w-full max-w-sm" />
                    <button onClick={() => removeField(f.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  <div className="flex items-center gap-4 text-sm font-medium">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={f.required} onChange={e => updateField(f.id, { required: e.target.checked })} /> Required
                    </label>
                    <span className="px-2 py-1 bg-black/5 rounded-md text-xs uppercase tracking-wider">{f.type}</span>
                  </div>

                  {f.type === 'image' ? (
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-neutral-500">IMAGE URL</label>
                      <input type="text" value={f.imageUrl || ''} onChange={e => updateField(f.id, { imageUrl: e.target.value })} placeholder="https://..." className="w-full px-4 py-2 bg-white/50 border border-black/5 rounded-xl text-sm" />
                      {f.imageUrl && <img src={f.imageUrl} alt="Preview" className="w-full max-h-40 object-contain rounded-lg border border-black/10 mt-2" />}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-neutral-500 flex justify-between">QUESTION IMAGE URL <span className="font-normal text-neutral-400">(optional)</span></label>
                      <input type="text" value={f.imageUrl || ''} onChange={e => updateField(f.id, { imageUrl: e.target.value })} placeholder="https://..." className="w-full px-4 py-2 bg-white/50 border border-black/5 rounded-xl text-sm" />
                    </div>
                  )}

                  {(f.type === 'dropdown' || f.type === 'checkbox') && (
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-neutral-500">OPTIONS (Comma separated)</label>
                      <input type="text" value={f.options?.join(', ')} onChange={e => updateField(f.id, { options: e.target.value.split(',').map(s=>s.trim()) })} className="w-full px-4 py-2 bg-white/50 border border-black/5 rounded-xl text-sm" />
                    </div>
                  )}
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </div>

        <div className="space-y-4">
          <div className="bg-white/70 backdrop-blur-xl p-6 rounded-[2rem] border border-white shadow-sm sticky top-24">
            <h2 className="text-lg font-black mb-4">Add Fields</h2>
            <div className="grid gap-2">
              <button onClick={() => addField('text')} className="flex items-center gap-3 px-4 py-3 bg-white hover:bg-black/5 border border-black/5 rounded-xl font-medium transition-colors text-left"><FileText className="w-4 h-4" /> Short Text</button>
              <button onClick={() => addField('textarea')} className="flex items-center gap-3 px-4 py-3 bg-white hover:bg-black/5 border border-black/5 rounded-xl font-medium transition-colors text-left"><FileText className="w-4 h-4" /> Paragraph</button>
              <button onClick={() => addField('image')} className="flex items-center gap-3 px-4 py-3 bg-white hover:bg-black/5 border border-black/5 rounded-xl font-medium transition-colors text-left"><FileText className="w-4 h-4" /> Image Block</button>
              <button onClick={() => addField('number')} className="flex items-center gap-3 px-4 py-3 bg-white hover:bg-black/5 border border-black/5 rounded-xl font-medium transition-colors text-left"><FileText className="w-4 h-4" /> Number</button>
              <button onClick={() => addField('dropdown')} className="flex items-center gap-3 px-4 py-3 bg-white hover:bg-black/5 border border-black/5 rounded-xl font-medium transition-colors text-left"><FileText className="w-4 h-4" /> Dropdown</button>
              <button onClick={() => addField('checkbox')} className="flex items-center gap-3 px-4 py-3 bg-white hover:bg-black/5 border border-black/5 rounded-xl font-medium transition-colors text-left"><FileText className="w-4 h-4" /> Checkboxes</button>
            </div>
            
            <div className="mt-8 p-5 bg-blue-50 border border-blue-100 text-blue-600 rounded-2xl text-sm font-medium shadow-sm">
              <p className="mb-3 font-bold">Public Registration Link</p>
              <div className="flex items-center gap-2 bg-white rounded-xl p-2 border border-blue-200">
                <input 
                  type="text" 
                  readOnly 
                  value={typeof window !== "undefined" ? `${window.location.origin}/events/${resolvedParams.slug}/register` : `/events/${resolvedParams.slug}/register`} 
                  className="flex-1 bg-transparent border-none outline-none text-xs px-2 truncate font-mono text-neutral-600"
                />
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/events/${resolvedParams.slug}/register`);
                    alert("Link copied!");
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-bold text-xs transition-colors"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
