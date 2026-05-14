import {
  BadgeCheck,
  ClipboardList,
  Mail,
  MapPinned,
  PhoneCall,
} from "lucide-react";
import {
  ContactBand,
  EditorialHeader,
  FeatureCard,
  HighlightBand,
  MarketingPageSection,
  PageCta,
  PageHero,
  ServiceFeaturedCard,
} from "../../../components/marketing/MarketingSections";

const contactHighlights = [
  {
    title: "Property Support",
    description: "For sale, rent, listing, and buying conversations.",
  },
  {
    title: "List Property",
    description: "For owners preparing properties for rent or sale.",
  },
  {
    title: "Buyer And Seller Guidance",
    description: "For serious property decisions that need practical next steps.",
  },
  {
    title: "Office Visit",
    description: "For in-person conversations and property support.",
  },
];

const contactItems = [
  {
    index: "01",
    icon: PhoneCall,
    label: "Call us",
    value: "+977 98XXXXXXXX",
    caption:
      "Best for active property conversations, sale or listing questions, and quick team support.",
    href: "tel:+97798XXXXXXXX",
  },
  {
    index: "02",
    icon: Mail,
    label: "Email us",
    value: "hello@ekpratishat.com",
    caption:
      "Best for listing requests, detailed property questions, documents, and follow-up communication.",
    href: "mailto:hello@ekpratishat.com",
  },
  {
    index: "03",
    icon: MapPinned,
    label: "Visit us",
    value: "Kupondole, Lalitpur",
    caption:
      "Best for in-person property discussions, owner meetings, and local support.",
  },
];

export default function ContactPage() {
  return (
    <div className="bg-[#f8f5ef] text-secondary-900 dark:bg-[var(--ek-dark-page)] dark:text-[var(--ek-dark-text)]">
      <PageHero
        eyebrow="Contact"
        title="Get in touch for property listings, sales, rentals, and support."
        description="Whether you are planning to buy, sell, rent, lease, or list a property, EkPratishat keeps the next step clear and easy."
        primaryCta={{ href: "#contact-grid", label: "Contact Details" }}
        secondaryCta={{ href: "#location", label: "View Location" }}
        stats={[
          { value: "Sale", label: "Guidance" },
          { value: "List", label: "Properties" },
          { value: "Rent", label: "Options" },
          { value: "Visit", label: "Office" },
        ]}
        floatingCard={{
          eyebrow: "Property Help",
          title: "Start with the right conversation",
          description:
            "Tell us what you are trying to do: rent, list, buy, sell, or understand a property opportunity.",
        }}
      />

      <HighlightBand items={contactHighlights} />

      <MarketingPageSection id="contact-grid">
        <EditorialHeader
          eyebrow="Contact Details"
          title="Reach EkPratishat through the right channel."
          description="Use these contact paths for owner listing requests, buying or selling discussions, rental questions, property support, and office visits."
        />

        <ContactBand items={contactItems} />

        <div className="mt-20 grid gap-5 lg:grid-cols-[1.4fr_1fr_1fr] lg:items-start">
          <ServiceFeaturedCard
            tag="Property Search"
            title="Find your next property with us"
            description="For users exploring homes, land, flats, commercial spaces, sale options, or rental opportunities across Nepal."
            bullets={[
              "Homes, flats, rooms, and commercial spaces",
              "Sale and rental options in one property journey",
              "Move from interest to your next step",
            ]}
          />

          <FeatureCard
            icon={ClipboardList}
            title="Owner Listings"
            description="For owners and landlords who want their properties presented clearly and professionally."
            bullets={[
              "Sale and rental listing support",
              "Property details organized properly",
              "Better presentation for serious inquiries",
            ]}
            variant="minimal"
          />

          <FeatureCard
            icon={BadgeCheck}
            title="Buying & Selling"
            description="For serious property decisions where trust, location context, and practical guidance matter."
            bullets={[
              "Property inquiry guidance",
              "Clear next-step conversations",
              "Support for premium property movement",
            ]}
            variant="minimal"
            delay="120ms"
          />
        </div>
      </MarketingPageSection>

      <MarketingPageSection id="location" tone="white">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-stretch">
          <div className="motion-reveal-up rounded-[20px] border border-[#eadfce] bg-[#f5efe7] p-8 shadow-[0_24px_80px_-44px_rgba(15,23,42,0.12)] dark:border-[var(--ek-dark-border)] dark:bg-[var(--ek-dark-surface)] dark:shadow-[0_24px_90px_-48px_rgba(0,0,0,0.85)]">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary-900 text-gold dark:bg-[rgba(229,184,62,0.12)] dark:text-gold-400">
              <MapPinned className="h-6 w-6" />
            </div>

            <p className="mt-7 text-xs font-semibold uppercase tracking-[0.3em] text-gold-700">
              Location
            </p>

            <h2 className="mt-4 text-3xl font-black leading-tight text-secondary-900 dark:text-[var(--ek-dark-text)] sm:text-4xl">
              Visit our office for property conversations.
            </h2>

            <p className="mt-5 text-base leading-8 text-secondary-600 dark:text-[var(--ek-dark-muted)]">
              For listing discussions, buying or selling questions, rental
              support, and serious property inquiries, our office location
              makes it easier to connect with the team directly.
            </p>

            <div className="mt-8 space-y-4 text-sm text-secondary-700 dark:text-[var(--ek-dark-muted)]">
              <div className="rounded-2xl border border-secondary-200 bg-white/70 px-5 py-4 dark:border-[var(--ek-dark-border)] dark:bg-[var(--ek-dark-card-soft)]/90">
                <span className="block text-xs font-semibold uppercase tracking-[0.24em] text-gold-700">
                  Address
                </span>
                <span className="mt-1 block font-semibold text-secondary-900 dark:text-[var(--ek-dark-text)]">
                  Kupondole, Lalitpur, Nepal
                </span>
              </div>

              <div className="rounded-2xl border border-secondary-200 bg-white/70 px-5 py-4 dark:border-[var(--ek-dark-border)] dark:bg-[var(--ek-dark-card-soft)]/90">
                <span className="block text-xs font-semibold uppercase tracking-[0.24em] text-gold-700">
                  Office Visit
                </span>
                <span className="mt-1 block font-semibold text-secondary-900 dark:text-[var(--ek-dark-text)]">
                  Please call before visiting
                </span>
              </div>
            </div>
          </div>

          <div className="motion-reveal-left overflow-hidden rounded-[20px] border border-secondary-200 bg-white p-3 shadow-[0_30px_100px_-48px_rgba(15,23,42,0.24)] dark:border-[var(--ek-dark-border)] dark:bg-[var(--ek-dark-surface)] dark:shadow-[0_30px_100px_-48px_rgba(0,0,0,0.9)]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.9384770301854!2d85.31367661206454!3d27.688296326230194!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1940d71cbda5%3A0xf372327eb9fad618!2sDrip%20And%20Trip%20%7C%20Ultimate%20Vape%20Store!5e0!3m2!1sen!2snp!4v1776344532460!5m2!1sen!2snp"
              title="EkPratishat office location map"
              className="h-[420px] w-full rounded-[1.55rem] md:h-[520px]"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </MarketingPageSection>

      <PageCta
        title="Ready to talk about a property?"
        description="Reach out for buying, selling, listing, rental, lease, sublet, or paperwork-related property support."
        primaryHref="#contact-grid"
        primaryLabel="Contact Details"
        secondaryHref="/services"
        secondaryLabel="View Services"
      />
    </div>
  );
}
