import {
  BadgeCheck,
  Building2,
  ClipboardCheck,
  Handshake,
} from "lucide-react";
import AboutIntroMotion from "../../../components/about/AboutIntroMotion";
import {
  EditorialHeader,
  FeatureCard,
  MarketingPageSection,
  PageCta,
  ServiceFeaturedCard,
} from "../../../components/marketing/MarketingSections";

export default function AboutPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#f8f5ef] text-secondary-900 selection:bg-gold-500/30 dark:bg-[var(--ek-dark-page)] dark:text-[var(--ek-dark-text)]">
      <AboutIntroMotion />

      <MarketingPageSection>
        <EditorialHeader
          eyebrow="Who We Are"
          title="A property platform built around clarity, not confusion."
          description="EkPratishat is built for people who need real help around property: buying, selling, listing, renting, leasing, subletting, documents, and the decisions around them."
        />

        <div className="grid gap-5 lg:grid-cols-[1.35fr_1fr_1fr] lg:items-start">
          <ServiceFeaturedCard
            tag="EkPratishat"
            title="Complete property support for decisions that matter."
            description="Real estate is rarely one simple step. A buyer needs context. An owner needs better presentation. A seller needs serious inquiries. A tenant needs clarity. We are building EkPratishat around that whole property journey."
            bullets={[
              "Support for sales, rentals, lease, sublet, and owner listings.",
              "Clearer property information before serious decisions begin.",
              "Practical guidance around documents, visits, negotiation, and next steps.",
            ]}
          />

          <FeatureCard
            icon={Building2}
            title="Local Property Context"
            description="The platform is shaped for Nepal's property market, where trust, location, ownership details, and real follow-through matter."
            bullets={[
              "Built around real property behavior",
              "Useful for owners and seekers",
              "Focused on practical next steps",
            ]}
            variant="minimal"
          />

          <FeatureCard
            icon={ClipboardCheck}
            title="Listing Discipline"
            description="A property should not be presented casually. Better details, better photos, and better structure create better inquiries."
            bullets={[
              "Organized property information",
              "Cleaner listing presentation",
              "Less confusion for serious users",
            ]}
            variant="minimal"
            delay="120ms"
          />
        </div>
      </MarketingPageSection>

      <MarketingPageSection tone="white">
        <div className="grid gap-4 lg:grid-cols-[1fr_1.55fr] lg:items-stretch">
          <div className="motion-reveal-up overflow-hidden rounded-[20px]">
            <div
              className="aspect-[4/3] h-full min-h-[320px] bg-cover bg-center transition duration-700 hover:scale-105"
              style={{
                backgroundImage: "url('/marketing/about-belief-1200.jpg')",
              }}
              role="img"
              aria-label="Modern property exterior"
            />
          </div>

          <div className="motion-reveal-left flex flex-col justify-center rounded-[20px] border border-[#e2d9c8] bg-[#f8f5ef] px-8 py-10 dark:border-[var(--ek-dark-border)] dark:bg-[var(--ek-dark-surface)] sm:px-10">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold-700">
              What We Believe
            </p>

            <blockquote className="mt-4 max-w-3xl text-3xl font-black leading-[1.08] text-secondary-900 dark:text-[var(--ek-dark-text)] sm:text-4xl">
              Property should feel easier to understand before it becomes a big
              decision.
            </blockquote>

            <p className="mt-6 max-w-2xl text-[15px] leading-8 text-secondary-600 dark:text-[var(--ek-dark-muted)]">
              The role of EkPratishat is not only to show properties. It is to
              make the process around property feel clearer: who the property is
              for, what needs to be checked, what documents matter, and what the
              next step should be.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                {
                  icon: Handshake,
                  title: "Trust before action",
                },
                {
                  icon: BadgeCheck,
                  title: "Clarity before commitment",
                },
              ].map(({ icon: Icon, title }) => (
                <div
                  key={title}
                  className="flex items-center gap-3 rounded-[16px] border border-[#e2d9c8] bg-white px-4 py-4 text-sm font-semibold text-secondary-800 dark:border-[var(--ek-dark-border)] dark:bg-[var(--ek-dark-elevated)] dark:text-[var(--ek-dark-text)]"
                >
                  <Icon className="h-5 w-5 text-gold-700" strokeWidth={1.5} />
                  {title}
                </div>
              ))}
            </div>
          </div>
        </div>
      </MarketingPageSection>

      <PageCta
        title="Ready to move a property with more clarity?"
        description="Talk to EkPratishat for buying, selling, listing, rental, lease, sublet, paperwork, or property process support."
        primaryHref="/contact"
        primaryLabel="Contact Us"
        secondaryHref="/services"
        secondaryLabel="View Services"
      />
    </div>
  );
}
