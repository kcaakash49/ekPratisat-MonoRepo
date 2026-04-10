import { Search, ChevronDown } from 'lucide-react';
import HomeSearch from './homeSearch/HomeSearch';

const HeroSection = () => {
  return (
    <div className="w-full font-sans transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative min-h-[700px] lg:h-[750px] overflow-hidden flex items-center bg-secondary-900">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop"
            alt="Luxury modern real estate"
            className="w-full h-full object-cover"
            loading="eager"
          />
          {/* Deep gradient to make the gold pop */}
          <div className="absolute inset-0 bg-gradient-to-r from-secondary-900/95 via-secondary-900/70 to-transparent" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-3xl">
            {/* Tagline - GOLD TEXT */}
            <span className="bg-gold-gradient bg-clip-text text-transparent text-sm md:text-base uppercase tracking-[0.3em] font-bold mb-4 block">
              PREMIUM REAL ESTATE
            </span>

            {/* Main Headline - GOLD ACCENT */}
            <h1 className="text-white text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] mb-6">
              Find Your <span className="bg-gold-gradient bg-clip-text text-transparent">Dream</span> Home
            </h1>

            {/* Description */}
            <p className="text-secondary-200 text-lg md:text-xl mb-10 max-w-xl font-light leading-relaxed">
              Discover exceptional properties in the most sought-after locations.
              Your journey to luxury living begins here.
            </p>

            {/* Responsive Search Container */}
           <HomeSearch/>
          </div>
        </div>
      </section>

      {/* Stats Section with Gold Numbers */}
      <section className="bg-secondary-100 dark:bg-secondary-800 py-12 md:py-20 border-t border-secondary-200 dark:border-secondary-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-6">
            {[
              { value: "2,500+", label: "Properties Listed" },
              { value: "$4.2B", label: "Total Sales" },
              { value: "98%", label: "Satisfaction" },
              { value: "15+", label: "Years Exp." },
            ].map((stat, index) => (
              <div key={index} className="flex flex-col items-center md:items-start group">
                {/* GOLD NUMBERS */}
                <span className="bg-gold-gradient bg-clip-text text-transparent text-4xl md:text-5xl font-black mb-2 transition-transform group-hover:scale-105 duration-300">
                  {stat.value}
                </span>
                <span className="text-secondary-500 dark:text-secondary-400 text-xs md:text-sm uppercase tracking-widest font-bold border-l-2 border-[#C4A77D] pl-3">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;