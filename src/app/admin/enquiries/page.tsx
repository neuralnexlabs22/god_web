"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Search,
  CheckCircle,
  AlertCircle,
  Trash2,
  Eye,
  RefreshCw,
  Phone,
  Clock,
  Calendar,
  X,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { CustomEnquiry } from "@/app/api/enquiries/route";

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<CustomEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedEnquiry, setSelectedEnquiry] = useState<CustomEnquiry | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const loadEnquiries = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/enquiries");
      const json = await res.json();
      if (json.enquiries) {
        setEnquiries(json.enquiries);
      }
    } catch (err) {
      console.error("Failed to load enquiries:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiries();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/enquiries/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setEnquiries((prev) =>
          prev.map((e) => (e.id === id ? { ...e, status: newStatus as any } : e))
        );
        if (selectedEnquiry && selectedEnquiry.id === id) {
          setSelectedEnquiry((prev) => (prev ? { ...prev, status: newStatus as any } : null));
        }
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/enquiries/${id}`, { method: "DELETE" });
      if (res.ok) {
        setEnquiries((prev) => prev.filter((e) => e.id !== id));
        setDeleteConfirm(null);
        if (selectedEnquiry?.id === id) setSelectedEnquiry(null);
        setMessage({ text: "Enquiry deleted successfully", type: "success" });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (err) {
      console.error("Failed to delete enquiry:", err);
    }
  };

  const handleOpenWhatsApp = (enquiry: CustomEnquiry) => {
    const cleanPhone = enquiry.phone.replace(/[^0-9]/g, "");
    const msg = `Namaste ${enquiry.customer_name}! 🕉️ Thank you for your custom devotional enquiry regarding "${enquiry.requested_deity}" on Frames of Divine. We would be delighted to assist you with framing, sizing, and pricing details.`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const filteredEnquiries = enquiries.filter((e) => {
    const matchesSearch =
      e.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      e.requested_deity.toLowerCase().includes(search.toLowerCase()) ||
      e.phone.toLowerCase().includes(search.toLowerCase()) ||
      (e.dimensions && e.dimensions.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === "all" ? true : e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const newCount = enquiries.filter((e) => e.status === "new").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#c9a227]">
            Custom Devotional Commissions
          </span>
          <h1 className="text-3xl md:text-4xl font-serif font-medium uppercase tracking-tight text-white mt-0.5">
            Custom Photo Enquiries
          </h1>
          <p className="text-zinc-400 mt-1 text-sm">
            Manage bespoke deity requests, custom pooja room dimensions, and direct WhatsApp customer discussions
          </p>
        </div>
        <button
          onClick={loadEnquiries}
          disabled={loading}
          className="flex items-center justify-center gap-2 border border-white/10 hover:border-[#c9a227]/40 text-white font-bold uppercase tracking-wider text-xs px-4 py-2.5 rounded-xl transition-all"
        >
          <RefreshCw className={`w-4 h-4 text-[#c9a227] ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Global Message Banner */}
      {message && (
        <div
          className={`flex items-center gap-3 p-4 rounded-xl text-sm font-semibold border ${
            message.type === "success"
              ? "bg-green-500/10 border-green-500/30 text-green-400"
              : "bg-red-500/10 border-red-500/30 text-red-400"
          }`}
        >
          {message.type === "success" ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {message.text}
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#070707] border border-[#c9a227]/20 rounded-2xl p-5">
          <div className="flex items-start justify-between mb-3">
            <span className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">
              Total Enquiries
            </span>
            <MessageSquare className="w-4 h-4 text-[#c9a227]" />
          </div>
          <p className="text-3xl font-black text-white">{enquiries.length}</p>
          <span className="text-[10px] text-zinc-500 mt-1 block">Custom devotional requests</span>
        </div>

        <div className="bg-[#070707] border border-white/5 rounded-2xl p-5">
          <div className="flex items-start justify-between mb-3">
            <span className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">
              New Unhandled
            </span>
            <Sparkles className="w-4 h-4 text-yellow-400" />
          </div>
          <p className="text-3xl font-black text-yellow-400">{newCount}</p>
          <span className="text-[10px] text-zinc-500 mt-1 block">Awaiting curator response</span>
        </div>

        <div className="bg-[#070707] border border-white/5 rounded-2xl p-5">
          <div className="flex items-start justify-between mb-3">
            <span className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">
              In Discussion / Active
            </span>
            <CheckCircle className="w-4 h-4 text-green-400" />
          </div>
          <p className="text-3xl font-black text-white">
            {enquiries.filter((e) => e.status === "in_progress" || e.status === "contacted").length}
          </p>
          <span className="text-[10px] text-zinc-500 mt-1 block">Active customer discussions</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by deity name, customer, phone number, or size..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-black border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-zinc-600 focus:border-[#c9a227] focus:outline-none transition-colors"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(["all", "new", "contacted", "in_progress", "completed"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                statusFilter === tab
                  ? "bg-[#c9a227] text-black shadow-md shadow-[#c9a227]/20"
                  : "bg-[#070707] border border-white/5 text-zinc-400 hover:text-white"
              }`}
            >
              {tab.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Table of Enquiries */}
      {loading ? (
        <div className="flex items-center justify-center py-24 text-zinc-500">
          <RefreshCw className="w-6 h-6 animate-spin text-[#c9a227]" />
        </div>
      ) : filteredEnquiries.length === 0 ? (
        <div className="bg-[#070707] border border-white/5 rounded-2xl p-12 text-center text-zinc-500">
          <MessageSquare className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
          <p className="text-sm">No custom devotional photo enquiries found.</p>
          <p className="text-xs text-zinc-600 mt-1">Customer submissions from the website will appear here in real time.</p>
        </div>
      ) : (
        <div className="bg-[#070707] border border-white/5 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-white/5 text-[10px] uppercase tracking-wider text-zinc-400 font-bold bg-white/[0.01]">
                <tr>
                  <th className="px-5 py-4">Customer Details</th>
                  <th className="px-5 py-4">Requested Deity / Theme</th>
                  <th className="px-5 py-4">Size & Framing</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4 text-center">Status</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredEnquiries.map((enquiry) => (
                  <tr key={enquiry.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-white">{enquiry.customer_name}</p>
                      <p className="text-xs text-[#c9a227] font-mono mt-0.5">{enquiry.phone}</p>
                      {enquiry.email && <p className="text-[11px] text-zinc-500">{enquiry.email}</p>}
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-white max-w-[220px]">{enquiry.requested_deity}</p>
                      {enquiry.customization_details && (
                        <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5">
                          {enquiry.customization_details}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-4 text-xs text-zinc-300">
                      <span className="font-semibold text-white block">{enquiry.dimensions}</span>
                      <span className="text-[11px] text-zinc-500">{enquiry.frame_preference}</span>
                    </td>
                    <td className="px-5 py-4 text-xs text-zinc-500 whitespace-nowrap">
                      {new Date(enquiry.created_at).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <select
                        value={enquiry.status}
                        onChange={(e) => handleUpdateStatus(enquiry.id, e.target.value)}
                        className={`text-[10px] font-bold uppercase tracking-wider rounded-lg px-2.5 py-1 border outline-none cursor-pointer ${
                          enquiry.status === "new"
                            ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-400"
                            : enquiry.status === "contacted"
                            ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
                            : enquiry.status === "in_progress"
                            ? "bg-purple-500/10 border-purple-500/30 text-purple-400"
                            : "bg-green-500/10 border-green-500/30 text-green-400"
                        }`}
                      >
                        <option value="new" className="bg-black text-yellow-400">NEW</option>
                        <option value="contacted" className="bg-black text-blue-400">CONTACTED</option>
                        <option value="in_progress" className="bg-black text-purple-400">IN PROGRESS</option>
                        <option value="completed" className="bg-black text-green-400">COMPLETED</option>
                      </select>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenWhatsApp(enquiry)}
                          className="p-2 text-green-400 hover:bg-green-500/10 rounded-xl transition-all"
                          title="Reply via WhatsApp"
                        >
                          <Phone className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setSelectedEnquiry(enquiry)}
                          className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {deleteConfirm === enquiry.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDelete(enquiry.id)}
                              className="px-2.5 py-1 text-xs font-bold bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="px-2.5 py-1 text-xs font-bold bg-white/5 text-zinc-400 hover:bg-white/10 rounded-lg"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(enquiry.id)}
                            className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                            title="Delete Enquiry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Enquiry Details Modal */}
      <AnimatePresence>
        {selectedEnquiry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-[#0a0a0a] border border-[#c9a227]/30 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl text-white max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#c9a227] font-bold">
                    Reference: {selectedEnquiry.id}
                  </span>
                  <h3 className="text-xl font-serif font-bold text-white mt-0.5">
                    {selectedEnquiry.requested_deity}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedEnquiry(null)}
                  className="p-2 text-zinc-400 hover:text-white rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3 bg-white/[0.02] border border-white/5 rounded-2xl p-4">
                  <div>
                    <span className="text-zinc-500 block text-[10px] uppercase">Customer Name</span>
                    <span className="text-white font-semibold text-sm">{selectedEnquiry.customer_name}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px] uppercase">Phone / WhatsApp</span>
                    <span className="text-[#c9a227] font-mono font-semibold">{selectedEnquiry.phone}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px] uppercase">Desired Dimensions</span>
                    <span className="text-zinc-300 font-semibold">{selectedEnquiry.dimensions}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px] uppercase">Framing Preference</span>
                    <span className="text-zinc-300 font-semibold">{selectedEnquiry.frame_preference}</span>
                  </div>
                </div>

                {selectedEnquiry.customization_details && (
                  <div className="space-y-1">
                    <span className="text-zinc-500 text-[10px] uppercase tracking-wider font-bold">
                      Customization Notes
                    </span>
                    <p className="text-zinc-300 bg-black border border-white/5 p-3 rounded-xl leading-relaxed">
                      {selectedEnquiry.customization_details}
                    </p>
                  </div>
                )}

                {selectedEnquiry.reference_image && (
                  <div className="space-y-1.5">
                    <span className="text-zinc-500 text-[10px] uppercase tracking-wider font-bold">
                      Reference Image
                    </span>
                    <div className="relative h-44 rounded-xl overflow-hidden border border-white/10 bg-black">
                      <img
                        src={selectedEnquiry.reference_image}
                        alt="Reference"
                        className="h-full w-full object-contain"
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-zinc-500 pt-2 text-[11px]">
                  <span>Received on {new Date(selectedEnquiry.created_at).toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-3 border-t border-white/5">
                <button
                  onClick={() => handleOpenWhatsApp(selectedEnquiry)}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 rounded-xl font-bold uppercase tracking-wider text-xs hover:brightness-110"
                >
                  <Phone className="w-4 h-4" /> Reply on WhatsApp
                </button>
                <button
                  onClick={() => setSelectedEnquiry(null)}
                  className="px-5 py-3 border border-white/10 rounded-xl text-zinc-400 hover:text-white text-xs font-bold uppercase tracking-wider"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
