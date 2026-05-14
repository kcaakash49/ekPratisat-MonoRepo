export default function CategoryCard({ img, type }: { img: string; type: string }) {
  return (
    <div className="group relative w-full overflow-hidden rounded-2xl border border-[var(--ek-border-soft)] bg-[var(--ek-bg-card)] shadow-[var(--ek-shadow-card)] transition duration-300 hover:-translate-y-0.5 hover:border-[var(--ek-border-strong)] dark:border-[var(--ek-dark-border)] dark:bg-[var(--ek-dark-surface)] dark:shadow-[var(--ek-dark-shadow-card)] dark:hover:border-[var(--ek-dark-border-strong)]">
      <div className="relative aspect-[7/5] overflow-hidden">
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
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-6">
          <span className="text-xl font-bold tracking-wide text-white transition-colors duration-300 group-hover:text-gold-200">
            {type}
          </span>
          {/* Subtle gold underline that expands on hover */}
          <div className="h-0.5 w-0 bg-gold-gradient transition-all duration-300 group-hover:w-16 mt-1" />
        </div>
      </div>
    </div>
  );
}
