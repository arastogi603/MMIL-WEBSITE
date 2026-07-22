"use client";

import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store/auth.store";
import { resourcesApi, ResourceFolder, ResourceItem } from "@/lib/api/resources";
import { Lock, FolderOpen, ArrowLeft, ExternalLink, Code, User, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function ResourcesPage() {
  const { isAuthenticated } = useAuthStore();
  const [isHydrated, setIsHydrated] = useState(false);
  const [folders, setFolders] = useState<ResourceFolder[]>([]);
  const [items, setItems] = useState<ResourceItem[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<ResourceFolder | null>(null);
  const [selectedItem, setSelectedItem] = useState<ResourceItem | null>(null);

  useEffect(() => {
    setIsHydrated(true);
    if (isAuthenticated) {
      resourcesApi.getAllFolders().then(setFolders);
    }
  }, [isAuthenticated]);

  const handleFolderClick = async (folder: ResourceFolder) => {
    setSelectedFolder(folder);
    const data = await resourcesApi.getItemsByFolder(folder.id);
    setItems(data);
  };

  if (!isHydrated) return null;

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 bg-[var(--background)]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full p-8 rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] backdrop-blur-2xl text-center shadow-xl"
        >
          <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock size={40} className="text-blue-500" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Members Only</h2>
          <p className="text-[var(--text-muted)] mb-8">
            The resources library contains exclusive materials, roadmaps, and guides. Please log in to access this section.
          </p>
          <Link href="/login" className="inline-block w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors">
            Log In to Access
          </Link>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="mb-12">
        <h1 className="text-5xl font-black mb-4">Resource Library</h1>
        <p className="text-[var(--text-muted)] text-lg">
          Curated guides, links, and roadmaps to supercharge your learning journey.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!selectedFolder ? (
          <motion.div 
            key="folders"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {folders.map(folder => (
              <div 
                key={folder.id}
                onClick={() => handleFolderClick(folder)}
                className="group cursor-pointer p-6 rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] backdrop-blur-xl hover:bg-blue-500/5 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-4 bg-blue-500/10 rounded-2xl text-blue-500 group-hover:scale-110 transition-transform duration-300">
                    <FolderOpen size={32} strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{folder.name}</h3>
                  </div>
                </div>
                <p className="text-[var(--text-muted)]">{folder.description || "Explore resources inside this folder."}</p>
                <div className="mt-6 flex items-center text-blue-500 font-semibold text-sm">
                  Open Folder <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
            {folders.length === 0 && (
              <div className="col-span-full py-20 text-center text-[var(--text-muted)]">
                No resource folders available yet.
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="items"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <button 
              onClick={() => setSelectedFolder(null)}
              className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] mb-8 transition-colors"
            >
              <ArrowLeft size={20} /> Back to Folders
            </button>
            
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <FolderOpen className="text-blue-500" /> {selectedFolder.name}
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {items.map(item => (
                <div 
                  key={item.id}
                  onClick={() => setSelectedItem(selectedItem?.id === item.id ? null : item)}
                  className={`cursor-pointer rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] backdrop-blur-xl transition-all duration-500 overflow-hidden ${selectedItem?.id === item.id ? 'ring-2 ring-blue-500' : 'hover:border-blue-500/30'}`}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-bold flex-1 pr-4">{item.title}</h3>
                      <a 
                        href={item.url} 
                        target="_blank" 
                        rel="noreferrer" 
                        onClick={(e) => e.stopPropagation()}
                        className="p-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors shadow-md"
                      >
                        <ExternalLink size={18} />
                      </a>
                    </div>
                    
                    {/* Collapsible Details */}
                    <AnimatePresence>
                      {selectedItem?.id === item.id && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-6 mt-4 border-t border-[var(--card-border)] space-y-6">
                            <p className="text-[var(--text-muted)] leading-relaxed">
                              {item.description || "No description provided."}
                            </p>
                            
                            {item.techStack && item.techStack.length > 0 && (
                              <div>
                                <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-2">
                                  <Code size={16} /> Tech Stack Addressed
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {item.techStack.map(tech => (
                                    <span key={tech} className="px-3 py-1.5 bg-blue-500/10 text-blue-500 font-medium rounded-lg text-sm border border-blue-500/20">
                                      {tech}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {item.publishedBy && (
                              <div className="flex items-center gap-3 pt-4">
                                <div className="p-2 bg-[var(--foreground)] text-[var(--background)] rounded-full">
                                  <User size={16} />
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">Published by</p>
                                  <p className="font-semibold text-sm">{item.publishedBy.name}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  {/* Expand Hint */}
                  {selectedItem?.id !== item.id && (
                    <div className="px-6 pb-6 text-sm text-blue-500 font-medium text-center opacity-0 group-hover:opacity-100 transition-opacity">
                      Click to view details
                    </div>
                  )}
                </div>
              ))}
              {items.length === 0 && (
                <div className="col-span-full py-20 text-center text-[var(--text-muted)] border-2 border-dashed border-[var(--card-border)] rounded-3xl">
                  No resources found in this folder.
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
