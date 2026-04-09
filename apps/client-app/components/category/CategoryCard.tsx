export default function CategoryCard({ img, type }: { img: string; type: string }) {
  return (
    <div className="group relative w-full overflow-hidden rounded-2xl bg-white dark:bg-secondary-800 shadow-md transition-all duration-300 hover:shadow-xl border border-secondary-100 dark:border-secondary-700">
      <div className="relative aspect-[7/5] overflow-hidden">
        {/* Background Image with Hover Zoom */}
        <img
          src={`${process.env.NEXT_PUBLIC_BASE_URL}${img}`}
          alt={type}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Modern Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-secondary-900/80 via-secondary-900/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
        
        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-6">
          <span className="text-white font-bold text-xl tracking-wide group-hover:text-gold transition-colors duration-300">
            {type}
          </span>
          {/* Subtle gold underline that expands on hover */}
          <div className="h-0.5 w-0 bg-gold-gradient transition-all duration-300 group-hover:w-16 mt-1" />
        </div>
      </div>
    </div>
  );
}