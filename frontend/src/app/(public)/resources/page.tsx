"use client";

import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store/auth.store";
import { resourcesApi, ResourceFolder, ResourceItem } from "@/lib/api/resources";
import { Lock, FolderOpen, ArrowLeft, ExternalLink, Code, User, ChevronRight, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, stiffness: 200, damping: 20 } },
};

// CSS classes for our skeumorphic glass panels
const skeumorphicGlass = "relative overflow-hidden rounded-[2rem] border border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 backdrop-blur-2xl shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_10px_20px_rgba(0,0,0,0.15)] dark:shadow-[inset_0_2px_4px_rgba(255,255,255,0.1),0_10px_20px_rgba(0,0,0,0.3)] transition-colors duration-300";

const colors = ["text-blue-500", "text-emerald-500", "text-orange-500", "text-pink-500", "text-indigo-500", "text-purple-500"];

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
          className="max-w-md w-full p-8 rounded-3xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 backdrop-blur-2xl text-center shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_15px_30px_rgba(0,0,0,0.15)] dark:shadow-[inset_0_2px_4px_rgba(255,255,255,0.1),0_15px_30px_rgba(0,0,0,0.3)]"
        >
          <div className="w-20 h-20 bg-blue-500/10 rounded-[2rem] shadow-[inset_0_2px_4px_rgba(255,255,255,0.8)] dark:shadow-[inset_0_2px_4px_rgba(255,255,255,0.1)] flex items-center justify-center mx-auto mb-6">
            <Lock size={40} className="text-blue-500" />
          </div>
          <h2 className="text-3xl font-bold mb-4 text-[var(--text-primary)]">Members Only</h2>
          <p className="text-[var(--text-muted)] mb-8">
            The resources library contains exclusive materials, roadmaps, and guides. Please log in to access this section.
          </p>
          <Link href="/login" className="inline-block w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-[inset_0_1px_2px_rgba(255,255,255,0.4),0_8px_16px_rgba(37,99,235,0.4)] transition-all active:scale-95 active:shadow-inner">
            Log In to Access
          </Link>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-32 pb-20 px-6 max-w-6xl mx-auto">
      <div className="mb-12 text-center md:text-left pl-4">
        <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tight text-[var(--text-primary)]">Resource Library</h1>
        <p className="text-[var(--text-muted)] text-lg md:text-xl max-w-2xl">
          Curated guides, links, and roadmaps to supercharge your learning journey.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!selectedFolder ? (
          <motion.div 
            key="folders"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
          >
            {folders.map((folder, index) => {
              const colorClass = colors[index % colors.length];
              
              return (
                <motion.div 
                  key={folder.id}
                  variants={itemVariants}
                  whileHover={{ scale: 0.98, transition: { type: "spring", stiffness: 400, damping: 15 } }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => handleFolderClick(folder)}
                  className={`group cursor-pointer ${skeumorphicGlass} hover:bg-white/10 dark:hover:bg-white/10 h-full flex flex-col`}
                >
                  <div className="flex flex-col justify-between p-6 md:p-8 flex-1 gap-6">
                    <div className="flex justify-between items-start w-full">
                      <div className={`p-4 rounded-2xl bg-white/50 dark:bg-black/30 backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_4px_8px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_4px_8px_rgba(0,0,0,0.3)] transition-transform duration-300 group-hover:scale-110 ${colorClass}`}>
                        <FolderOpen size={32} strokeWidth={2.5} />
                      </div>
                      
                      <div className="opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                        <div className={`p-2 rounded-full bg-white/50 dark:bg-black/30 backdrop-blur-md shadow-sm ${colorClass}`}>
                          <ChevronRight size={20} strokeWidth={3} />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <h3 className="text-2xl md:text-3xl font-bold tracking-wide text-[var(--text-primary)] leading-tight">
                        {folder.name}
                      </h3>
                      {folder.description && (
                        <p className="text-[var(--text-muted)] text-sm md:text-base leading-relaxed">
                          {folder.description}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
            {folders.length === 0 && (
              <div className="col-span-12 py-20 text-center text-[var(--text-muted)]">
                No resource folders available yet.
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="items"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 200, damping: 20 } }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <button 
              onClick={() => setSelectedFolder(null)}
              className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] mb-8 transition-colors p-3 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5"
            >
              <ArrowLeft size={20} /> Back to Folders
            </button>
            
            <div className={`p-8 mb-8 ${skeumorphicGlass} bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20`}>
              <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-4 text-[var(--text-primary)]">
                <div className="p-3 bg-blue-500/20 rounded-2xl text-blue-500 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]">
                  <FolderOpen size={32} />
                </div>
                {selectedFolder.name}
              </h2>
              {selectedFolder.description && (
                <p className="mt-4 text-[var(--text-muted)] text-lg max-w-3xl ml-16">
                  {selectedFolder.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-12 auto-rows-min gap-4 md:gap-6">
              <AnimatePresence>
                {items.map((item, idx) => {
                  const isSelected = selectedItem?.id === item.id;
                  const colorClass = colors[idx % colors.length];
                  
                  return (
                    <motion.div 
                      key={item.id}
                      layout
                      onClick={() => setSelectedItem(isSelected ? null : item)}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25, delay: idx * 0.05 }}
                      className={`col-span-12 cursor-pointer ${skeumorphicGlass} ${isSelected ? 'bg-white/10 dark:bg-white/10 ring-2 ring-blue-500/50' : 'hover:bg-white/5 dark:hover:bg-white/5'}`}
                    >
                      <div className="p-6 md:p-8">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex items-start gap-4 flex-1">
                            <div className={`p-3 rounded-2xl bg-white/50 dark:bg-black/30 backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_4px_8px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_4px_8px_rgba(0,0,0,0.3)] transition-transform duration-300 ${isSelected ? 'scale-110' : ''} ${colorClass}`}>
                              <BookOpen size={24} />
                            </div>
                            <div>
                              <h3 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--text-primary)]">{item.title}</h3>
                              {!isSelected && item.description && (
                                <p className="text-[var(--text-muted)] line-clamp-1 mt-1 text-sm">{item.description}</p>
                              )}
                            </div>
                          </div>
                          <a 
                            href={item.url} 
                            target="_blank" 
                            rel="noreferrer" 
                            onClick={(e) => e.stopPropagation()}
                            className="p-3 bg-[var(--text-primary)] text-[var(--background)] rounded-2xl hover:scale-105 transition-all shadow-[inset_0_1px_2px_rgba(255,255,255,0.4),0_8px_16px_rgba(0,0,0,0.2)] active:scale-95"
                          >
                            <ExternalLink size={20} />
                          </a>
                        </div>
                        
                        <AnimatePresence>
                          {isSelected && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="pt-6 mt-6 border-t border-black/10 dark:border-white/10 space-y-6 pl-14">
                                <p className="text-[var(--text-muted)] leading-relaxed text-lg">
                                  {item.description || "No description provided."}
                                </p>
                                
                                {item.techStack && item.techStack.length > 0 && (
                                  <div>
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-3 flex items-center gap-2">
                                      <Code size={14} /> Tech Stack Addressed
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                      {item.techStack.map(tech => (
                                        <span key={tech} className="px-4 py-2 bg-black/5 dark:bg-white/5 backdrop-blur-md rounded-xl text-sm font-semibold border border-black/10 dark:border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
                                          {tech}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {item.publishedBy && (
                                  <div className="flex items-center gap-3 pt-4">
                                    <div className="p-2 bg-black/10 dark:bg-white/10 backdrop-blur-md rounded-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
                                      <User size={16} />
                                    </div>
                                    <div>
                                      <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-semibold">Published by</p>
                                      <p className="font-bold">{item.publishedBy.name}</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              {items.length === 0 && (
                <div className="col-span-12 py-20 text-center text-[var(--text-muted)] border-2 border-dashed border-black/10 dark:border-white/10 rounded-[3rem] bg-black/5 dark:bg-white/5">
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
