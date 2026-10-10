import Link from "next/link";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex flex-col items-start select-none group ${className}`}>
      <span className="font-serif text-lg md:text-xl tracking-[0.2em] uppercase text-current transition-opacity duration-500 font-medium group-hover:text-grey-stone">
        SACRED TAMIL
      </span>
      <span className="text-[9px] tracking-[0.3em] uppercase text-current opacity-60 font-medium mt-1">
        DEVOTIONAL PRINTS
      </span>
    </Link>
  );
}
