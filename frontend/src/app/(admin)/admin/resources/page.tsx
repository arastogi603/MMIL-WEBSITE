"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { resourcesApi, ResourceFolder, ResourceItem } from "@/lib/api/resources";
import { Plus, Trash, Folder as FolderIcon, Link as LinkIcon, ExternalLink, Code, Search, ChevronRight, File, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { withRoleGuard } from "@/components/auth/RoleGuard";

function AdminResourcesPage() {
  const [folders, setFolders] = useState<ResourceFolder[]>([]);
  const [items, setItems] = useState<ResourceItem[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { register: registerFolder, handleSubmit: handleFolderSubmit, reset: resetFolder, formState: { isSubmitting: isSubmittingFolder } } = useForm<ResourceFolder>();
  const { register: registerItem, handleSubmit: handleItemSubmit, reset: resetItem, formState: { isSubmitting: isSubmittingItem } } = useForm<ResourceItem>();

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
    setIsLoading(true);
    try {
      const data = await resourcesApi.getAllFolders();
      setFolders(data);
      if (data.length > 0 && !selectedFolder) {
        setSelectedFolder(data[0].id);
      }
    } catch (e) {
      toast.error("Failed to load folders");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchItems = async (folderId: string) => {
    setItems([]); 
    try {
      const data = await resourcesApi.getItemsByFolder(folderId);
      setItems(data);
    } catch (e) {
      console.error(e);
    }
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

  const deleteFolder = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if(!confirm("Are you sure? This will delete the folder and ALL its contents!")) return;
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

  const inputClass = "w-full bg-white/50 backdrop-blur-xl border border-black/10 rounded-xl py-3 px-4 text-[#111] focus:outline-none focus:border-[#111] focus:ring-1 focus:ring-[#111]/20 transition-all placeholder:text-neutral-500 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]";

  return (
    <div className="font-['Outfit'] relative flex flex-col h-[calc(100vh-80px)] min-h-[600px]">
      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[20%] w-[30%] h-[30%] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none z-0" />

      <div className="flex flex-col md:flex-row h-full w-full gap-6 p-4 md:p-8 relative z-10 overflow-hidden">
        
        {/* Sidebar: Folders */}
        <div className="w-full md:w-80 flex-shrink-0 bg-white/70 backdrop-blur-xl border border-white rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.04),inset_0_2px_4px_rgba(255,255,255,1)] flex flex-col overflow-hidden">
          <div className="p-5 md:p-6 border-b border-black/5 flex justify-between items-center bg-white/40">
            <h2 className="text-xl font-black text-[#111] flex items-center gap-2">
              <FolderIcon className="w-5 h-5 text-blue-500" /> Folders
            </h2>
            <button
              onClick={() => setIsFolderModalOpen(true)}
              className="p-2 bg-[#111] text-white rounded-xl hover:bg-black transition-colors shadow-md active:scale-95"
            >
              <Plus size={18} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {isLoading ? (
              <div className="py-10 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-neutral-400" /></div>
            ) : folders.length === 0 ? (
              <div className="py-10 text-center text-neutral-400 text-sm font-medium">No folders created yet.</div>
            ) : (
              folders.map(folder => (
                <div 
                  key={folder.id}
                  onClick={() => setSelectedFolder(folder.id)}
                  className={`flex justify-between items-center p-4 rounded-2xl cursor-pointer transition-all border ${
                    selectedFolder === folder.id 
                    ? 'bg-blue-50 border-blue-200 shadow-[inset_0_2px_4px_rgba(255,255,255,1)]' 
                    : 'bg-transparent border-transparent hover:bg-white/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)] ${selectedFolder === folder.id ? 'bg-blue-100' : 'bg-neutral-100'}`}>
                      <FolderIcon size={16} className={selectedFolder === folder.id ? 'text-blue-600' : 'text-neutral-500'} />
                    </div>
                    <div>
                      <h3 className={`font-bold text-sm ${selectedFolder === folder.id ? 'text-blue-900' : 'text-[#111]'}`}>
                        {folder.name}
                      </h3>
                      <p className="text-xs text-neutral-500 font-medium truncate max-w-[150px]">{folder.description}</p>
                    </div>
                  </div>
                  {selectedFolder === folder.id && (
                    <button 
                      onClick={(e) => deleteFolder(folder.id, e)}
                      className="text-neutral-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash size={16} />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Main Content: Items */}
        <div className="flex-1 bg-white/70 backdrop-blur-xl border border-white rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.04),inset_0_2px_4px_rgba(255,255,255,1)] flex flex-col overflow-hidden min-h-[400px]">
          {selectedFolder ? (
            <>
              <div className="p-5 md:p-6 border-b border-black/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/40">
                <div>
                  <h1 className="text-2xl md:text-3xl font-black text-[#111]">
                    {folders.find(f => f.id === selectedFolder)?.name}
                  </h1>
                  <p className="text-sm text-neutral-500 font-medium flex items-center gap-1 mt-1">
                    <span className="truncate max-w-[200px]">{folders.find(f => f.id === selectedFolder)?.description}</span> <ChevronRight className="w-3 h-3 flex-shrink-0" /> {items.length} items
                  </p>
                </div>
                <button
                  onClick={() => setIsItemModalOpen(true)}
                  className="w-full sm:w-auto px-5 py-2.5 bg-[#111] hover:bg-black text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_4px_15px_rgba(0,0,0,0.15)] active:scale-95"
                >
                  <Plus size={18} /> Add Resource
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {items.length === 0 ? (
                    <div className="col-span-full py-20 text-center">
                      <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-black/5">
                        <File className="w-8 h-8 text-neutral-400" />
                      </div>
                      <h3 className="text-xl font-black text-[#111]">Folder is empty</h3>
                      <p className="text-neutral-500 font-medium mt-1">Add resources like links, docs, or tools here.</p>
                    </div>
                  ) : (
                    items.map(item => (
                      <div key={item.id} className="group bg-[#faf7f3] border border-black/5 p-5 md:p-6 rounded-2xl relative shadow-[inset_0_2px_4px_rgba(255,255,255,1)] transition-all hover:shadow-[0_8px_20px_rgba(0,0,0,0.04)]">
                        <button 
                          onClick={() => deleteItem(item.id)} 
                          className="absolute top-4 right-4 text-neutral-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-xl transition-colors opacity-100 md:opacity-0 group-hover:opacity-100"
                        >
                          <Trash size={18} />
                        </button>
                        
                        <div className="flex gap-4">
                          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 shadow-[inset_0_1px_2px_rgba(255,255,255,1)]">
                            <LinkIcon size={24} />
                          </div>
                          <div>
                            <h4 className="font-black text-lg text-[#111] pr-10">{item.title}</h4>
                            <p className="text-sm text-neutral-600 font-medium mt-1 leading-relaxed">{item.description}</p>
                            
                            {item.techStack && item.techStack.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-4">
                                {item.techStack.map(t => (
                                  <span key={t} className="px-2.5 py-1 bg-white border border-black/5 rounded-lg text-xs font-bold text-neutral-600 shadow-sm">{t}</span>
                                ))}
                              </div>
                            )}

                            <a 
                              href={item.url} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="inline-flex items-center gap-2 mt-5 text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline"
                            >
                              Open Resource <ExternalLink size={14} />
                            </a>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col justify-center items-center p-8 text-center text-neutral-400">
              <FolderIcon className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-xl font-black text-neutral-300">Select or create a folder</p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {isFolderModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white/90 backdrop-blur-2xl border border-white rounded-[2rem] p-6 md:p-8 w-full max-w-sm shadow-[0_20px_60px_rgba(0,0,0,0.2)]"
            >
              <h2 className="text-2xl font-black mb-6 text-[#111]">New Folder</h2>
              <form onSubmit={handleFolderSubmit(onFolderSubmit)} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider ml-1 mb-1.5 block">Folder Name</label>
                  <input {...registerFolder("name", { required: true })} className={inputClass} placeholder="e.g. Design Systems" />
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider ml-1 mb-1.5 block">Description</label>
                  <input {...registerFolder("description")} className={inputClass} placeholder="Brief description..." />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={() => setIsFolderModalOpen(false)} className="px-5 py-2.5 rounded-xl font-bold text-neutral-600 hover:bg-neutral-100 transition-colors">Cancel</button>
                  <button type="submit" disabled={isSubmittingFolder} className="px-5 py-2.5 bg-[#111] hover:bg-black text-white font-bold rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50">Create</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {isItemModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white/90 backdrop-blur-2xl border border-white rounded-[2rem] p-6 md:p-8 w-full max-w-md shadow-[0_20px_60px_rgba(0,0,0,0.2)]"
            >
              <h2 className="text-2xl font-black mb-6 text-[#111]">Add Resource</h2>
              <form onSubmit={handleItemSubmit(onItemSubmit)} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider ml-1 mb-1.5 block">Title</label>
                  <input {...registerItem("title", { required: true })} className={inputClass} placeholder="e.g. React Docs" />
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider ml-1 mb-1.5 block">Tech Stack (CSV)</label>
                  <input {...registerItem("techStack")} className={inputClass} placeholder="React, TS" />
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider ml-1 mb-1.5 block">URL</label>
                  <input type="url" {...registerItem("url", { required: true })} className={inputClass} placeholder="https://..." />
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider ml-1 mb-1.5 block">Description</label>
                  <textarea {...registerItem("description", { required: true })} rows={3} className={inputClass} placeholder="Brief description..." />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={() => setIsItemModalOpen(false)} className="px-5 py-2.5 rounded-xl font-bold text-neutral-600 hover:bg-neutral-100 transition-colors">Cancel</button>
                  <button type="submit" disabled={isSubmittingItem} className="px-5 py-2.5 bg-[#111] hover:bg-black text-white font-bold rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50">Add Resource</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default withRoleGuard(AdminResourcesPage, ["admin", "core-team"]);
