"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Star,
  Search,
  MessageSquare,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Plus,
  X,
  Sparkles,
  ArrowLeft,
  User,
} from "lucide-react";
import { CustomerReview } from "@/app/admin/reviews/page";

export default function PublicReviewsPage() {
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState<number | "all">("all");
  const [sortBy, setSortBy] = useState<"recent" | "highest">("recent");
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Submission form state
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReviews() {
      try {
        setLoading(true);
        const res = await fetch("/api/reviews");
        const json = await res.json();
        if (json.reviews) {
          setReviews(json.reviews);
        }
      } catch (err) {
        console.error("Failed to load reviews:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchReviews();
  }, []);

  const stats = useMemo(() => {
    if (reviews.length === 0) {
      return {
        average: 5.0,
        total: 0,
        counts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        percents: { 5: 100, 4: 0, 3: 0, 2: 0, 1: 0 },
      };
    }
    const total = reviews.length;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    const average = (sum / total).toFixed(1);

    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      const star = Math.min(5, Math.max(1, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
      counts[star] = (counts[star] || 0) + 1;
    });

    const percents = {
      5: Math.round((counts[5] / total) * 100),
      4: Math.round((counts[4] / total) * 100),
      3: Math.round((counts[3] / total) * 100),
      2: Math.round((counts[2] / total) * 100),
      1: Math.round((counts[1] / total) * 100),
    };

    return { average, total, counts, percents };
  }, [reviews]);

  const filteredReviews = useMemo(() => {
    return reviews
      .filter((r) => {
        const matchesSearch =
          r.customer_name.toLowerCase().includes(search.toLowerCase()) ||
          r.review_text.toLowerCase().includes(search.toLowerCase()) ||
          (r.designation && r.designation.toLowerCase().includes(search.toLowerCase()));
        const matchesRating = ratingFilter === "all" ? true : r.rating === ratingFilter;
        return matchesSearch && matchesRating;
      })
      .sort((a, b) => {
        if (sortBy === "highest") return b.rating - a.rating;
        return new Date(b.review_date || b.created_at).getTime() - new Date(a.review_date || a.created_at).getTime();
      });
  }, [reviews, search, ratingFilter, sortBy]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: name.trim(),
          rating,
          review_text: text.trim(),
          designation: city.trim() ? `Devotee, ${city.trim()}` : "Devotee",
          is_published: true, // Auto-publish genuine user feedback
        }),
      });

      if (res.ok) {
        setFeedbackMessage("Thank you for sharing your divine experience! Your review has been added.");
        setName("");
        setCity("");
        setText("");
        setRating(5);
        // Refresh reviews
        const refreshRes = await fetch("/api/reviews");
        const json = await refreshRes.json();
        if (json.reviews) setReviews(json.reviews);
        setTimeout(() => {
          setShowSubmitModal(false);
          setFeedbackMessage(null);
        }, 2500);
      } else {
        alert("Could not submit review. Please try again.");
      }
    } catch (err) {
      alert("Submission error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="theme-light min-h-screen pt-28">
      {/* Top Breadcrumb & Hero */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <Link
          href="/shop"
          className="mb-8 inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-grey-stone hover:text-black-deep transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Shop
        </Link>
        <p className="eyebrow text-grey-stone">Customer Testimonials</p>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <h1 className="section-title text-black-deep">Devotee Experiences & Reviews</h1>
            <p className="mt-6 max-w-2xl text-sm leading-8 text-black-charcoal/72">
              Read authentic feedback from pooja room collectors, temple art lovers, and families who have welcomed our sacred prints into their homes.
            </p>
          </div>
          <button
            onClick={() => setShowSubmitModal(true)}
            className="inline-flex items-center justify-center gap-3 border border-black-deep bg-black-deep px-6 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-white-pure transition-cinematic hover:bg-white-pure hover:text-black-deep w-fit"
          >
            <Plus className="h-4 w-4" /> Share Your Review
          </button>
        </div>
      </section>

      {/* Ratings Breakdown Summary Card */}
      <section className="theme-dark px-4 py-14 md:px-8 border-y border-ornamental bg-black-deep">
        <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-[1fr_1.8fr] gap-10 items-center">
          {/* Average Score */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <span className="text-[10px] uppercase tracking-[0.28em] text-[#c9a227] font-bold">
              Overall Divine Rating
            </span>
            <div className="mt-2 flex items-baseline gap-3">
              <span className="font-serif text-6xl text-white-pure">{stats.average}</span>
              <span className="text-xl text-white-ivory/60 font-serif">/ 5.0</span>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-[#c9a227]">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.round(Number(stats.average)) ? "fill-[#c9a227]" : "text-zinc-700"
                  }`}
                />
              ))}
            </div>
            <p className="mt-3 text-xs text-white-ivory/60">
              Based on {stats.total} genuine customer review{stats.total === 1 ? "" : "s"}
            </p>
          </div>

          {/* Star Rating Breakdown Bars */}
          <div className="space-y-2.5 max-w-md w-full">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center gap-3 text-xs">
                <span className="w-12 text-zinc-400 font-semibold">{star} Stars</span>
                <div className="flex-1 h-2.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-[#c9a227] rounded-full transition-all duration-700"
                    style={{ width: `${stats.percents[star as 1 | 2 | 3 | 4 | 5]}%` }}
                  />
                </div>
                <span className="w-10 text-right text-zinc-400 font-mono text-[11px]">
                  {stats.counts[star as 1 | 2 | 3 | 4 | 5]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="mx-auto max-w-7xl px-4 pt-12 pb-6 md:px-8">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between border-b border-black-deep/10 pb-6">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-grey-stone" />
            <input
              type="text"
              placeholder="Search devotee reviews, temple mentions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-black-deep/20 bg-white-pure pl-10 pr-4 py-2.5 text-xs text-black-deep outline-none focus:border-black-deep transition-colors"
            />
          </div>

          {/* Filters & Sorting */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-[10px] uppercase tracking-wider text-grey-stone font-bold mr-1">
              Rating:
            </span>
            {(["all", 5, 4, 3] as const).map((r) => (
              <button
                key={String(r)}
                onClick={() => setRatingFilter(r)}
                className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider border transition-all ${
                  ratingFilter === r
                    ? "border-black-deep bg-black-deep text-white-pure"
                    : "border-black-deep/15 text-black-deep/70 hover:border-black-deep"
                }`}
              >
                {r === "all" ? "All" : `${r} ★`}
              </button>
            ))}

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "recent" | "highest")}
              className="ml-auto md:ml-4 border border-black-deep/20 bg-white-pure px-3 py-1.5 text-xs text-black-deep uppercase font-semibold outline-none cursor-pointer"
            >
              <option value="recent">Most Recent</option>
              <option value="highest">Highest Rating</option>
            </select>
          </div>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="mx-auto max-w-7xl px-4 pb-24 md:px-8">
        {loading ? (
          <div className="py-20 text-center text-grey-stone text-xs uppercase tracking-widest">
            Loading divine testimonials...
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-black-deep/15 p-8">
            <MessageSquare className="h-10 w-10 text-grey-stone mx-auto mb-3" />
            <p className="font-serif text-xl text-black-deep">No reviews found matching criteria</p>
            <p className="mt-2 text-xs text-grey-stone">
              Try adjusting your search terms or filter selections.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReviews.map((review) => (
              <div
                key={review.id}
                className="flex flex-col justify-between border border-black-deep/15 bg-white-pure p-7 transition-cinematic hover:shadow-xl hover:border-black-deep/40"
              >
                <div>
                  {/* Stars & Verified Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1 text-[#c9a227]">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating ? "fill-[#c9a227]" : "text-zinc-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-wider font-bold text-green-700 bg-green-50 px-2 py-0.5 border border-green-200">
                      <ShieldCheck className="w-3 h-3" /> Verified Buyer
                    </span>
                  </div>

                  {/* Review Text */}
                  <p className="text-sm leading-7 text-black-charcoal/85 italic">
                    &ldquo;{review.review_text}&rdquo;
                  </p>
                </div>

                {/* Devotee Info */}
                <div className="mt-6 pt-5 border-t border-black-deep/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-[#f4f1ea] border border-black-deep/10 flex items-center justify-center font-serif text-xs font-bold text-black-deep overflow-hidden">
                      {review.customer_image ? (
                        <img
                          src={review.customer_image}
                          alt={review.customer_name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        review.customer_name.charAt(0)
                      )}
                    </div>
                    <div>
                      <p className="font-serif text-sm font-semibold text-black-deep">
                        {review.customer_name}
                      </p>
                      {review.designation && (
                        <p className="text-[10px] uppercase tracking-wider text-grey-stone">
                          {review.designation}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] text-grey-stone">
                    {review.review_date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Review Submission Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white-pure border border-black-deep/20 p-6 sm:p-8 space-y-5 text-black-deep shadow-2xl">
            <div className="flex items-center justify-between border-b border-black-deep/10 pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#c9a227] font-bold">
                  Devotee Feedback
                </span>
                <h3 className="font-serif text-2xl uppercase tracking-wider text-black-deep mt-0.5">
                  Write A Review
                </h3>
              </div>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="p-2 text-grey-stone hover:text-black-deep"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {feedbackMessage ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
                <p className="font-serif text-lg text-black-deep">{feedbackMessage}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-grey-stone font-bold">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Meenakshi Sundaram"
                    className="w-full border border-black-deep/20 bg-white-pure px-4 py-2.5 text-sm text-black-deep outline-none focus:border-black-deep"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-grey-stone font-bold">
                    City / State (optional)
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Bengaluru, Karnataka"
                    className="w-full border border-black-deep/20 bg-white-pure px-4 py-2.5 text-sm text-black-deep outline-none focus:border-black-deep"
                  />
                </div>

                {/* Rating selection */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-grey-stone font-bold">
                    Your Rating *
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= rating
                              ? "fill-[#c9a227] text-[#c9a227]"
                              : "text-zinc-300"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold ml-2 text-black-deep">{rating} out of 5</span>
                  </div>
                </div>

                {/* Review Message */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-grey-stone font-bold">
                    Your Experience & Review *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Share how the print looks in your home or pooja room, print finish, framing quality, and delivery experience..."
                    className="w-full border border-black-deep/20 bg-white-pure px-4 py-2.5 text-sm text-black-deep outline-none focus:border-black-deep resize-none leading-relaxed"
                  />
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 border border-black-deep bg-black-deep px-6 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-white-pure transition-cinematic hover:bg-white-pure hover:text-black-deep disabled:opacity-50"
                  >
                    {submitting ? "Submitting..." : "Submit Review"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(false)}
                    className="border border-black-deep/25 px-6 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-black-deep hover:border-black-deep"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
