"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { alumniApi, Alumni } from "@/lib/api/alumni";
import { Plus, Trash, Edit, Check } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminAlumniPage() {
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Alumni>();

  useEffect(() => {
    fetchAlumni();
  }, []);

  const fetchAlumni = async () => {
    const data = await alumniApi.getAllAlumni();
    setAlumni(data);
  };

  const onSubmit = async (data: Alumni) => {
    try {
      await alumniApi.createAlumni(data);
      toast.success("Alumni created successfully");
      setIsModalOpen(false);
      reset();
      fetchAlumni();
    } catch (e) {
      toast.error("Failed to create Alumni");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this alumni?")) return;
    try {
      await alumniApi.deleteAlumni(id);
      toast.success("Deleted successfully");
      fetchAlumni();
    } catch (e) {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Alumni</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-colors"
        >
          <Plus size={20} /> Add Alumni
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {alumni.map((alum) => (
          <div key={alum.id} className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6 relative group shadow-sm">
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => handleDelete(alum.id)} className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg">
                <Trash size={18} />
              </button>
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              {alum.imageUrl ? (
                <img src={alum.imageUrl} alt={alum.name} className="w-16 h-16 rounded-full object-cover" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                  <span className="text-2xl">{alum.name.charAt(0)}</span>
                </div>
              )}
              <div>
                <h3 className="font-bold text-lg">{alum.name}</h3>
                <p className="text-sm text-[var(--text-muted)]">Batch of {alum.batchYear}</p>
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm"><span className="font-semibold">Company:</span> {alum.company}</p>
              <p className="text-sm"><span className="font-semibold">Role:</span> {alum.role}</p>
              {alum.linkedInUrl && (
                <a href={alum.linkedInUrl} target="_blank" rel="noreferrer" className="text-blue-500 text-sm hover:underline">
                  LinkedIn Profile
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--background)] border border-[var(--card-border)] rounded-2xl p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6">Add New Alumni</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input {...register("name", { required: true })} className="w-full bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg px-4 py-2" />
                {errors.name && <span className="text-red-500 text-xs">Required</span>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Batch Year</label>
                <input type="number" {...register("batchYear", { required: true })} className="w-full bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg px-4 py-2" />
                {errors.batchYear && <span className="text-red-500 text-xs">Required</span>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Company</label>
                <input {...register("company", { required: true })} className="w-full bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg px-4 py-2" />
                {errors.company && <span className="text-red-500 text-xs">Required</span>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Job Title</label>
                <input {...register("role", { required: true })} className="w-full bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg px-4 py-2" />
                {errors.role && <span className="text-red-500 text-xs">Required</span>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">LinkedIn URL</label>
                <input {...register("linkedInUrl")} className="w-full bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg px-4 py-2" />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Image URL (Optional)</label>
                <input {...register("imageUrl")} className="w-full bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg px-4 py-2" />
              </div>
              
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 border border-[var(--card-border)] rounded-lg">Cancel</button>
                <button type="submit" className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg flex justify-center items-center gap-2"><Check size={18} /> Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
