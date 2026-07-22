"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { resourcesApi, ResourceFolder, ResourceItem } from "@/lib/api/resources";
import { Plus, Trash, Folder as FolderIcon, Link as LinkIcon } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminResourcesPage() {
  const [folders, setFolders] = useState<ResourceFolder[]>([]);
  const [items, setItems] = useState<ResourceItem[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);

  const { register: registerFolder, handleSubmit: handleFolderSubmit, reset: resetFolder } = useForm<ResourceFolder>();
  const { register: registerItem, handleSubmit: handleItemSubmit, reset: resetItem } = useForm<ResourceItem>();

  useEffect(() => {
    fetchFolders();
  }, []);

  useEffect(() => {
    if (selectedFolder) {
      fetchItems(selectedFolder);
    } else {
      setItems([]);
    }
  }, [selectedFolder]);

  const fetchFolders = async () => {
    const data = await resourcesApi.getAllFolders();
    setFolders(data);
  };

  const fetchItems = async (folderId: string) => {
    const data = await resourcesApi.getItemsByFolder(folderId);
    setItems(data);
  };

  const onFolderSubmit = async (data: ResourceFolder) => {
    try {
      await resourcesApi.createFolder(data);
      toast.success("Folder created");
      setIsFolderModalOpen(false);
      resetFolder();
      fetchFolders();
    } catch (e) {
      toast.error("Failed to create folder");
    }
  };

  const onItemSubmit = async (data: ResourceItem) => {
    if (!selectedFolder) return;
    try {
      // Convert techStack string to array
      const payload = {
        ...data,
        techStack: (data.techStack as unknown as string).split(',').map(s => s.trim()).filter(Boolean)
      };
      await resourcesApi.createItem(selectedFolder, payload);
      toast.success("Resource added");
      setIsItemModalOpen(false);
      resetItem();
      fetchItems(selectedFolder);
    } catch (e) {
      toast.error("Failed to add resource");
    }
  };

  const deleteFolder = async (id: string) => {
    if(!confirm("Delete folder and all contents?")) return;
    try {
      await resourcesApi.deleteFolder(id);
      toast.success("Folder deleted");
      if(selectedFolder === id) setSelectedFolder(null);
      fetchFolders();
    } catch (e) {
      toast.error("Error deleting folder");
    }
  };

  const deleteItem = async (id: string) => {
    if(!confirm("Delete this resource?")) return;
    try {
      await resourcesApi.deleteItem(id);
      toast.success("Resource deleted");
      if(selectedFolder) fetchItems(selectedFolder);
    } catch (e) {
      toast.error("Error deleting resource");
    }
  };

  return (
    <div className="p-8 flex h-[calc(100vh-80px)] overflow-hidden gap-8">
      {/* Sidebar: Folders */}
      <div className="w-1/3 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-6 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Folders</h2>
          <button onClick={() => setIsFolderModalOpen(true)} className="p-2 bg-blue-600/10 text-blue-500 rounded-lg hover:bg-blue-600/20">
            <Plus size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-2">
          {folders.map(folder => (
            <div 
              key={folder.id} 
              className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-colors ${selectedFolder === folder.id ? 'bg-blue-600 text-white' : 'hover:bg-black/5 dark:hover:bg-white/5 border border-transparent'}`}
              onClick={() => setSelectedFolder(folder.id)}
            >
              <div className="flex items-center gap-3">
                <FolderIcon size={20} className={selectedFolder === folder.id ? 'text-white' : 'text-blue-500'} />
                <span className="font-medium">{folder.name}</span>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); deleteFolder(folder.id); }}
                className={`p-1 rounded ${selectedFolder === folder.id ? 'hover:bg-white/20' : 'text-red-500 hover:bg-red-500/10'}`}
              >
                <Trash size={16} />
              </button>
            </div>
          ))}
          {folders.length === 0 && <div className="text-center text-gray-500 mt-10">No folders created yet.</div>}
        </div>
      </div>

      {/* Main Content: Items */}
      <div className="flex-1 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-6 flex flex-col">
        {!selectedFolder ? (
          <div className="flex-1 flex flex-col items-center justify-center text-[var(--text-muted)]">
            <FolderIcon size={48} className="mb-4 opacity-50" />
            <p>Select a folder to view and manage resources</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Resources</h2>
              <button onClick={() => setIsItemModalOpen(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-colors">
                <Plus size={18} /> Add Link
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
              {items.map(item => (
                <div key={item.id} className="p-5 border border-[var(--card-border)] rounded-2xl bg-black/5 dark:bg-white/5 relative group">
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => deleteItem(item.id)} className="text-red-500 hover:bg-red-500/10 p-1.5 rounded-lg">
                      <Trash size={16} />
                    </button>
                  </div>
                  <div className="flex items-start gap-3 mb-2">
                    <div className="p-2 bg-blue-500/20 text-blue-500 rounded-lg shrink-0">
                      <LinkIcon size={18} />
                    </div>
                    <div>
                      <h4 className="font-bold">{item.title}</h4>
                      <p className="text-sm text-[var(--text-muted)] line-clamp-2">{item.description}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.techStack?.map(tech => (
                      <span key={tech} className="px-2 py-1 text-xs bg-[var(--foreground)] text-[var(--background)] rounded-md font-medium">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <a href={item.url} target="_blank" rel="noreferrer" className="block mt-4 text-sm text-blue-500 hover:underline truncate">
                    {item.url}
                  </a>
                </div>
              ))}
              {items.length === 0 && <div className="col-span-full text-center py-10 text-gray-500">Folder is empty. Add a resource link.</div>}
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      {isFolderModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--background)] border border-[var(--card-border)] rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Create Folder</h2>
            <form onSubmit={handleFolderSubmit(onFolderSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Name</label>
                <input {...registerFolder("name", { required: true })} className="w-full bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-2" />
              </div>
              <div>
                <label className="block text-sm mb-1">Description</label>
                <textarea {...registerFolder("description")} className="w-full bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-2" />
              </div>
              <div className="flex gap-4">
                <button type="button" onClick={() => setIsFolderModalOpen(false)} className="flex-1 border border-[var(--card-border)] py-2 rounded-lg">Cancel</button>
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isItemModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--background)] border border-[var(--card-border)] rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Add Resource Link</h2>
            <form onSubmit={handleItemSubmit(onItemSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Title</label>
                <input {...registerItem("title", { required: true })} className="w-full bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-2" />
              </div>
              <div>
                <label className="block text-sm mb-1">Description</label>
                <textarea {...registerItem("description")} className="w-full bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-2" />
              </div>
              <div>
                <label className="block text-sm mb-1">URL / Link</label>
                <input {...registerItem("url", { required: true })} className="w-full bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-2" />
              </div>
              <div>
                <label className="block text-sm mb-1">Tech Stack (comma separated)</label>
                <input {...registerItem("techStack")} placeholder="React, Node.js, Python" className="w-full bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-2" />
              </div>
              <div className="flex gap-4">
                <button type="button" onClick={() => setIsItemModalOpen(false)} className="flex-1 border border-[var(--card-border)] py-2 rounded-lg">Cancel</button>
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
