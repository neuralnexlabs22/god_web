"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Star, ChevronLeft, ChevronRight, MessageSquare, ShieldCheck, ArrowRight } from "lucide-react";
import { CustomerReview } from "@/app/admin/reviews/page";

const fallbackReviews: CustomerReview[] = [
  {
    id: "fb-1",
    customer_name: "Dr. K. Sivasankaran",
    customer_image: null,
    rating: 5,
    review_text:
      "The Tanjore gold-foil Nataraja print is magnificent. Placed in our central pooja room, the subtle luster and Dravidian proportions bring absolute peace and sanctity.",
    designation: "Art Historian, Chennai",
    is_published: true,
    review_date: "2026-10-08",
    display_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: "fb-2",
    customer_name: "Ananya Sundaram",
    customer_image: null,
    rating: 5,
    review_text:
      "Exceptional teak wood framing and museum-grade archival matte paper. The Lord Murugan Vel artwork arrived with triple-layer wooden crate packaging.",
    designation: "Pooja Room Collector, Coimbatore",
    is_published: true,
    review_date: "2026-10-04",
    display_order: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: "fb-3",
    customer_name: "M. Jayakumar",
    customer_image: null,
    rating: 5,
    review_text:
      "The Thanjavur Brihadisvara Vimana architectural print captures the golden dawn light of the Chola era with breathtaking detail. Worth every rupee.",
    designation: "Devotee & Architect, Bengaluru",
    is_published: true,
    review_date: "2026-09-28",
    display_order: 3,
    created_at: new Date().toISOString(),
  },
  {
    id: "fb-4",
    customer_name: "Radhika Narayanan",
    customer_image: null,
    rating: 5,
    review_text:
      "Ordered the 5-piece Dravidian Sanctum Set for our new housewarming. Guests couldn't stop admiring the sacred deities and fine craftsmanship.",
    designation: "Verified Buyer, Madurai",
    is_published: true,
    review_date: "2026-09-20",
    display_order: 4,
    created_at: new Date().toISOString(),
  },
];

export default function TestimonialCarousel() {
  const [reviews, setReviews] = useState<CustomerReview[]>(fallbackReviews);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    async function loadReviews() {
      try {
        const res = await fetch("/api/reviews");
        const json = await res.json();
        if (json.reviews && json.reviews.length > 0) {
          setReviews(json.reviews);
        }
      } catch (err) {
        // keep fallback
      }
    }
    loadReviews();
  }, []);

  const total = reviews.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Autoplay with pause on hover
  useEffect(() => {
    if (isPaused || total <= 1) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5500);
    return () => clearInterval(interval);
  }, [isPaused, total, nextSlide]);

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (diff > 45) {
      nextSlide();
    } else if (diff < -45) {
      prevSlide();
    }
    touchStartX.current = null;
  };

  const activeReview = reviews[currentIndex] || reviews[0];

  return (
    <section
      className="theme-dark section-pad border-b border-ornamental bg-[#060606] text-white-pure overflow-hidden relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* Header */}
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow text-[#c9a227]">Devotee Testimonials</p>
            <h2 className="section-title text-white-pure">Words of Reverence</h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white-ivory/70">
              Read authentic experiences from art collectors, temple lovers, and families who have consecrated our devotional prints.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/reviews"
              className="inline-flex items-center gap-2 border border-white-pure/20 px-5 py-3 text-xs uppercase tracking-[0.2em] text-white-pure transition-cinematic hover:border-[#c9a227] hover:text-[#c9a227]"
            >
              All Reviews <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <div className="flex items-center gap-2">
              <button
                onClick={prevSlide}
                aria-label="Previous testimonial"
                className="flex h-11 w-11 items-center justify-center border border-white-pure/20 text-white-pure transition-all hover:bg-white-pure hover:text-black-deep"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={nextSlide}
                aria-label="Next testimonial"
                className="flex h-11 w-11 items-center justify-center border border-white-pure/20 text-white-pure transition-all hover:bg-white-pure hover:text-black-deep"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Slide Card */}
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative min-h-[280px] sm:min-h-[240px] border border-white/10 bg-[#0c0c0c] p-8 md:p-12 transition-all duration-700"
        >
          {/* Subtle gold quote mark ornament */}
          <div className="absolute right-8 top-6 font-serif text-8xl text-white/5 select-none pointer-events-none">
            &ldquo;
          </div>

          <div className="relative z-10 max-w-3xl">
            {/* Rating Stars */}
            <div className="flex items-center gap-1.5 text-[#c9a227] mb-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < activeReview.rating ? "fill-[#c9a227]" : "text-zinc-700"
                  }`}
                />
              ))}
              <span className="ml-3 text-[10px] uppercase font-bold tracking-wider text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded">
                Verified Devotee
              </span>
            </div>

            {/* Testimonial Quote */}
            <p className="font-serif text-xl md:text-2xl leading-relaxed text-white-pure italic">
              &ldquo;{activeReview.review_text}&rdquo;
            </p>

            {/* Reviewer Details */}
            <div className="mt-8 flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-[#c9a227]/15 border border-[#c9a227]/30 flex items-center justify-center font-serif text-sm font-bold text-[#c9a227]">
                {activeReview.customer_name.charAt(0)}
              </div>
              <div>
                <p className="font-serif text-base font-semibold text-white-pure">
                  {activeReview.customer_name}
                </p>
                {activeReview.designation && (
                  <p className="text-xs text-[#c9a227] tracking-wider uppercase font-medium mt-0.5">
                    {activeReview.designation}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Pagination dots */}
          <div className="mt-8 flex items-center gap-2 pt-4 border-t border-white/5">
            {reviews.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to review ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentIndex ? "w-8 bg-[#c9a227]" : "w-2 bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
