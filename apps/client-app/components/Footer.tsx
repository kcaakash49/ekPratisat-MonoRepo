import { 
    Facebook, 
    Instagram, 
    Twitter, 
    Youtube, 
    Linkedin,
    Home,
    UserPlus,
    Briefcase,
    FileText,
    HelpCircle,
    Phone,
    Building,
    Building2,
    LandPlot,
    Store,
    BedDouble,
    Bed,
    Key,
    Calculator,
    Shield,
    FileCheck,
  } from "lucide-react";
  import Image from "next/image";
  
  const Footer = () => {
    return (
      <footer className="bg-[#f6f1ed] dark:bg-gray-900 text-gray-950 dark:text-gray-100 py-10 border-t border-gray-300 dark:border-gray-700 relative mt-4">
        {/* Watermark Background - Fixed Position */}
        <div className="absolute inset-0 overflow-hidden z-0">
          <div className="relative w-full h-full">
            <Image
              src="/FinalLogoGrayScale.png"
              alt="Ekpratisat Logo"
              fill
              className="object-contain opacity-20 dark:opacity-10 pointer-events-none"
              style={{ 
                top: "40%",
                left: "50%",
                transform: "translate(-50%, -50%) scale(1.2)"
              }}
              priority
            />
          </div>
        </div>
  
        {/* Main Content Container */}
        <div className="container mx-auto px-6 relative z-10">
          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* About Section */}
            <div className="flex flex-col">
              <h3 className="text-xl font-semibold mb-4">
                Welcome to Ekpratisat Real Estate – Smart Choices, Secure Investments!
              </h3>
              <p className="text-sm mb-4 dark:text-gray-300">
                At Ekpratisat Real Estate, we make property transactions simple, transparent, and hassle-free.
                As a trusted brokerage firm in Nepal, we act as the reliable bridge between buyers and sellers.
              </p>
              <p className="text-sm font-semibold mb-4 dark:text-gray-300">"एक प्रतिशत – उत्कृष्ट सेवा, उत्तम कारोबार।"</p>
  
              {/* Social Media */}
              <div className="flex gap-4">
                <a href="#" className="text-gray-700 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                  <Facebook size={20} />
                </a>
                <a href="#" className="text-gray-700 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-400 transition-colors">
                  <Instagram size={20} />
                </a>
                <a href="#" className="text-gray-700 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                  <Twitter size={20} />
                </a>
                <a href="#" className="text-gray-700 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                  <Youtube size={20} />
                </a>
                <a href="#" className="text-gray-700 dark:text-gray-400 hover:text-blue-700 dark:hover:text-blue-500 transition-colors">
                  <Linkedin size={20} />
                </a>
              </div>
            </div>
  
            {/* Company Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Home size={16} className="mr-2 text-gray-600 dark:text-gray-400" />
                  <a href="/about" className="text-sm hover:text-gray-500 dark:hover:text-gray-300 transition-colors">About Us</a>
                </li>
                <li className="flex items-center">
                  <UserPlus size={16} className="mr-2 text-gray-600 dark:text-gray-400" />
                  <a href="#" className="text-sm hover:text-gray-500 dark:hover:text-gray-300 transition-colors">Become an Agent</a>
                </li>
                <li className="flex items-center">
                  <Briefcase size={16} className="mr-2 text-gray-600 dark:text-gray-400" />
                  <a href="#" className="text-sm hover:text-gray-500 dark:hover:text-gray-300 transition-colors">Careers</a>
                </li>
                <li className="flex items-center">
                  <FileText size={16} className="mr-2 text-gray-600 dark:text-gray-400" />
                  <a href="#" className="text-sm hover:text-gray-500 dark:hover:text-gray-300 transition-colors">Blogs</a>
                </li>
                <li className="flex items-center">
                  <HelpCircle size={16} className="mr-2 text-gray-600 dark:text-gray-400" />
                  <a href="#" className="text-sm hover:text-gray-500 dark:hover:text-gray-300 transition-colors">FAQs</a>
                </li>
                <li className="flex items-center">
                  <Phone size={16} className="mr-2 text-gray-600 dark:text-gray-400" />
                  <a href="/contact" className="text-sm hover:text-gray-500 dark:hover:text-gray-300 transition-colors">Contact Us</a>
                </li>
              </ul>
            </div>
  
            {/* Property Categories */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Browse Properties</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Home size={16} className="mr-2 text-gray-600 dark:text-gray-400" />
                  <a href="/category/house" className="text-sm hover:text-gray-500 dark:hover:text-gray-300 transition-colors">House</a>
                </li>
                <li className="flex items-center">
                  <LandPlot size={16} className="mr-2 text-gray-600 dark:text-gray-400" />
                  <a href="/category/land" className="text-sm hover:text-gray-500 dark:hover:text-gray-300 transition-colors">Land</a>
                </li>
                <li className="flex items-center">
                  <Building size={16} className="mr-2 text-gray-600 dark:text-gray-400" />
                  <a href="/category/flat" className="text-sm hover:text-gray-500 dark:hover:text-gray-300 transition-colors">Flat</a>
                </li>
                <li className="flex items-center">
                  <Building2 size={16} className="mr-2 text-gray-600 dark:text-gray-400" />
                  <a href="/category/apartment" className="text-sm hover:text-gray-500 dark:hover:text-gray-300 transition-colors">Apartment</a>
                </li>
                <li className="flex items-center">
                  <Store size={16} className="mr-2 text-gray-600 dark:text-gray-400" />
                  <a href="/category/business" className="text-sm hover:text-gray-500 dark:hover:text-gray-300 transition-colors">Business</a>
                </li>
                <li className="flex items-center">
                  <BedDouble size={16} className="mr-2 text-gray-600 dark:text-gray-400" />
                  <a href="/category/hostel_boys" className="text-sm hover:text-gray-500 dark:hover:text-gray-300 transition-colors">Boys Hostel</a>
                </li>
                <li className="flex items-center">
                  <Bed size={16} className="mr-2 text-gray-600 dark:text-gray-400" />
                  <a href="/category/hostel_girls" className="text-sm hover:text-gray-500 dark:hover:text-gray-300 transition-colors">Girls Hostel</a>
                </li>
                <li className="flex items-center">
                  <Key size={16} className="mr-2 text-gray-600 dark:text-gray-400" />
                  <a href="/category/room" className="text-sm hover:text-gray-500 dark:hover:text-gray-300 transition-colors">Room</a>
                </li>
              </ul>
            </div>
  
            {/* Useful Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Useful Links</h3>
              <ul className="space-y-2 mb-4">
                <li className="flex items-center">
                  <Calculator size={16} className="mr-2 text-gray-600 dark:text-gray-400" />
                  <a href="#" className="text-sm hover:text-gray-500 dark:hover:text-gray-300 transition-colors">Home Loans</a>
                </li>
                <li className="flex items-center">
                  <Calculator size={16} className="mr-2 text-gray-600 dark:text-gray-400" />
                  <a href="/unit-converter" className="text-sm hover:text-gray-500 dark:hover:text-gray-300 transition-colors">Unit Converter</a>
                </li>
                <li className="flex items-center">
                  <Shield size={16} className="mr-2 text-gray-600 dark:text-gray-400" />
                  <a href="#" className="text-sm hover:text-gray-500 dark:hover:text-gray-300 transition-colors">Privacy Policy</a>
                </li>
                <li className="flex items-center">
                  <FileCheck size={16} className="mr-2 text-gray-600 dark:text-gray-400" />
                  <a href="#" className="text-sm hover:text-gray-500 dark:hover:text-gray-300 transition-colors">Terms and Conditions</a>
                </li>
              </ul>
  
              <div className="flex flex-col space-y-2">
                <a href="#" className="inline-block transition-transform hover:scale-105">
                  <div className="relative h-10 w-32">
                    <Image
                      src="/google-play.png"
                      alt="Download on Google Play"
                      fill
                      className="object-contain"
                    />
                  </div>
                </a>
                <a href="#" className="inline-block transition-transform hover:scale-105">
                  <div className="relative h-10 w-32">
                    <Image
                      src="/app-store.png"
                      alt="Download on App Store"
                      fill
                      className="object-contain"
                    />
                  </div>
                </a>
              </div>
            </div>
          </div>
  
          {/* Footer Bottom */}
          <div className="mt-12 pt-6 border-t border-gray-300 dark:border-gray-700">
            <p className="text-xs text-center text-gray-500 dark:text-gray-400 mb-2">
              Disclaimer: EkPratisat.com is a real estate information platform that does not directly manage transactions.
            </p>
            <p className="text-xs text-center text-gray-700 dark:text-gray-300">
              © {new Date().getFullYear()} EkPratisat. All Rights Reserved. Developed by Ekpratisat Team
            </p>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;