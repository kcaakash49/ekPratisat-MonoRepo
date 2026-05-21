import { Router } from "express";

const testRouter = Router();

// 40 Real Estate Dummy Data Objects
const realEstateData = [
  {
    id: 1,
    title: "The Bronte Modern Estate",
    description: "An architectural masterpiece featuring open-concept living, premium finishes, and a stunning outdoor entertaining area perfect for modern families.",
    price: 1250000,
    type: "House",
    location: "Sydney, NSW",
    bedrooms: 4,
    bathrooms: 3,
    imageUrl: "https://www.novushomes.com.au/sites/default/files/styles/card/public/2025-10/Bronte%20Cover%20Image.jpg.webp?itok=xKyVQHnz"
  },
  {
    id: 2,
    title: "Urban Luxury Apartment",
    description: "A sleek, contemporary apartment located in the heart of the CBD with panoramic city views and state-of-the-art integrated smart appliances.",
    price: 680000,
    type: "Apartment",
    location: "Melbourne, VIC",
    bedrooms: 2,
    bathrooms: 2,
    imageUrl: "https://www.novushomes.com.au/sites/default/files/styles/card/public/2025-10/Bronte%20Cover%20Image.jpg.webp?itok=xKyVQHnz"
  },
  {
    id: 3,
    title: "Coastal Breeze Villa",
    description: "Enjoy resort-style living in this beautiful coastal villa featuring wrap-around balconies, private beach access, and high-end security.",
    price: 1850000,
    type: "Villa",
    location: "Gold Coast, QLD",
    bedrooms: 5,
    bathrooms: 4,
    imageUrl: "https://www.novushomes.com.au/sites/default/files/styles/card/public/2025-10/Bronte%20Cover%20Image.jpg.webp?itok=xKyVQHnz"
  },
  {
    id: 4,
    title: "Charming Suburban Townhouse",
    description: "A beautifully maintained multi-level townhouse boasting a private courtyard, modern kitchen layout, and close proximity to top-tier schools.",
    price: 540000,
    type: "Townhouse",
    location: "Brisbane, QLD",
    bedrooms: 3,
    bathrooms: 2,
    imageUrl: "https://www.novushomes.com.au/sites/default/files/styles/card/public/2025-10/Bronte%20Cover%20Image.jpg.webp?itok=xKyVQHnz"
  },
  {
    id: 5,
    title: "Minimalist Studio Loft",
    description: "Industrial style studio loft featuring high ceilings, exposed brick elements, and optimized spaces tailored perfectly for young professionals.",
    price: 420000,
    type: "Apartment",
    location: "Sydney, NSW",
    bedrooms: 1,
    bathrooms: 1,
    imageUrl: "https://www.novushomes.com.au/sites/default/files/styles/card/public/2025-10/Bronte%20Cover%20Image.jpg.webp?itok=xKyVQHnz"
  },
  {
    id: 6,
    title: "Sunset Ridge Family Home",
    description: "Spacious family residence sitting on a massive block with a swimming pool, home theater room, and an established landscaped garden.",
    price: 950000,
    type: "House",
    location: "Adelaide, SA",
    bedrooms: 4,
    bathrooms: 2,
    imageUrl: "https://www.novushomes.com.au/sites/default/files/styles/card/public/2025-10/Bronte%20Cover%20Image.jpg.webp?itok=xKyVQHnz"
  },
  {
    id: 7,
    title: "Elite Penthouse Suite",
    description: "Top-floor luxury penthouse featuring custom marble finishes, a private rooftop deck, and absolute 360-degree harbor perspectives.",
    price: 3200000,
    type: "Apartment",
    location: "Sydney, NSW",
    bedrooms: 3,
    bathrooms: 3.5,
    imageUrl: "https://www.novushomes.com.au/sites/default/files/styles/card/public/2025-10/Bronte%20Cover%20Image.jpg.webp?itok=xKyVQHnz"
  },
  {
    id: 8,
    title: "Serene Hinterland Retreat",
    description: "A breathtaking escape nestled away in nature. Offers total privacy, vast open living spaces, and ecological sustainable solar integration.",
    price: 1450000,
    type: "Villa",
    location: "Byron Bay, NSW",
    bedrooms: 4,
    bathrooms: 3,
    imageUrl: "https://www.novushomes.com.au/sites/default/files/styles/card/public/2025-10/Bronte%20Cover%20Image.jpg.webp?itok=xKyVQHnz"
  },
  {
    id: 9,
    title: "Contemporary Metro Townhome",
    description: "Sleek architectural design split over 3 levels with premium engineered timber flooring and a dedicated workspace station.",
    price: 790000,
    type: "Townhouse",
    location: "Melbourne, VIC",
    bedrooms: 3,
    bathrooms: 2.5,
    imageUrl: "https://www.novushomes.com.au/sites/default/files/styles/card/public/2025-10/Bronte%20Cover%20Image.jpg.webp?itok=xKyVQHnz"
  },
  {
    id: 10,
    title: "Classic Heritage Bungalow",
    description: "Charming traditional brick facade fused seamlessly with a fully updated luxury interior structure and spacious entertainment deck.",
    price: 1100000,
    type: "House",
    location: "Perth, WA",
    bedrooms: 3,
    bathrooms: 2,
    imageUrl: "https://www.novushomes.com.au/sites/default/files/styles/card/public/2025-10/Bronte%20Cover%20Image.jpg.webp?itok=xKyVQHnz"
  },
  {
    id: 11,
    title: "The Horizon View Residence",
    description: "Elevated modern living showcasing sleek concrete lines, dynamic storage builds, and spectacular ocean-facing master glass frames.",
    price: 2100000,
    type: "House",
    location: "Gold Coast, QLD",
    bedrooms: 5,
    bathrooms: 4.5,
    imageUrl: "https://www.novushomes.com.au/sites/default/files/styles/card/public/2025-10/Bronte%20Cover%20Image.jpg.webp?itok=xKyVQHnz"
  },
  {
    id: 12,
    title: "Bayside Executive Apartment",
    description: "Waterfront apartment complex featuring a premium indoor gym pool access, gourmet galley kitchen, and secure underground double garage.",
    price: 850000,
    type: "Apartment",
    location: "Geelong, VIC",
    bedrooms: 2,
    bathrooms: 2,
    imageUrl: "https://www.novushomes.com.au/sites/default/files/styles/card/public/2025-10/Bronte%20Cover%20Image.jpg.webp?itok=xKyVQHnz"
  },
  {
    id: 13,
    title: "Mediteranean Inspired Sanctuary",
    description: "A beautifully styled luxury villa with arches, private tiled pool plaza, open outdoor fire pit, and fully integrated security network.",
    price: 2450000,
    type: "Villa",
    location: "Noosa, QLD",
    bedrooms: 4,
    bathrooms: 4,
    imageUrl: "https://www.novushomes.com.au/sites/default/files/styles/card/public/2025-10/Bronte%20Cover%20Image.jpg.webp?itok=xKyVQHnz"
  },
  {
    id: 14,
    title: "Affordable Family Starter",
    description: "Perfect neatly packaged cozy property for a growing family featuring a massive fenced pet-friendly yard and local park proximity.",
    price: 490000,
    type: "House",
    location: "Ipswich, QLD",
    bedrooms: 3,
    bathrooms: 1,
    imageUrl: "https://www.novushomes.com.au/sites/default/files/styles/card/public/2025-10/Bronte%20Cover%20Image.jpg.webp?itok=xKyVQHnz"
  },
  {
    id: 15,
    title: "Metropolitan Compact Townhouse",
    description: "Smart compact ecosystem focusing on minimalist space usage with high performance double-glazed window configurations.",
    price: 620000,
    type: "Townhouse",
    location: "Adelaide, SA",
    bedrooms: 2,
    bathrooms: 1.5,
    imageUrl: "https://www.novushomes.com.au/sites/default/files/styles/card/public/2025-10/Bronte%20Cover%20Image.jpg.webp?itok=xKyVQHnz"
  },
  {
    id: 16,
    title: "The Timberline Eco-Cabin",
    description: "A beautifully rustic timber cottage designed for ecological sustainability with recycled hardwoods and native garden surrounds.",
    price: 720000,
    type: "House",
    location: "Hobart, TAS",
    bedrooms: 2,
    bathrooms: 1,
    imageUrl: "https://www.novushomes.com.au/sites/default/files/styles/card/public/2025-10/Bronte%20Cover%20Image.jpg.webp?itok=xKyVQHnz"
  },
  {
    id: 17,
    title: "Skycrest Premium Skyscraper Unit",
    description: "Live amidst the clouds on the 45th floor. High gloss aesthetic tile sets, integrated sound systems, and automated temperature management.",
    price: 980000,
    type: "Apartment",
    location: "Melbourne, VIC",
    bedrooms: 2,
    bathrooms: 2,
    imageUrl: "https://www.novushomes.com.au/sites/default/files/styles/card/public/2025-10/Bronte%20Cover%20Image.jpg.webp?itok=xKyVQHnz"
  },
  {
    id: 18,
    title: "Palatial Oasis Estate",
    description: "Grand modern architecture with premium high-vaulted columns, personal tennis court layout, and separate multi-car collector showroom.",
    price: 4500000,
    type: "House",
    location: "Sydney, NSW",
    bedrooms: 6,
    bathrooms: 7,
    imageUrl: "https://www.novushomes.com.au/sites/default/files/styles/card/public/2025-10/Bronte%20Cover%20Image.jpg.webp?itok=xKyVQHnz"
  },
  {
    id: 19,
    title: "Linear Parkside Townhouse",
    description: "Stunning geometry creates a beautifully bright sequence of internal living environments tracking directly onto leafy park expanses.",
    price: 860000,
    type: "Townhouse",
    location: "Perth, WA",
    bedrooms: 3,
    bathrooms: 2.5,
    imageUrl: "https://www.novushomes.com.au/sites/default/files/styles/card/public/2025-10/Bronte%20Cover%20Image.jpg.webp?itok=xKyVQHnz"
  },
  {
    id: 20,
    title: "Cascading Waters Villa",
    description: "Infinity edge infinity pools drop smoothly down into natural canal passages. Features elite customized marble wet areas.",
    price: 2900000,
    type: "Villa",
    location: "Gold Coast, QLD",
    bedrooms: 4,
    bathrooms: 4.5,
    imageUrl: "https://www.novushomes.com.au/sites/default/files/styles/card/public/2025-10/Bronte%20Cover%20Image.jpg.webp?itok=xKyVQHnz"
  },
  {
    id: 21,
    title: "The Artisan Loft Space",
    description: "Converted historical industrial structure updated to provide premium open artistic workspaces alongside cozy sleeping configurations.",
    price: 590000,
    type: "Apartment",
    location: "Brisbane, QLD",
    bedrooms: 1,
    bathrooms: 1,
    imageUrl: "https://www.novushomes.com.au/sites/default/files/styles/card/public/2025-10/Bronte%20Cover%20Image.jpg.webp?itok=xKyVQHnz"
  },
  {
    id: 22,
    title: "Botanica Greenery Manor",
    description: "Surrounded completely by century old oak configurations. Beautiful deep natural wooden structural panels and a masonry brick cellar.",
    price: 1600000,
    type: "House",
    location: "Melbourne, VIC",
    bedrooms: 4,
    bathrooms: 3,
    imageUrl: "https://www.novushomes.com.au/sites/default/files/styles/card/public/2025-10/Bronte%20Cover%20Image.jpg.webp?itok=xKyVQHnz"
  },
  {
    id: 23,
    title: "The Edge Coastal Terrace",
    description: "Striking cliff-side structural geometry with zero edge structural frames maximizing viewing boundaries over dramatic reef breakers.",
    price: 3800000,
    type: "House",
    location: "Sydney, NSW",
    bedrooms: 4,
    bathrooms: 4,
    imageUrl: "https://www.novushomes.com.au/sites/default/files/styles/card/public/2025-10/Bronte%20Cover%20Image.jpg.webp?itok=xKyVQHnz"
  },
  {
    id: 24,
    title: "High-Density Smart Micro-Unit",
    description: "Hyper efficient spatial engineering featuring transformable hidden mechanical beds and dynamic fold-down multi-use panels.",
    price: 390000,
    type: "Apartment",
    location: "Sydney, NSW",
    bedrooms: 1,
    bathrooms: 1,
    imageUrl: "https://www.novushomes.com.au/sites/default/files/styles/card/public/2025-10/Bronte%20Cover%20Image.jpg.webp?itok=xKyVQHnz"
  },
  {
    id: 25,
    title: "Modello Courtyard Villa",
    description: "European styling enclosing a completely private sun-drenched internal dynamic fountain stone courtyard space.",
    price: 1950000,
    type: "Villa",
    location: "Adelaide, SA",
    bedrooms: 3,
    bathrooms: 3,
    imageUrl: "https://www.novushomes.com.au/sites/default/files/styles/card/public/2025-10/Bronte%20Cover%20Image.jpg.webp?itok=xKyVQHnz"
  },
  {
    id: 26,
    title: "Red-Brick Heritage Rowhouse",
    description: "Victorian historical construction values perfectly revitalized to encompass ultra luxury induction cooktops and high speed home servers.",
    price: 1350000,
    type: "Townhouse",
    location: "Melbourne, VIC",
    bedrooms: 3,
    bathrooms: 2,
    imageUrl: "https://www.novushomes.com.au/sites/default/files/styles/card/public/2025-10/Bronte%20Cover%20Image.jpg.webp?itok=xKyVQHnz"
  },
  {
    id: 27,
    title: "Highlands Panoramic Homestead",
    description: "Sprawling lifestyle acreage layout offering personal stable installations, detached guest quarters, and beautiful mountain vistas.",
    price: 1750000,
    type: "House",
    location: "Bowral, NSW",
    bedrooms: 5,
    bathrooms: 3.5,
    imageUrl: "https://www.novushomes.com.au/sites/default/files/styles/card/public/2025-10/Bronte%20Cover%20Image.jpg.webp?itok=xKyVQHnz"
  },
  {
    id: 28,
    title: "Quayside Marina Flat",
    description: "Step directly onto your boat deck from your living room balcony. Includes full access to private maritime mooring docks.",
    price: 920000,
    type: "Apartment",
    location: "Perth, WA",
    bedrooms: 2,
    bathrooms: 2,
    imageUrl: "https://www.novushomes.com.au/sites/default/files/styles/card/public/2025-10/Bronte%20Cover%20Image.jpg.webp?itok=xKyVQHnz"
  },
  {
    id: 29,
    title: "Amphora Stone Luxury Villa",
    description: "Textured natural limestone structural builds mirroring Mediterranean luxury coastlines, integrated with absolute custom glass elements.",
    price: 2700000,
    type: "Villa",
    location: "Noosa, QLD",
    bedrooms: 4,
    bathrooms: 4,
    imageUrl: "https://www.novushomes.com.au/sites/default/files/styles/card/public/2025-10/Bronte%20Cover%20Image.jpg.webp?itok=xKyVQHnz"
  },
  {
    id: 30,
    title: "Standard Suburban Oasis",
    description: "Immaculate single-story brick structure featuring open layout zones, double ovens, and a comprehensive children's play structure.",
    price: 640000,
    type: "House",
    location: "Brisbane, QLD",
    bedrooms: 3,
    bathrooms: 2,
    imageUrl: "https://www.novushomes.com.au/sites/default/files/styles/card/public/2025-10/Bronte%20Cover%20Image.jpg.webp?itok=xKyVQHnz"
  },
  {
    id: 31,
    title: "Industrial Heights Penthouse",
    description: "Polished concrete floor planes matched with structural iron frameworks and expansive double terrace zones facing west.",
    price: 2150000,
    type: "Apartment",
    location: "Melbourne, VIC",
    bedrooms: 3,
    bathrooms: 2.5,
    imageUrl: "https://www.novushomes.com.au/sites/default/files/styles/card/public/2025-10/Bronte%20Cover%20Image.jpg.webp?itok=xKyVQHnz"
  },
  {
    id: 32,
    title: "Sovereign Islands Waterfront Mews",
    description: "Elite private island enclave featuring custom commercial glass architectural sets and integrated water wellness systems.",
    price: 4100000,
    type: "House",
    location: "Gold Coast, QLD",
    bedrooms: 5,
    bathrooms: 6,
    imageUrl: "https://www.novushomes.com.au/sites/default/files/styles/card/public/2025-10/Bronte%20Cover%20Image.jpg.webp?itok=xKyVQHnz"
  },
  {
    id: 33,
    title: "The Minimal Split Townhouse",
    description: "Sharp visual angles creating beautifully segmented privacy zoning layouts ideal for co-living professional dynamics.",
    price: 740000,
    type: "Townhouse",
    location: "Sydney, NSW",
    bedrooms: 3,
    bathrooms: 3,
    imageUrl: "https://www.novushomes.com.au/sites/default/files/styles/card/public/2025-10/Bronte%20Cover%20Image.jpg.webp?itok=xKyVQHnz"
  },
  {
    id: 34,
    title: "Zen Garden Eco Villa",
    description: "Completely self-sufficient architectural marvel backed into natural rock landscapes with running internal water features.",
    price: 2300000,
    type: "Villa",
    location: "Byron Bay, NSW",
    bedrooms: 3,
    bathrooms: 3,
    imageUrl: "https://www.novushomes.com.au/sites/default/files/styles/card/public/2025-10/Bronte%20Cover%20Image.jpg.webp?itok=xKyVQHnz"
  },
  {
    id: 35,
    title: "Metro Railway Loft",
    description: "Ultra-convenient transit oriented structural build with deep acoustic soundproofing shields and high volume storage attributes.",
    price: 460000,
    type: "Apartment",
    location: "Brisbane, QLD",
    bedrooms: 1,
    bathrooms: 1,
    imageUrl: "https://www.novushomes.com.au/sites/default/files/styles/card/public/2025-10/Bronte%20Cover%20Image.jpg.webp?itok=xKyVQHnz"
  },
  {
    id: 36,
    title: "The Lookout Hill Manor",
    description: "Perched majestically over panoramic valley floors featuring massive structural cedar accents and premium commercial grade cooking suites.",
    price: 1550000,
    type: "House",
    location: "Hobart, TAS",
    bedrooms: 4,
    bathrooms: 3,
    imageUrl: "https://www.novushomes.com.au/sites/default/files/styles/card/public/2025-10/Bronte%20Cover%20Image.jpg.webp?itok=xKyVQHnz"
  },
  {
    id: 37,
    title: "The Matrix Quad Townhouse",
    description: "Ultra modern cubic concrete elevations incorporating smart access arrays and automated hidden vehicle charging banks.",
    price: 890000,
    type: "Townhouse",
    location: "Perth, WA",
    bedrooms: 3,
    bathrooms: 2.5,
    imageUrl: "https://www.novushomes.com.au/sites/default/files/styles/card/public/2025-10/Bronte%20Cover%20Image.jpg.webp?itok=xKyVQHnz"
  },
  {
    id: 38,
    title: "Aspect Blue Ocean Flat",
    description: "Stunning single level configuration matching custom limestone floor patterns directly to absolute ocean front balcony steps.",
    price: 1050000,
    type: "Apartment",
    location: "Gold Coast, QLD",
    bedrooms: 2,
    bathrooms: 2,
    imageUrl: "https://www.novushomes.com.au/sites/default/files/styles/card/public/2025-10/Bronte%20Cover%20Image.jpg.webp?itok=xKyVQHnz"
  },
  {
    id: 39,
    title: "Glasshouse Canopy Villa",
    description: "Constructed primarily using structural metal frames and premium thermal glass layout structures directly under forest cover templates.",
    price: 3100000,
    type: "Villa",
    location: "Sydney, NSW",
    bedrooms: 4,
    bathrooms: 4,
    imageUrl: "https://www.novushomes.com.au/sites/default/files/styles/card/public/2025-10/Bronte%20Cover%20Image.jpg.webp?itok=xKyVQHnz"
  },
  {
    id: 40,
    title: "Classic Sandstone Settler",
    description: "Historic structural legacy restoration offering historical visual deep textures matched alongside completely modern rear home additions.",
    price: 1400000,
    type: "House",
    location: "Adelaide, SA",
    bedrooms: 4,
    bathrooms: 2,
    imageUrl: "https://www.novushomes.com.au/sites/default/files/styles/card/public/2025-10/Bronte%20Cover%20Image.jpg.webp?itok=xKyVQHnz"
  }
];

// Complete Router Implementation
testRouter.get("/", (req, res) => {
  try {
    // Return all 40 items at once so the frontend can handle search, filtering, and pagination locally.
    res.status(200).json({
      success: true,
      totalResults: realEstateData.length,
      data: realEstateData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error fetching property listings",
    });
  }
});

export default testRouter;