"use client";

import { Mail, MapPin, MessageSquare, Phone } from "lucide-react";
import { useContactInfo } from "@/context/ContactInfoContext";

export default function ContactPage() {
  const { contactInfo } = useContactInfo();
  const phone = contactInfo?.phone_number || "8122228386";
  const whatsapp = contactInfo?.whatsapp_number || phone;
  const email = contactInfo?.email || "curation@sacredtamil.gallery";
  const location = contactInfo?.address || [contactInfo?.city || "Chennai", contactInfo?.state || "Tamil Nadu"].join(", ");

  return (
    <div className="theme-dark min-h-screen pt-28">
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <p className="eyebrow text-grey-stone">Contact</p>
        <h1 className="section-title max-w-5xl text-white-pure">Discuss A Gallery, Temple, Or Devotional Artwork Project</h1>
        <p className="mt-7 max-w-3xl text-sm leading-8 text-white-ivory/72">
          Use the inquiry form for image licensing replacements, content additions, temple collection work, or client customization.
        </p>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-24 md:grid-cols-[0.9fr_1.1fr] md:px-8">
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            ["Phone", phone, Phone],
            ["WhatsApp", whatsapp, MessageSquare],
            ["Email", email, Mail],
            ["Location", location, MapPin],
          ].map(([label, value, Icon]) => (
            <div key={label as string} className="border border-ornamental p-6">
              <Icon className="mb-5 h-5 w-5 text-grey-stone" />
              <p className="text-[10px] uppercase tracking-[0.28em] text-grey-stone">{label as string}</p>
              <p className="mt-3 break-words font-serif text-2xl text-white-pure">{value as string}</p>
            </div>
          ))}
        </div>
        <form className="border border-ornamental p-6 md:p-9" onSubmit={(event) => event.preventDefault()}>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-[10px] uppercase tracking-[0.25em] text-grey-stone">Name</span>
              <input className="w-full border border-white-pure/15 bg-black-charcoal px-4 py-3 text-sm text-white-pure outline-none transition-cinematic focus:border-white-pure" />
            </label>
            <label className="block">
              <span className="mb-2 block text-[10px] uppercase tracking-[0.25em] text-grey-stone">Email</span>
              <input type="email" className="w-full border border-white-pure/15 bg-black-charcoal px-4 py-3 text-sm text-white-pure outline-none transition-cinematic focus:border-white-pure" />
            </label>
          </div>
          <label className="mt-5 block">
            <span className="mb-2 block text-[10px] uppercase tracking-[0.25em] text-grey-stone">Message</span>
            <textarea rows={6} className="w-full resize-none border border-white-pure/15 bg-black-charcoal px-4 py-3 text-sm text-white-pure outline-none transition-cinematic focus:border-white-pure" />
          </label>
          <button type="submit" className="mt-6 w-full border border-white-pure px-6 py-4 text-xs font-semibold uppercase tracking-[0.22em] transition-cinematic hover:bg-white-pure hover:text-black-deep">
            Send Inquiry
          </button>
        </form>
      </section>
    </div>
  );
}
