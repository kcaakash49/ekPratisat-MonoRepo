import {
  ArrowUpRight,
  Building2,
  FileText,
  Handshake,
  KeyRound,
  Scale,
  Search,
} from "lucide-react";
import {
  EditorialHeader,
  HighlightBand,
  MarketingPageSection,
  PageCta,
  PageHero,
} from "../../../components/marketing/MarketingSections";

const serviceHighlights = [
  {
    title: "Buy And Sell",
    description: "Practical support for serious property decisions.",
  },
  {
    title: "Rent, Lease, Sublet",
    description: "Clear help for moving property faster and cleaner.",
  },
  {
    title: "Owner Listings",
    description: "Better preparation, presentation, and inquiry handling.",
  },
  {
    title: "Paperwork Support",
    description: "Guidance around documents, process, and legal coordination.",
  },
];

export default function ServicesPage() {
  return (
    <div className="bg-[#f8f5ef]">
      <PageHero
        eyebrow="Services"
        title="Complete real estate support for every property move."
        description="EkPratishat helps people buy, sell, rent, lease, sublet, and list property with clearer information, better presentation, and practical support from first inquiry to the next step."
        primaryCta={{ href: "/contact", label: "Talk To Us" }}
        secondaryCta={{ href: "/properties", label: "Explore Properties" }}
        stats={[
          { value: "Buy", label: "Property", href: "/properties?type=buy" },
          { value: "Sell", label: "With Support", href: "/user/add-property" },
          { value: "Rent", label: "Or Lease", href: "/properties?type=rent" },
          { value: "List", label: "As Owner", href: "/user/add-property" },
        ]}
        floatingCard={{
          eyebrow: "One Stop Property Help",
          title: "The right help depends on the property decision",
          description:
            "Some users need a home. Some need a buyer. Some need documents, legal process support, or someone to make the next step less confusing.",
        }}
      />

      <HighlightBand items={serviceHighlights} />

      <MarketingPageSection>
        <EditorialHeader
          eyebrow="Core Services"
          title="Real estate help that starts with the actual problem."
          description="People come because they need to buy, sell, rent, list, or figure out what to do next, not for a brochure."
        />

        <div className="grid gap-4 lg:grid-cols-[1.45fr_1fr] lg:grid-rows-2">
          <div className="group relative row-span-2 overflow-hidden rounded-[20px] bg-secondary-900 p-9 lg:p-12">
            <div className="absolute inset-x-0 top-0 h-1 bg-gold-gradient" />
            <Search className="mb-8 h-6 w-6 text-gold-500" strokeWidth={1.5} />
            <h3 className="text-[1.85rem] font-bold leading-snug text-white">
              Property Search
            </h3>
            <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-secondary-400">
              For buyers and tenants who want a clearer way to find the right
              property, without wasting time on confusing or incomplete listings.
            </p>
            <div className="mt-10 space-y-3 border-t border-white/10 pt-8">
              {[
                "Homes, flats, land, and commercial spaces",
                "Buying, renting, lease, and sublet options",
                "Shortlisting support for serious inquiries",
              ].map((item) => (
                <p key={item} className="text-[13px] leading-relaxed text-secondary-300">
                  - {item}
                </p>
              ))}
            </div>
            <div className="mt-10 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-widest text-gold-500">
              Find A Property <ArrowUpRight className="h-3.5 w-3.5" />
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-[20px] border border-[#e2d9c8] bg-[#fdfaf5] p-8 transition duration-300 hover:bg-white">
            <Building2 className="mb-5 h-5 w-5 text-gold-700" strokeWidth={1.5} />
            <h3 className="text-[1.35rem] font-bold leading-snug text-secondary-900">
              Property Listing
            </h3>
            <p className="mt-3 text-[13px] leading-relaxed text-secondary-500">
              For owners and landlords who want their property presented properly,
              with a more organized process from day one.
            </p>
            <div className="mt-6 space-y-2 text-[12px] text-secondary-400">
              <p>- Sale and rental listing support</p>
              <p>- Property details prepared clearly</p>
              <p>- Better presentation for genuine prospects</p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-[20px] border border-[#e2d9c8] bg-white p-8 transition duration-300 hover:bg-[#fdfaf5]">
            <Handshake className="mb-5 h-5 w-5 text-gold-700" strokeWidth={1.5} />
            <h3 className="text-[1.35rem] font-bold leading-snug text-secondary-900">
              Buying &amp; Selling Support
            </h3>
            <p className="mt-3 text-[13px] leading-relaxed text-secondary-500">
              For bigger property decisions where pricing, trust, negotiation, and
              timing all matter, and you need more than a listing.
            </p>
            <div className="mt-6 space-y-2 text-[12px] text-secondary-400">
              <p>- Buyer and seller conversations</p>
              <p>- Practical next-step guidance</p>
              <p>- Support through inquiry and closing</p>
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1.6fr]">
          <div className="overflow-hidden rounded-[20px]">
            <div
              className="aspect-[4/3] bg-cover bg-center transition duration-700 hover:scale-105"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1400&q=80')",
              }}
            />
          </div>

          <div className="flex flex-col justify-center rounded-[20px] border border-[#e2d9c8] bg-[#f8f5ef] px-10 py-10">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold-700">
              Complete Property Solution
            </p>
            <blockquote className="mt-4 text-[2rem] font-black leading-[1.1] text-secondary-900">
              One place for the work{" "}
              <em className="font-serif font-normal not-italic text-gold-700">around</em>{" "}
              the property, not just the listing.
            </blockquote>
            <p className="mt-5 max-w-md text-[14px] leading-relaxed text-secondary-500">
              A property decision is rarely only about finding a space online. Owner
              conversations, site visits, documents, negotiation, verification,
              and follow-up all matter. EkPratishat makes that whole journey
              easier to handle.
            </p>
            <div className="mt-8 space-y-2.5">
              {[
                "Support for sale, rent, lease, sublet, and owner listings.",
                "Help organizing property details before serious inquiries begin.",
                "Guidance around paperwork and coordination when legal process support is needed.",
              ].map((point, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 text-[13px] text-secondary-600"
                >
                  <span className="mt-[7px] h-[4px] w-[4px] flex-none rounded-full bg-gold-600" />
                  {point}
                </div>
              ))}
            </div>
          </div>
        </div>
      </MarketingPageSection>

      <MarketingPageSection tone="white">
        <EditorialHeader
          eyebrow="What We Help With"
          title="From first inquiry to paperwork, the small steps matter."
          description="Real estate becomes stressful when every step feels separate. Our service is shaped around the full path: discovery, owner support, documentation, negotiation, and final coordination."
        />

        <div className="mb-14 space-y-3">
          {[
            {
              num: "01",
              icon: KeyRound,
              title: "Rent, Lease And Sublet",
              desc: "For users looking for spaces and owners trying to move available property with fewer delays and clearer communication.",
              tags: ["Rental & lease inquiries", "Sublet conversations", "Inspection support"],
            },
            {
              num: "02",
              icon: FileText,
              title: "Documents And Paperwork",
              desc: "For property work that needs organized documents, clear handover of information, and less confusion around required steps.",
              tags: ["Document checklist guidance", "Ownership info support", "Pre-decision coordination"],
            },
            {
              num: "03",
              icon: Scale,
              title: "Legal Process Coordination",
              desc: "For cases where users need legal or documentation-related help, we support the process and coordinate the right next step.",
              tags: ["Legal process awareness", "Coordination with relevant support", "Clear handoff for serious cases"],
            },
          ].map(({ num, icon: Icon, title, desc, tags }) => (
            <div
              key={title}
              className="group grid items-center gap-6 rounded-[16px] border border-[#ece6da] bg-[#fdfaf5] px-8 py-7 transition duration-200 hover:bg-white lg:grid-cols-[3rem_3rem_1.2fr_1.6fr_auto]"
            >
              <span className="font-mono text-[12px] text-[#c8bca8]">{num}</span>
              <Icon className="h-5 w-5 text-gold-700" strokeWidth={1.5} />
              <h3 className="text-[1.05rem] font-bold text-secondary-900">{title}</h3>
              <p className="text-[13px] leading-relaxed text-secondary-500">{desc}</p>
              <div className="flex flex-wrap gap-2 lg:justify-end">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[#e0d8ca] bg-white px-3 py-1 text-[11px] text-secondary-500"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-[20px] bg-secondary-900 p-8 lg:p-10">
          <p className="mb-8 font-mono text-[10px] uppercase tracking-[0.3em] text-gold-500">
            How It Works
          </p>
          <div className="grid gap-8 lg:grid-cols-3 lg:divide-x lg:divide-white/10">
            {[
              {
                num: "01",
                title: "Understand The Property Need",
                body: "We first understand whether the user wants to buy, sell, rent, lease, sublet, list a property, or get help with the process around it.",
              },
              {
                num: "02",
                title: "Prepare The Right Information",
                body: "Clear property details, photos, location context, owner requirements, and document readiness make every conversation more serious.",
              },
              {
                num: "03",
                title: "Move Toward The Next Step",
                body: "From inquiry to visit, negotiation, paperwork, and closing coordination, the goal is to make the path easier to follow.",
              },
            ].map((step, i) => (
              <div key={step.num} className={i > 0 ? "lg:pl-8" : ""}>
                <span className="font-mono text-[11px] text-[#5a5242]">
                  {step.num}
                </span>
                <h4 className="mt-3 text-[1.1rem] font-bold leading-snug text-white">
                  {step.title}
                </h4>
                <p className="mt-3 text-[13px] leading-relaxed text-secondary-400">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </MarketingPageSection>

      <MarketingPageSection>
        <div className="overflow-hidden rounded-[20px] border border-[#e2d9c8] bg-white">
          <div className="grid divide-y divide-[#f0ebe0] lg:grid-cols-3 lg:divide-x lg:divide-y-0">
            {[
              {
                label: "Property Seekers",
                headline: "Looking for a place",
                body: "Find a property with better context, clearer details, and a team that understands the decision is not always simple.",
                cta: "Browse Properties",
              },
              {
                label: "Property Owners",
                headline: "Listing what you own",
                body: "Prepare and present your property in a way that creates better inquiries, not random noise from people who were never serious.",
                cta: "List A Property",
              },
              {
                label: "Serious Deals",
                headline: "Making it happen",
                body: "Bring structure to bigger property conversations where documents, trust, timing, and follow-through are non-negotiable.",
                cta: "Talk To Us",
              },
            ].map(({ label, headline, body, cta }) => (
              <div
                key={label}
                className="group px-9 py-10 transition duration-200 hover:bg-[#fdfaf5]"
              >
                <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.28em] text-gold-700">
                  {label}
                </p>
                <h3 className="text-[1.4rem] font-bold leading-snug text-secondary-900">
                  {headline}
                </h3>
                <p className="mt-3 text-[13px] leading-relaxed text-secondary-500">
                  {body}
                </p>
                <div className="mt-8 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-secondary-400 transition duration-200 group-hover:text-gold-700">
                  {cta} <ArrowUpRight className="h-3 w-3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </MarketingPageSection>

      <PageCta
        title="Need help with a property?"
        description="Talk to EkPratishat for buying, selling, renting, leasing, subletting, listing support, paperwork guidance, and legal process coordination."
        primaryHref="/contact"
        primaryLabel="Contact Us"
        secondaryHref="/properties"
        secondaryLabel="Explore Properties"
      />
    </div>
  );
}
