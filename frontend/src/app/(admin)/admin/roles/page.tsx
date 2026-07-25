"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Shield, Search, RefreshCw, AlertCircle, Trash2, CheckCircle, XCircle, ChevronDown } from "lucide-react";
import { usersApi } from "@/lib/api/users";
import { useAuthStore } from "@/lib/store/auth.store";
import { CLUB_ROLES, isCoreTeam, isAdminRights, formatRoleName } from "@/lib/roles";

const GlassSelect = ({ value, onChange, options }: { value: string, onChange: (val: string) => void, options: {value: string, label: string}[] }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full min-w-[140px] px-4 py-2 rounded-xl bg-white/40 backdrop-blur-md border border-white/60 shadow-[0_4px_12px_rgba(0,0,0,0.05),inset_0_1px_1px_rgba(255,255,255,0.8)] text-sm font-bold text-[#111] hover:bg-white/60 transition-all"
      >
        <span className="truncate">{options.find(o => o.value === value)?.label || "Select..."}</span>
        <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-2 w-48 right-0 md:left-0 origin-top-right md:origin-top-left rounded-2xl bg-white/70 backdrop-blur-2xl border border-white shadow-[0_8px_32px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,1)] py-2 max-h-64 overflow-y-auto"
          >
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => { onChange(opt.value); setIsOpen(false); }}
                className={`w-full text-left px-4 py-2 text-sm font-bold transition-colors ${value === opt.value ? 'bg-[#111] text-white' : 'text-neutral-600 hover:bg-white/50 hover:text-[#111]'}`}
              >
                {opt.label}
              </button>
            ))}
          </motion.div>
        </>
      )}
    </div>
  );
};

export default function RolesManagementPage() {
  const [activeTab, setActiveTab] = useState<"directory" | "requests">("directory");
  const [users, setUsers] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { user: currentUser } = useAuthStore();

  const isAdmin = isAdminRights(currentUser?.role);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await usersApi.getAllUsers();
      setUsers(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load users.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRequests = async () => {
    if (!isAdmin) return;
    try {
      const data = await usersApi.getRemovalRequests();
      setRequests(data);
    } catch (err: any) {
      console.error("Failed to load requests", err);
    }
  };

  useEffect(() => {
    fetchUsers();
    if (isAdmin) {
      fetchRequests();
    }
  }, [isAdmin]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;
    try {
      await usersApi.updateUserRole(userId, newRole);
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update role");
    }
  };

  const handleRequestRemoval = async (userId: string) => {
    if (!confirm("Are you sure you want to request the removal of this student?")) return;
    try {
      await usersApi.requestRemoval(userId);
      alert("Removal request submitted for admin approval.");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to submit request.");
    }
  };

  const handleApproveRequest = async (requestId: string, targetUserId: string) => {
    if (!confirm("Approve removal? This will permanently delete the user.")) return;
    try {
      await usersApi.approveRemoval(requestId);
      setRequests(requests.filter(r => r.id !== requestId));
      setUsers(users.filter(u => u.id !== targetUserId));
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to approve request.");
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      await usersApi.rejectRemoval(requestId);
      setRequests(requests.filter(r => r.id !== requestId));
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to reject request.");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to instantly delete this user? This cannot be undone.")) return;
    try {
      await usersApi.deleteUser(userId);
      setUsers(users.filter(u => u.id !== userId));
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete user.");
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="font-['Outfit']">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-4xl font-black text-[#111] tracking-tight">Member Administration</motion.h1>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="text-neutral-500 font-medium mt-1">View and manage member roles across the platform.</motion.p>
        </div>
        <button 
          onClick={() => { fetchUsers(); if (isAdmin) fetchRequests(); }}
          className="p-3 rounded-xl bg-white/70 backdrop-blur-xl border border-black/5 text-neutral-500 hover:text-[#111] hover:bg-white transition-colors shadow-[0_4px_12px_rgba(0,0,0,0.04),inset_0_2px_4px_rgba(255,255,255,1)]"
        >
          <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {error && (
        <div className="mb-8 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center gap-3 font-medium">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-8">
        <div className="bg-white/70 backdrop-blur-xl p-5 md:p-6 rounded-[1.5rem] border border-white shadow-[0_8px_30px_rgba(0,0,0,0.04),inset_0_2px_4px_rgba(255,255,255,1)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-md">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-[#111]">{users.length}</h3>
            <p className="text-neutral-400 text-sm font-semibold">Total Members</p>
          </div>
        </div>
        
        <div className="bg-white/70 backdrop-blur-xl p-5 md:p-6 rounded-[1.5rem] border border-white shadow-[0_8px_30px_rgba(0,0,0,0.04),inset_0_2px_4px_rgba(255,255,255,1)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-400 flex items-center justify-center shadow-md">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-[#111]">{users.filter(u => isCoreTeam(u.role)).length}</h3>
            <p className="text-neutral-400 text-sm font-semibold">Core Team & Admins</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      {isAdmin && (
        <div className="flex gap-2 mb-6 p-1.5 bg-white/60 backdrop-blur-xl rounded-2xl border border-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.04)] w-fit">
          <button 
            onClick={() => setActiveTab("directory")}
            className={`px-5 py-2.5 font-bold rounded-xl text-sm transition-all ${activeTab === "directory" ? "bg-[#111] text-white shadow-[0_4px_15px_rgba(0,0,0,0.15)]" : "text-neutral-500 hover:text-[#111] hover:bg-black/5"}`}
          >
            Member Directory
          </button>
          <button 
            onClick={() => setActiveTab("requests")}
            className={`px-5 py-2.5 font-bold rounded-xl text-sm transition-all flex items-center gap-2 ${activeTab === "requests" ? "bg-[#111] text-white shadow-[0_4px_15px_rgba(0,0,0,0.15)]" : "text-neutral-500 hover:text-[#111] hover:bg-black/5"}`}
          >
            Removal Requests
            {requests.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
                {requests.length}
              </span>
            )}
          </button>
        </div>
      )}

      {activeTab === "directory" ? (
        <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] border border-white shadow-[0_8px_30px_rgba(0,0,0,0.04),inset_0_2px_4px_rgba(255,255,255,1)] overflow-hidden">
          <div className="p-5 md:p-6 border-b border-black/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <h2 className="text-lg font-black text-[#111]">Member Directory</h2>
            <div className="relative w-full md:w-auto">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input 
                type="text" 
                placeholder="Search by name or email..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-72 bg-[#faf7f3] border border-black/5 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-all text-[#111] placeholder:text-neutral-400 shadow-[inset_0_2px_4px_rgba(0,0,0,0.04)]"
              />
            </div>
          </div>

          {/* Mobile card layout */}
          <div className="md:hidden p-4 space-y-3">
            {isLoading && users.length === 0 ? (
              <p className="text-center py-8 text-neutral-400 font-medium">Loading members...</p>
            ) : filteredUsers.length === 0 ? (
              <p className="text-center py-8 text-neutral-400 font-medium">No members found.</p>
            ) : filteredUsers.map((u) => (
              <div key={u.id} className="p-4 rounded-2xl border border-black/5 bg-[#faf7f3] shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center font-bold text-sm text-white shadow-md">
                    {u.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#111] flex items-center gap-2 truncate">
                      {u.name}
                      {u.email === 'admin@mmil.com' && <Shield className="w-3 h-3 text-red-500 flex-shrink-0" />}
                    </p>
                    <p className="text-xs text-neutral-400 truncate">{u.email}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border flex-shrink-0 ${
                    isAdminRights(u.role) ? 'bg-red-100 text-red-600 border-red-200' 
                    : isCoreTeam(u.role) ? 'bg-purple-100 text-purple-600 border-purple-200'
                    : 'bg-blue-100 text-blue-600 border-blue-200'
                  }`}>
                    {formatRoleName(u.role).toUpperCase()}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {!isAdmin && u.role === 'student' && (
                    <button onClick={() => handleRequestRemoval(u.id)} className="px-3 py-1.5 rounded-lg bg-red-50 text-red-500 text-xs font-bold hover:bg-red-100 transition-colors flex items-center gap-1 border border-red-200">
                      <AlertCircle className="w-3 h-3" /> Request Removal
                    </button>
                  )}
                  {isAdmin && u.email !== 'admin@mmil.com' && (
                    <>
                      <GlassSelect 
                        value={u.role || 'student'}
                        onChange={(val) => handleRoleChange(u.id, val)}
                        options={[
                          { value: 'student', label: 'Student' },
                          ...CLUB_ROLES.map(r => ({ value: r, label: formatRoleName(r) }))
                        ]}
                      />
                      {u.role === 'student' && (
                        <button onClick={() => handleDeleteUser(u.id)} className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors border border-red-200" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <div className="overflow-x-auto hidden md:block min-h-[400px] pb-48">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-black/5 bg-[#faf7f3]/50 text-neutral-400 text-sm">
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Member</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Role</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Joined</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {isLoading && users.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-neutral-400 font-medium">Loading members...</td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-neutral-400 font-medium">No members found matching your search.</td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <motion.tr 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }}
                      key={u.id} 
                      className="hover:bg-[#faf7f3]/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center font-bold text-sm text-white shadow-md">
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-[#111] flex items-center gap-2">
                              {u.name}
                              {u.email === 'admin@mmil.com' && <Shield className="w-3 h-3 text-red-500" />}
                            </p>
                            <p className="text-xs text-neutral-400">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                          isAdminRights(u.role) ? 'bg-red-100 text-red-600 border-red-200' 
                          : isCoreTeam(u.role) ? 'bg-purple-100 text-purple-600 border-purple-200'
                          : 'bg-blue-100 text-blue-600 border-blue-200'
                        }`}>
                          {formatRoleName(u.role).toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-400 font-medium">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          
                          {/* Core Team Actions */}
                          {!isAdmin && u.role === 'student' && (
                            <button 
                              onClick={() => handleRequestRemoval(u.id)}
                              className="px-3 py-1.5 rounded-lg bg-red-50 text-red-500 text-xs font-bold hover:bg-red-100 transition-colors flex items-center gap-1 border border-red-200"
                            >
                              <AlertCircle className="w-3 h-3" /> Request Removal
                            </button>
                          )}

                          {/* Admin Actions */}
                          {isAdmin && u.email !== 'admin@mmil.com' && (
                            <>
                              <GlassSelect 
                                value={u.role || 'student'}
                                onChange={(val) => handleRoleChange(u.id, val)}
                                options={[
                                  { value: 'student', label: 'Student' },
                                  ...CLUB_ROLES.map(r => ({ value: r, label: formatRoleName(r) }))
                                ]}
                              />
                              {u.role === 'student' && (
                                <button 
                                  onClick={() => handleDeleteUser(u.id)}
                                  className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors border border-red-200"
                                  title="Delete Account"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] border border-white shadow-[0_8px_30px_rgba(0,0,0,0.04),inset_0_2px_4px_rgba(255,255,255,1)] overflow-hidden">
          <div className="p-5 md:p-6 border-b border-black/5">
            <h2 className="text-lg font-black text-[#111]">Pending Removal Requests</h2>
            <p className="text-sm text-neutral-400 font-medium mt-1">Core team members have requested the removal of these students.</p>
          </div>

          <div className="p-4 md:p-6">
            {requests.length === 0 ? (
              <div className="text-center py-12 text-neutral-400">
                <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-40" />
                <p className="font-medium">No pending removal requests. You're all caught up!</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {requests.map(req => (
                  <div key={req.id} className="p-5 rounded-2xl border border-black/5 bg-[#faf7f3] shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <p className="font-bold text-[#111]">Target: {req.targetUser.name} <span className="text-neutral-400 text-sm font-normal">({req.targetUser.email})</span></p>
                      <p className="text-sm text-neutral-500 mt-1 font-medium">Requested by: {req.requestedBy.name} on {new Date(req.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button 
                        onClick={() => handleRejectRequest(req.id)}
                        className="px-4 py-2.5 rounded-xl font-bold text-sm bg-neutral-100 text-neutral-500 hover:bg-neutral-200 transition-colors flex items-center gap-2 border border-black/5"
                      >
                        <XCircle className="w-4 h-4" /> Reject
                      </button>
                      <button 
                        onClick={() => handleApproveRequest(req.id, req.targetUser.id)}
                        className="px-4 py-2.5 rounded-xl font-bold text-sm bg-red-50 text-red-500 border border-red-200 hover:bg-red-100 transition-colors flex items-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" /> Approve & Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
