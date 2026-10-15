"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Plus,
  Star,
  CheckCircle,
  AlertCircle,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  RefreshCw,
  Search,
  X,
  User,
  Upload,
} from "lucide-react";
import { uploadAdminImage } from "@/lib/imageUpload";

export interface CustomerReview {
  id: string;
  customer_name: string;
  customer_image?: string | null;
  rating: number;
  review_text: string;
  designation?: string | null;
  is_published: boolean;
  review_date: string;
  display_order: number;
  created_at: string;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "published" | "unpublished">("all");
  const [showModal, setShowModal] = useState(false);
  const [editingReview, setEditingReview] = useState<CustomerReview | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Form state
  const [formName, setFormName] = useState("");
  const [formRating, setFormRating] = useState(5);
  const [formText, setFormText] = useState("");
  const [formDesignation, setFormDesignation] = useState("");
  const [formImage, setFormImage] = useState("");
  const [formDate, setFormDate] = useState(new Date().toISOString().split("T")[0]);
  const [formOrder, setFormOrder] = useState(0);
  const [formPublished, setFormPublished] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/reviews?all=true");
      const json = await res.json();
      if (json.reviews) {
        setReviews(json.reviews);
      }
    } catch (err) {
      console.error("Failed to load reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleOpenAddModal = () => {
    setEditingReview(null);
    setFormName("");
    setFormRating(5);
    setFormText("");
    setFormDesignation("Devotee, Chennai");
    setFormImage("");
    setFormDate(new Date().toISOString().split("T")[0]);
    setFormOrder(reviews.length);
    setFormPublished(true);
    setFormError(null);
    setShowModal(true);
  };

  const handleOpenEditModal = (review: CustomerReview) => {
    setEditingReview(review);
    setFormName(review.customer_name);
    setFormRating(review.rating);
    setFormText(review.review_text);
    setFormDesignation(review.designation || "");
    setFormImage(review.customer_image || "");
    setFormDate(review.review_date || new Date().toISOString().split("T")[0]);
    setFormOrder(review.display_order || 0);
    setFormPublished(review.is_published);
    setFormError(null);
    setShowModal(true);
  };

  const handleTogglePublish = async (review: CustomerReview) => {
    try {
      const res = await fetch(`/api/reviews/${review.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_published: !review.is_published }),
      });
      if (res.ok) {
        setReviews((prev) =>
          prev.map((r) => (r.id === review.id ? { ...r, is_published: !r.is_published } : r))
        );
      }
    } catch (err) {
      console.error("Failed to toggle publish status:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/reviews/${id}`, { method: "DELETE" });
      if (res.ok) {
        setReviews((prev) => prev.filter((r) => r.id !== id));
        setDeleteConfirm(null);
        setMessage({ text: "Review deleted successfully", type: "success" });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (err) {
      console.error("Failed to delete review:", err);
    }
  };

  const handleImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const url = await uploadAdminImage(file);
      setFormImage(url);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Image upload failed");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formName.trim()) {
      setFormError("Please enter the customer name");
      return;
    }
    if (!formText.trim()) {
      setFormError("Please enter the review text");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        customer_name: formName.trim(),
        customer_image: formImage.trim() || null,
        rating: formRating,
        review_text: formText.trim(),
        designation: formDesignation.trim() || null,
        is_published: formPublished,
        review_date: formDate,
        display_order: formOrder,
      };

      let res: Response;
      if (editingReview) {
        res = await fetch(`/api/reviews/${editingReview.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/reviews", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const json = await res.json();
        setFormError(json.error || "Failed to save review");
        return;
      }

      setMessage({
        text: `✓ Review ${editingReview ? "updated" : "added"} successfully!`,
        type: "success",
      });
      setTimeout(() => setMessage(null), 3000);
      setShowModal(false);
      loadReviews();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to save review");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredReviews = reviews.filter((r) => {
    const matchesSearch =
      r.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      r.review_text.toLowerCase().includes(search.toLowerCase()) ||
      (r.designation && r.designation.toLowerCase().includes(search.toLowerCase()));
    const matchesFilter =
      filter === "all" ? true : filter === "published" ? r.is_published : !r.is_published;
    return matchesSearch && matchesFilter;
  });

  const publishedCount = reviews.filter((r) => r.is_published).length;
  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : "5.0";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#c9a227]">
            Customer Testimonials
          </span>
          <h1 className="text-3xl md:text-4xl font-serif font-medium uppercase tracking-tight text-white mt-0.5">
            Customer Reviews
          </h1>
          <p className="text-zinc-400 mt-1 text-sm">
            Manage genuine devotee testimonials displayed on the homepage carousel and public reviews page
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center justify-center gap-2 bg-[#c9a227] text-black font-black uppercase tracking-widest text-xs px-5 py-3 rounded-xl hover:brightness-110 transition-all shadow-md shadow-[#c9a227]/20"
        >
          <Plus className="w-4 h-4" />
          Add Customer Review
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
              Total Reviews
            </span>
            <MessageSquare className="w-4 h-4 text-[#c9a227]" />
          </div>
          <p className="text-3xl font-black text-white">{reviews.length}</p>
          <span className="text-[10px] text-zinc-500 mt-1 block">Customer testimonials in database</span>
        </div>

        <div className="bg-[#070707] border border-white/5 rounded-2xl p-5">
          <div className="flex items-start justify-between mb-3">
            <span className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">
              Published on Store
            </span>
            <Eye className="w-4 h-4 text-green-400" />
          </div>
          <p className="text-3xl font-black text-white">{publishedCount}</p>
          <span className="text-[10px] text-zinc-500 mt-1 block">Visible on homepage and reviews page</span>
        </div>

        <div className="bg-[#070707] border border-white/5 rounded-2xl p-5">
          <div className="flex items-start justify-between mb-3">
            <span className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">
              Average Rating
            </span>
            <Star className="w-4 h-4 text-[#c9a227] fill-[#c9a227]" />
          </div>
          <p className="text-3xl font-black text-white">{avgRating} / 5.0</p>
          <span className="text-[10px] text-zinc-500 mt-1 block">Based on genuine reviews</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by customer name, city, or review text..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-black border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-zinc-600 focus:border-[#c9a227] focus:outline-none transition-colors"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "published", "unpublished"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                filter === tab
                  ? "bg-[#c9a227] text-black shadow-md shadow-[#c9a227]/20"
                  : "bg-[#070707] border border-white/5 text-zinc-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews Table */}
      {loading ? (
        <div className="flex items-center justify-center py-24 text-zinc-500">
          <RefreshCw className="w-6 h-6 animate-spin text-[#c9a227]" />
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="bg-[#070707] border border-white/5 rounded-2xl p-12 text-center">
          <MessageSquare className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
          <h3 className="text-white font-serif text-lg">No reviews found</h3>
          <p className="text-zinc-500 text-xs mt-1 max-w-sm mx-auto">
            Add genuine customer feedback to highlight the quality of your devotional prints.
          </p>
          <button
            onClick={handleOpenAddModal}
            className="mt-5 inline-flex items-center gap-2 bg-[#c9a227] text-black font-black uppercase tracking-widest text-xs px-5 py-2.5 rounded-xl hover:brightness-110"
          >
            <Plus className="w-4 h-4" /> Add Review
          </button>
        </div>
      ) : (
        <div className="bg-[#070707] border border-white/5 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-white/5 text-[10px] uppercase tracking-wider text-zinc-400 font-bold bg-white/[0.01]">
                <tr>
                  <th className="px-5 py-4">Customer</th>
                  <th className="px-5 py-4">Rating</th>
                  <th className="px-5 py-4">Review Content</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4 text-center">Status</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredReviews.map((review) => (
                  <tr key={review.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-zinc-800 border border-white/10 overflow-hidden flex items-center justify-center flex-shrink-0">
                          {review.customer_image ? (
                            <img
                              src={review.customer_image}
                              alt={review.customer_name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <User className="h-4 w-4 text-zinc-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{review.customer_name}</p>
                          {review.designation && (
                            <p className="text-xs text-zinc-500">{review.designation}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1 text-[#c9a227]">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < review.rating ? "fill-[#c9a227]" : "text-zinc-700"
                            }`}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-4 max-w-md">
                      <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed">
                        &ldquo;{review.review_text}&rdquo;
                      </p>
                    </td>
                    <td className="px-5 py-4 text-xs text-zinc-500 whitespace-nowrap">
                      {review.review_date}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <button
                        onClick={() => handleTogglePublish(review)}
                        title={review.is_published ? "Click to Unpublish" : "Click to Publish"}
                        className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider"
                      >
                        {review.is_published ? (
                          <span className="inline-flex items-center gap-1 text-green-400 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-full">
                            <Eye className="w-3 h-3" /> Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-zinc-500 bg-zinc-800 border border-zinc-700 px-2.5 py-1 rounded-full">
                            <EyeOff className="w-3 h-3" /> Hidden
                          </span>
                        )}
                      </button>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEditModal(review)}
                          className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                          title="Edit Review"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {deleteConfirm === review.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDelete(review.id)}
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
                            onClick={() => setDeleteConfirm(review.id)}
                            className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                            title="Delete Review"
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

      {/* Add / Edit Review Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-xl bg-[#0a0a0a] border border-[#c9a227]/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl my-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#c9a227]/10 border border-[#c9a227]/30 flex items-center justify-center text-[#c9a227]">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-serif font-bold uppercase tracking-wider text-white">
                      {editingReview ? "Edit Customer Review" : "Add Customer Review"}
                    </h2>
                    <p className="text-xs text-zinc-400">
                      Configure testimonial content, star rating, and customer details
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 text-zinc-400 hover:text-white rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {formError && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {formError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">
                      Customer Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. S. Ramanathan"
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#c9a227] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">
                      City / Designation (optional)
                    </label>
                    <input
                      type="text"
                      value={formDesignation}
                      onChange={(e) => setFormDesignation(e.target.value)}
                      placeholder="e.g. Temple Art Collector, Madurai"
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#c9a227] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Rating Selector */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">
                    Rating (1 to 5 Stars)
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= formRating
                              ? "fill-[#c9a227] text-[#c9a227]"
                              : "text-zinc-700"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-white ml-2">{formRating} out of 5</span>
                  </div>
                </div>

                {/* Review Text */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">
                    Customer Testimonial Content *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formText}
                    onChange={(e) => setFormText(e.target.value)}
                    placeholder="Describe customer's experience with the devotional prints, framing quality, packaging, and pooja room placement..."
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#c9a227] focus:outline-none resize-none leading-relaxed"
                  />
                </div>

                {/* Review Date & Display Order */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">
                      Review Date
                    </label>
                    <input
                      type="date"
                      value={formDate}
                      onChange={(e) => setFormDate(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#c9a227] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">
                      Display Priority Order
                    </label>
                    <input
                      type="number"
                      value={formOrder}
                      onChange={(e) => setFormOrder(parseInt(e.target.value, 10) || 0)}
                      placeholder="0 (lower appears first)"
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#c9a227] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Image Upload / URL */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">
                    Customer Avatar / Photo (optional)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formImage}
                      onChange={(e) => setFormImage(e.target.value)}
                      placeholder="Paste avatar URL or upload..."
                      className="flex-1 bg-black border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#c9a227] focus:outline-none"
                    />
                    <label className="flex items-center gap-1.5 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-zinc-300 hover:bg-white/10 cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingImage ? "Uploading..." : "Upload"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFile}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Published Toggle */}
                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="formPublished"
                    checked={formPublished}
                    onChange={(e) => setFormPublished(e.target.checked)}
                    className="w-5 h-5 rounded border-white/10 bg-black text-[#c9a227] focus:ring-[#c9a227]"
                  />
                  <label htmlFor="formPublished" className="text-xs text-zinc-300 font-semibold cursor-pointer">
                    Publish this review immediately on storefront
                  </label>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-white/5">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-[#c9a227] text-black font-black uppercase tracking-widest text-xs py-3.5 rounded-xl hover:brightness-110 disabled:opacity-50 transition-all shadow-md shadow-[#c9a227]/20"
                  >
                    {submitting ? "Saving..." : editingReview ? "Update Review" : "Publish Review"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-3.5 border border-white/10 rounded-xl text-zinc-400 hover:text-white text-xs font-bold uppercase tracking-wider"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
