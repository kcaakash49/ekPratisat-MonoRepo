import { Search, ChevronDown } from 'lucide-react';

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
            <div className="bg-white dark:bg-secondary-800 p-2 md:p-3 rounded-2xl md:rounded-full shadow-2xl flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-0 max-w-4xl border border-white/10">
              
              {/* Location Input */}
              <div className="relative flex-[1.5] flex items-center md:border-r border-secondary-200 dark:border-secondary-700">
                <Search className="absolute left-4 h-5 w-5 text-secondary-400" />
                <input
                  type="text"
                  placeholder="City, neighborhood, or ZIP"
                  className="w-full pl-12 pr-4 py-4 bg-transparent text-secondary-900 dark:text-white placeholder-secondary-400 focus:outline-none text-base"
                />
              </div>

              {/* Selectors with Gold hover states */}
              <div className="flex flex-1 items-center border-secondary-200 dark:border-secondary-700 md:border-r">
                <div className="relative w-full">
                  <select className="w-full appearance-none px-6 py-4 bg-transparent text-secondary-700 dark:text-secondary-200 focus:outline-none cursor-pointer font-medium hover:text-[#C4A77D] transition-colors">
                    <option>Buy</option>
                    <option>Rent</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none text-secondary-400" />
                </div>
              </div>

              <div className="flex flex-1 items-center">
                <div className="relative w-full">
                  <select className="w-full appearance-none px-6 py-4 bg-transparent text-secondary-700 dark:text-secondary-200 focus:outline-none cursor-pointer font-medium hover:text-[#C4A77D] transition-colors">
                    <option>All Types</option>
                    <option>Villa</option>
                    <option>Apartment</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none text-secondary-400" />
                </div>
              </div>

              {/* GOLD SEARCH BUTTON */}
              <button className="bg-[#C4A77D] hover:bg-[#A68F6C] transition-all text-white rounded-xl md:rounded-full px-8 py-4 flex items-center justify-center gap-2 font-bold text-lg shadow-lg shadow-[#C4A77D]/20">
                <Search className="h-5 w-5 " />
                <span className="md:hidden lg:inline">Search</span>
              </button>
            </div>
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