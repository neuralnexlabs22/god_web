"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Upload,
  Send,
  Camera,
  Layers,
  Ruler,
  HelpCircle,
} from "lucide-react";
import { uploadAdminImage } from "@/lib/imageUpload";
import { useContactInfo } from "@/context/ContactInfoContext";

export default function CustomOrderPage() {
  const { contactInfo } = useContactInfo();
  const whatsappNumber = contactInfo?.whatsapp_number || "8122228386";

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [deity, setDeity] = useState("");
  const [dimensions, setDimensions] = useState("16 x 24 in");
  const [frame, setFrame] = useState("Teak Wood Frame");
  const [details, setDetails] = useState("");
  const [notes, setNotes] = useState("");
  const [referenceImage, setReferenceImage] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const url = await uploadAdminImage(file);
      setReferenceImage(url);
    } catch (err) {
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !deity.trim()) {
      alert("Please enter your name, phone number, and requested deity/artwork.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        customer_name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        requested_deity: deity.trim(),
        dimensions,
        frame_preference: frame,
        customization_details: details.trim(),
        reference_image: referenceImage || null,
        notes: notes.trim(),
      };

      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (res.ok) {
        setSubmittedId(json.enquiry?.id || "ENQ-CONFIRMED");
      } else {
        alert(json.error || "Failed to submit enquiry");
      }
    } catch (err) {
      alert("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendViaWhatsApp = () => {
    const cleanPhone = whatsappNumber.replace(/[^0-9]/g, "");
    let msg = `*🕉️ CUSTOM DEVOTIONAL PHOTO ENQUIRY — FRAMES OF DIVINE*\n\n`;
    msg += `*Customer Name:* ${name.trim() || "Devotee"}\n`;
    msg += `*Contact Phone:* ${phone.trim()}\n`;
    if (email) msg += `*Email:* ${email.trim()}\n`;
    msg += `*Requested Deity / Theme:* ${deity.trim()}\n`;
    msg += `*Desired Dimensions:* ${dimensions}\n`;
    msg += `*Frame / Finish:* ${frame}\n`;
    if (details) msg += `*Customization Details:* ${details.trim()}\n`;
    if (notes) msg += `*Special Notes:* ${notes.trim()}\n`;
    msg += `\nPlease guide me with customization options, framing styles, and pricing quote. Thank you! 🙏`;

    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div className="theme-light min-h-screen pt-28">
      {/* Hero Header */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <Link
          href="/shop"
          className="mb-8 inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-grey-stone hover:text-black-deep transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Shop
        </Link>
        <p className="eyebrow text-grey-stone">Custom Devotional Commissions</p>
        <div className="max-w-4xl">
          <h1 className="section-title text-black-deep">Bespoke Devotional Photo Prints & Sanctum Sets</h1>
          <p className="mt-6 text-sm leading-8 text-black-charcoal/75 max-w-3xl">
            Whether you desire a specific ancestral deity, custom pooja room dimensions, rare sacred temple sanctum photography, or 22KT gold foil finishing, our master artisans curate each bespoke devotional commission with reverent craftsmanship.
          </p>
        </div>
      </section>

      {/* Main Grid: Form + Features */}
      <section className="mx-auto max-w-7xl px-4 pb-24 md:px-8 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 items-start">
        {/* Enquiry Form */}
        <div className="border border-black-deep/15 bg-white-pure p-8 md:p-10 shadow-lg">
          {submittedId ? (
            <div className="py-12 text-center space-y-5">
              <div className="h-16 w-16 mx-auto rounded-2xl bg-[#c9a227]/10 border border-[#c9a227]/30 flex items-center justify-center text-[#c9a227]">
                <CheckCircle className="h-8 w-8" />
              </div>
              <h3 className="font-serif text-3xl uppercase tracking-wider text-black-deep">
                Enquiry Received with Reverence
              </h3>
              <p className="text-sm text-black-charcoal/70 max-w-md mx-auto leading-relaxed">
                Thank you! Your custom devotional request reference is{" "}
                <span className="font-mono font-bold text-black-deep">{submittedId}</span>. Our curator will review your specifications and contact you shortly.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleSendViaWhatsApp}
                  className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-6 py-3.5 text-xs font-bold uppercase tracking-widest hover:brightness-110"
                >
                  <MessageSquare className="h-4 w-4" /> Open in WhatsApp
                </button>
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center border border-black-deep px-6 py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-black-deep hover:text-white"
                >
                  Browse Gallery
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h3 className="font-serif text-2xl uppercase tracking-wider text-black-deep">
                  Devotional Photo Request Form
                </h3>
                <p className="text-xs text-grey-stone mt-1">
                  Fill in your custom specifications below. All orders include insured packaging.
                </p>
              </div>

              {/* Customer Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-grey-stone font-bold">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. S. Ramanathan"
                    className="w-full border border-black-deep/20 bg-white-pure px-4 py-3 text-sm text-black-deep outline-none focus:border-black-deep"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-grey-stone font-bold">
                    WhatsApp / Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full border border-black-deep/20 bg-white-pure px-4 py-3 text-sm text-black-deep outline-none focus:border-black-deep"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-grey-stone font-bold">
                  Email Address (optional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. devotee@example.com"
                  className="w-full border border-black-deep/20 bg-white-pure px-4 py-3 text-sm text-black-deep outline-none focus:border-black-deep"
                />
              </div>

              {/* Deity / Artwork Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-grey-stone font-bold">
                  Requested Deity / Temple / Artwork *
                </label>
                <input
                  type="text"
                  required
                  value={deity}
                  onChange={(e) => setDeity(e.target.value)}
                  placeholder="e.g. Lord Murugan with Vel, Chidambaram Nataraja, or Family Ancestral Deity"
                  className="w-full border border-black-deep/20 bg-white-pure px-4 py-3 text-sm text-black-deep outline-none focus:border-black-deep"
                />
              </div>

              {/* Dimensions & Frame Style */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-grey-stone font-bold">
                    Desired Dimensions
                  </label>
                  <select
                    value={dimensions}
                    onChange={(e) => setDimensions(e.target.value)}
                    className="w-full border border-black-deep/20 bg-white-pure px-4 py-3 text-sm text-black-deep outline-none focus:border-black-deep cursor-pointer"
                  >
                    <option value="12 x 18 in (Compact Pooja Room)">12 x 18 in (Compact Pooja Room)</option>
                    <option value="16 x 24 in (Standard Classic)">16 x 24 in (Standard Classic)</option>
                    <option value="20 x 30 in (Grand Sanctum)">20 x 30 in (Grand Sanctum)</option>
                    <option value="24 x 36 in (Temple Collector Gallery)">24 x 36 in (Temple Collector Gallery)</option>
                    <option value="Custom Wall Proportions">Custom Wall Proportions (Describe below)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-grey-stone font-bold">
                    Frame & Finish Preference
                  </label>
                  <select
                    value={frame}
                    onChange={(e) => setFrame(e.target.value)}
                    className="w-full border border-black-deep/20 bg-white-pure px-4 py-3 text-sm text-black-deep outline-none focus:border-black-deep cursor-pointer"
                  >
                    <option value="Teak Wood Frame (Matte Glass)">Teak Wood Frame (Matte Glass)</option>
                    <option value="22KT Gold Foil Accent Frame">22KT Gold Foil Accent Frame</option>
                    <option value="Chettinad Carved Wood Border">Chettinad Carved Wood Border</option>
                    <option value="Contemporary Acrylic Float">Contemporary Acrylic Float</option>
                    <option value="Unframed Archival Canvas Only">Unframed Archival Canvas Only</option>
                  </select>
                </div>
              </div>

              {/* Customization Details */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-grey-stone font-bold">
                  Customization Details & Special Instructions
                </label>
                <textarea
                  rows={3}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Specify particular mudras, temple vimana backgrounds, lighting tone (dawn / twilight / sanctum lamps), or custom border inscriptions..."
                  className="w-full border border-black-deep/20 bg-white-pure px-4 py-3 text-sm text-black-deep outline-none focus:border-black-deep resize-none"
                />
              </div>

              {/* Reference Image Upload */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-grey-stone font-bold">
                  Optional Reference Image / Photograph
                </label>
                <div className="flex gap-3 items-center">
                  <label className="flex items-center gap-2 border border-black-deep/20 bg-white-pure px-4 py-3 text-xs font-semibold uppercase tracking-wider text-black-deep hover:bg-black-deep hover:text-white transition-all cursor-pointer">
                    <Camera className="w-4 h-4" />
                    <span>{uploadingImage ? "Uploading..." : "Upload Photo"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  {referenceImage && (
                    <span className="text-xs text-green-700 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Image attached
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 inline-flex items-center justify-center gap-3 border border-black-deep bg-black-deep px-8 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-white-pure transition-cinematic hover:bg-white-pure hover:text-black-deep disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                  {submitting ? "Submitting..." : "Submit Custom Enquiry"}
                </button>
                <button
                  type="button"
                  onClick={handleSendViaWhatsApp}
                  className="inline-flex items-center justify-center gap-2.5 border border-[#25D366] bg-[#25D366] px-6 py-4 text-xs font-bold uppercase tracking-widest text-white hover:brightness-105 transition-all"
                >
                  <MessageSquare className="h-4 w-4" />
                  WhatsApp Direct
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Informational Pillars */}
        <div className="space-y-6">
          <div className="border border-ornamental p-7 bg-white-pure">
            <Sparkles className="w-6 h-6 text-[#c9a227] mb-3" />
            <h3 className="font-serif text-xl uppercase tracking-wider text-black-deep">
              How Custom Devotional Orders Work
            </h3>
            <ul className="mt-4 space-y-3 text-xs leading-relaxed text-black-charcoal/75">
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#c9a227]">1.</span>
                <span>Submit your deity preferences, wall dimensions, and framing requests.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#c9a227]">2.</span>
                <span>Our curator prepares high-resolution digital mockups with custom sizing.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#c9a227]">3.</span>
                <span>Upon approval, prints are prepared using museum archival inks and seasoned teak wood.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#c9a227]">4.</span>
                <span>Shipped in reinforced protective wooden casing with pan-India insured transit.</span>
              </li>
            </ul>
          </div>

          <div className="border border-ornamental p-7 bg-white-pure">
            <Ruler className="w-6 h-6 text-[#c9a227] mb-3" />
            <h3 className="font-serif text-xl uppercase tracking-wider text-black-deep">
              Pooja Room & Temple Wall Sizing
            </h3>
            <p className="mt-3 text-xs leading-6 text-black-charcoal/75">
              Need custom measurements to fit an exact pooja mandap or ancestral niche? We support custom aspect ratios from 1:1 square sanctum icons to panoramic 1:3 temple gopuram corridor vistas.
            </p>
          </div>

          <div className="border border-ornamental p-7 bg-white-pure">
            <MessageSquare className="w-6 h-6 text-[#c9a227] mb-3" />
            <h3 className="font-serif text-xl uppercase tracking-wider text-black-deep">
              Need Immediate Guidance?
            </h3>
            <p className="mt-2 text-xs leading-6 text-black-charcoal/75">
              Chat directly with our curation team on WhatsApp for prompt sizing recommendations and sample prints.
            </p>
            <button
              onClick={handleSendViaWhatsApp}
              className="mt-4 inline-flex items-center gap-2 border border-black-deep px-5 py-2.5 text-xs uppercase font-bold tracking-wider hover:bg-black-deep hover:text-white transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" /> WhatsApp: {whatsappNumber}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
