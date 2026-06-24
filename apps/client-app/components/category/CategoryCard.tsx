export default function CategoryCard({ img, type }: { img: string; type: string }) {
  return (
    <div className="group relative w-full overflow-hidden rounded-2xl border border-[var(--ek-border-soft)] bg-[var(--ek-bg-card)] shadow-[var(--ek-shadow-card)] transition duration-300 hover:-translate-y-0.5 hover:border-[var(--ek-border-strong)] dark:border-[var(--ek-dark-border)] dark:bg-[var(--ek-dark-surface)] dark:shadow-[var(--ek-dark-shadow-card)] dark:hover:border-[var(--ek-dark-border-strong)]">
      <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
        {/* Background Image with Hover Zoom */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${process.env.NEXT_PUBLIC_BASE_URL}${img}`}
          alt={type}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Modern Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/20 to-transparent opacity-70 transition-opacity group-hover:opacity-80" />
        
        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-2 sm:pb-3">
          <span className="rounded-full border border-white/30 bg-black/68 px-3.5 py-1 text-sm font-extrabold tracking-normal text-white shadow-[0_8px_22px_rgba(0,0,0,0.36)] backdrop-blur-sm [text-shadow:0_2px_12px_rgba(0,0,0,0.98),0_1px_3px_rgba(0,0,0,0.95),0_0_2px_rgba(0,0,0,0.85)] transition-colors duration-300 group-hover:border-[rgba(239,199,90,0.5)] group-hover:bg-black/78 group-hover:text-gold-100 sm:text-base">
            {type}
          </span>
        </div>
      </div>
    </div>
  );
}
