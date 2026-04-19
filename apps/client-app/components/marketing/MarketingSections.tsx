import Link from "next/link";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type HeroStat = {
  value: string;
  label: string;
  href?: string;
};

type HeroCard = {
  eyebrow: string;
  title: string;
  description: string;
};

type HeroSectionProps = {
  eyebrow: string;
  title: string;
  description: string;
  backgroundImage?: string;
  showcaseImage?: string;
  primaryCta: { href: string; label: string };
  secondaryCta?: { href: string; label: string };
  stats: HeroStat[];
  floatingCard: HeroCard;
};

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
  align?: "left" | "center";
  theme?: "light" | "dark";
};

type MarketingPageSectionProps = {
  children: ReactNode;
  id?: string;
  tone?: "warm" | "white" | "dark";
  className?: string;
  innerClassName?: string;
};

type EditorialHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  theme?: "light" | "dark";
};

type FeatureCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  bullets?: string[];
  delay?: string;
  /** "default" = original dark-icon card. "minimal" = refined light card for the contact section. */
  variant?: "default" | "minimal";
};

type TimelineItem = { title: string; description: string };
type TimelineProps = { items: TimelineItem[]; theme?: "light" | "dark" };

type ContactCardProps = {
  icon: LucideIcon;
  title: string;
  detail: string;
  caption: string;
  href?: string;
};

type ContactBandItem = {
  index: string;
  icon: LucideIcon;
  label: string;
  value: string;
  caption: string;
  href?: string;
};

type ServiceFeaturedCardProps = {
  tag: string;
  title: string;
  description: string;
  bullets: string[];
};

// ─── Shared Section Primitives ────────────────────────────────────────────────

export function MarketingPageSection({
  children,
  id,
  tone = "warm",
  className = "",
  innerClassName = "",
}: MarketingPageSectionProps) {
  const toneClass =
    tone === "dark"
      ? "bg-secondary-900 text-white"
      : tone === "white"
        ? "bg-white text-secondary-900"
        : "bg-[#f8f5ef] text-secondary-900";

  return (
    <section id={id} className={`${toneClass} py-20 sm:py-24 ${className}`}>
      <div className={`mx-auto max-w-7xl px-6 ${innerClassName}`}>
        {children}
      </div>
    </section>
  );
}

export function EditorialHeader({
  eyebrow,
  title,
  description,
  theme = "light",
}: EditorialHeaderProps) {
  const isDark = theme === "dark";

  return (
    <div className="mb-14 grid gap-8 lg:mb-16 lg:grid-cols-2 lg:items-end">
      <div className="motion-reveal-up">
        <div className="mb-5 flex items-center gap-3">
          <span
            className={`h-px w-8 ${isDark ? "bg-gold-400" : "bg-gold-600"}`}
          />
          <p
            className={`text-[10px] font-semibold uppercase tracking-[0.32em] ${
              isDark ? "text-gold-300" : "text-gold-700"
            }`}
          >
            {eyebrow}
          </p>
        </div>

        <h2
          className={`max-w-2xl text-4xl font-black leading-[1.05] sm:text-5xl lg:text-6xl ${
            isDark ? "text-white" : "text-secondary-900"
          }`}
        >
          {title}
        </h2>
      </div>

      <p
        className={`motion-reveal-up max-w-md self-end text-base leading-8 lg:justify-self-end ${
          isDark ? "text-secondary-300" : "text-secondary-600"
        }`}
      >
        {description}
      </p>
    </div>
  );
}

// ─── PageHero ─────────────────────────────────────────────────────────────────

export function PageHero({
  eyebrow,
  title,
  description,
  backgroundImage = "/bg-image.JPG",
  showcaseImage = "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=80",
  primaryCta,
  secondaryCta,
  stats,
  floatingCard,
}: HeroSectionProps) {
  return (
    <section className="relative isolate overflow-hidden bg-[#f8f5ef] text-secondary-900">
      <div
        className="absolute inset-0 scale-[1.02] bg-cover bg-center"
        style={{ backgroundImage: `url('${backgroundImage}')` }}
      />

      <div className="relative mx-auto grid min-h-[86vh] max-w-7xl gap-14 px-6 pt-[calc(var(--site-nav-height)+var(--site-nav-clearance))] pb-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:pt-[calc(var(--site-nav-height)+3rem)] lg:pb-24">
        <div className="motion-reveal-up max-w-3xl">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.34em] text-gold-800">
            {eyebrow}
          </p>

          <h1 className="max-w-4xl text-4xl font-black leading-[1.02] text-secondary-900 sm:text-5xl lg:text-7xl">
            {title}
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-8 text-secondary-600 sm:text-lg">
            {description}
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href={primaryCta.href}
              className="inline-flex items-center justify-center rounded-full bg-gold-gradient px-7 py-3.5 text-sm font-semibold text-secondary-950 shadow-[0_14px_34px_-16px_rgba(221,177,43,0.55)] transition duration-300 hover:-translate-y-0.5 hover:bg-gold-gradient-hover"
            >
              {primaryCta.label}
            </Link>

            {secondaryCta ? (
              <Link
                href={secondaryCta.href}
                className="inline-flex items-center justify-center rounded-full border border-secondary-300 bg-white/55 px-7 py-3.5 text-sm font-semibold text-secondary-900 backdrop-blur-sm transition duration-300 hover:border-gold-500 hover:bg-white/75"
              >
                {secondaryCta.label}
              </Link>
            ) : null}
          </div>

          <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((stat, index) => {
              const content = (
                <>
                <div className="text-2xl font-black text-secondary-900 sm:text-3xl">
                  {stat.value}
                </div>
                <div className="mt-2 text-[11px] uppercase tracking-[0.24em] text-secondary-500">
                  {stat.label}
                </div>
                </>
              );

              const className =
                "motion-reveal-up rounded-[1.5rem] border border-white/60 bg-white/48 p-5 shadow-[0_20px_60px_-36px_rgba(15,23,42,0.18)] backdrop-blur-[2px] transition duration-300";
              const style = { animationDelay: `${index * 120}ms` };

              return stat.href ? (
                <Link
                  key={stat.label}
                  href={stat.href}
                  className={`${className} block hover:-translate-y-0.5 hover:border-gold-500/60 hover:bg-white/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-600`}
                  style={style}
                >
                  {content}
                </Link>
              ) : (
                <div key={stat.label} className={className} style={style}>
                  {content}
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative">
          <div className="motion-reveal-left relative mx-auto max-w-xl overflow-hidden rounded-[2rem] border border-white/55 bg-white/35 p-5 shadow-[0_40px_100px_-40px_rgba(15,23,42,0.24)] backdrop-blur-[2px]">
            <div className="overflow-hidden rounded-[1.6rem] border border-secondary-200">
              <div
                className="aspect-[4/5] bg-cover bg-center"
                style={{ backgroundImage: `url('${showcaseImage}')` }}
              />
            </div>
          </div>

          <div className="motion-reveal-up absolute -bottom-6 left-0 max-w-xs rounded-[1.75rem] border border-white bg-white/95 p-6 shadow-[0_30px_90px_-38px_rgba(15,23,42,0.24)] backdrop-blur-[2px] sm:-left-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold-700">
              {floatingCard.eyebrow}
            </p>
            <h2 className="mt-3 text-xl font-bold text-secondary-900 sm:text-2xl">
              {floatingCard.title}
            </h2>
            <p className="mt-3 text-sm leading-7 text-secondary-600">
              {floatingCard.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── SectionHeading ───────────────────────────────────────────────────────────

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  theme = "light",
}: SectionHeadingProps) {
  const alignment =
    align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl";

  const colors =
    theme === "dark"
      ? {
          eyebrow: "text-gold-300",
          title: "text-white",
          description: "text-secondary-300",
        }
      : {
          eyebrow: "text-gold-700",
          title: "text-secondary-900",
          description: "text-secondary-600",
        };

  return (
    <div className={`${alignment} motion-reveal-up`}>
      <p className={`text-xs font-semibold uppercase tracking-[0.34em] ${colors.eyebrow}`}>
        {eyebrow}
      </p>
      <h2 className={`mt-4 text-3xl font-black leading-tight sm:text-4xl ${colors.title}`}>
        {title}
      </h2>
      <p className={`mt-4 text-base leading-8 sm:text-lg ${colors.description}`}>
        {description}
      </p>
    </div>
  );
}

// ─── FeatureCard ──────────────────────────────────────────────────────────────

export function FeatureCard({
  icon: Icon,
  title,
  description,
  bullets,
  delay,
  variant = "default",
}: FeatureCardProps) {
  // Minimal variant — used in the redesigned contact section service grid
  if (variant === "minimal") {
    return (
      <div
        className="motion-reveal-up rounded-[1.75rem] border border-[#e2d9c8] bg-white p-9 transition duration-300 hover:-translate-y-[3px] hover:shadow-[0_20px_60px_-20px_rgba(26,22,17,0.12)]"
        style={delay ? { animationDelay: delay } : undefined}
      >
        {/* Icon in a warm neutral pill */}
        <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-[10px] bg-[#f8f5ef] text-gold-700">
          <Icon className="h-5 w-5" />
        </div>

        <h3 className="text-[22px] font-bold leading-snug text-secondary-900">
          {title}
        </h3>
        <p className="mt-3 text-[13px] font-light leading-[1.8] text-secondary-500">
          {description}
        </p>

        {bullets?.length ? (
          <ul className="mt-6 space-y-[10px] border-t border-[#f0ebe0] pt-6">
            {bullets.map((bullet) => (
              <li
                key={bullet}
                className="flex items-start gap-[10px] text-[12px] leading-[1.65] text-secondary-500"
              >
                <span className="mt-[6px] h-1 w-1 flex-none rounded-full bg-gold-400" />
                {bullet}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    );
  }

  // Default variant — original design, unchanged
  return (
    <div
      className="motion-reveal-up rounded-[1.75rem] border border-secondary-200 bg-white p-7 shadow-[0_24px_80px_-38px_rgba(15,23,42,0.18)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_90px_-38px_rgba(15,23,42,0.22)]"
      style={delay ? { animationDelay: delay } : undefined}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary-900 text-gold">
        <Icon className="h-6 w-6" />
      </div>

      <h3 className="mt-6 text-2xl font-bold text-secondary-900">{title}</h3>
      <p className="mt-4 text-sm leading-7 text-secondary-600">{description}</p>

      {bullets?.length ? (
        <div className="mt-6 space-y-3">
          {bullets.map((bullet) => (
            <div
              key={bullet}
              className="flex items-start gap-3 text-sm text-secondary-700"
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-gold-700" />
              <span>{bullet}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

// ─── ContactBand ──────────────────────────────────────────────────────────────
// Unified ruled strip replacing the three separate ContactCards in the contact section.

export function ContactBand({ items }: { items: ContactBandItem[] }) {
  return (
    <div className="motion-reveal-up overflow-hidden rounded-[20px] border border-[#e2d9c8] bg-white">
      <div className="grid divide-y divide-[#e2d9c8] lg:grid-cols-3 lg:divide-x lg:divide-y-0">
        {items.map(({ index, icon: Icon, label, value, caption, href }) => {
          const inner = (
            <div className="group relative px-9 py-10 transition duration-200 hover:bg-[#fdfaf5]">
              {/* Sequential index */}
              <span className="mb-6 block font-mono text-[11px] tracking-[0.1em] text-[#c8bca8]">
                {index}
              </span>

              {/* Icon — stroke only, no filled container */}
              <Icon className="mb-5 h-[22px] w-[22px] text-gold-600" strokeWidth={1.4} />

              {/* Label */}
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-secondary-400">
                {label}
              </p>

              {/* Primary value */}
              <p className="mb-4 text-[20px] font-bold leading-snug text-secondary-900">
                {value}
              </p>

              {/* Caption */}
              <p className="text-[13px] font-light leading-[1.75] text-secondary-400">
                {caption}
              </p>

              {/* Arrow — fades in on hover for linked items */}
              {href && (
                <span className="absolute right-9 top-10 flex h-7 w-7 items-center justify-center rounded-full border border-[#e2d9c8] opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <ArrowRight className="h-3 w-3 text-gold-600" />
                </span>
              )}
            </div>
          );

          return href ? (
            <a key={label} href={href} className="block">
              {inner}
            </a>
          ) : (
            <div key={label}>{inner}</div>
          );
        })}
      </div>
    </div>
  );
}

// ─── ServiceFeaturedCard ──────────────────────────────────────────────────────
// Dark hero card used as the wide left column in the services asymmetric grid.

export function ServiceFeaturedCard({
  tag,
  title,
  description,
  bullets,
}: ServiceFeaturedCardProps) {
  return (
    <div className="motion-reveal-up relative overflow-hidden rounded-[20px] bg-secondary-900 px-10 py-11">
      <div className="absolute inset-x-0 top-0 h-1 bg-gold-gradient" />

      {/* Tag pill */}
      <span className="mb-8 inline-block rounded-full border border-gold-700/30 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.26em] text-gold-500">
        {tag}
      </span>

      <h3 className="text-[30px] font-bold leading-[1.15] text-white">
        {title}
      </h3>

      <p className="mt-4 mb-9 text-[14px] font-light leading-[1.85] text-secondary-400">
        {description}
      </p>

      <ul className="space-y-3">
        {bullets.map((bullet) => (
          <li
            key={bullet}
            className="flex items-start gap-3 text-[13px] font-light leading-[1.65] text-secondary-300"
          >
            <span className="mt-[7px] h-[5px] w-[5px] flex-none rounded-full bg-gold-600" />
            {bullet}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── HighlightBand ────────────────────────────────────────────────────────────

export function HighlightBand({
  items,
}: {
  items: { title: string; description: string }[];
}) {
  return (
    <section className="overflow-hidden border-y border-[#eadfce] bg-[#f5efe7] py-5">
      <div className="motion-drift flex min-w-max gap-6 px-6">
        {[...items, ...items].map((item, index) => (
          <div
            key={`${item.title}-${index}`}
            className="flex items-center gap-4 rounded-full border border-[#e8ddcd] bg-white/90 px-5 py-3 shadow-sm"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-700">
              {item.title}
            </span>
            <span className="text-sm text-secondary-600">{item.description}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── ContactCard (original — kept for other pages) ────────────────────────────

export function ContactCard({
  icon: Icon,
  title,
  detail,
  caption,
  href,
}: ContactCardProps) {
  const card = (
    <div className="motion-reveal-up rounded-[1.75rem] border border-secondary-200 bg-white p-6 shadow-[0_24px_80px_-38px_rgba(15,23,42,0.16)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_90px_-40px_rgba(15,23,42,0.2)]">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold-gradient text-secondary-950">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-5 text-xl font-bold text-secondary-900">{title}</h3>
      <p className="mt-3 text-lg text-gold-700">{detail}</p>
      <p className="mt-2 text-sm leading-7 text-secondary-600">{caption}</p>
    </div>
  );

  if (!href) return card;

  return (
    <a href={href} className="block">
      {card}
    </a>
  );
}

// ─── ShowcaseSplit ────────────────────────────────────────────────────────────

export function ShowcaseSplit({
  eyebrow,
  title,
  description,
  bullets,
  image,
  imageAlt,
  reverse,
}: {
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
  image: string;
  imageAlt: string;
  reverse?: boolean;
}) {
  return (
    <section className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-2 lg:items-center">
      <div className={reverse ? "order-2 lg:order-1" : ""}>
        <div className="motion-reveal-up overflow-hidden rounded-[2rem] border border-secondary-200 bg-secondary-200">
          <div
            className="aspect-[5/4] bg-cover bg-center transition duration-700 hover:scale-105"
            style={{ backgroundImage: `url('${image}')` }}
            aria-label={imageAlt}
            role="img"
          />
        </div>
      </div>

      <div className={reverse ? "order-1 lg:order-2" : ""}>
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          description={description}
        />

        <div className="mt-8 space-y-4">
          {bullets.map((bullet, index) => (
            <div
              key={bullet}
              className="motion-reveal-left flex items-start gap-3 rounded-2xl border border-secondary-200 bg-white px-5 py-4 text-sm text-secondary-700"
              style={{ animationDelay: `${index * 120}ms` }}
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-gold-700" />
              <span>{bullet}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── ProcessTimeline ──────────────────────────────────────────────────────────

export function ProcessTimeline({ items, theme = "light" }: TimelineProps) {
  const cardClasses =
    theme === "dark"
      ? "border-white/10 bg-white/[0.06] text-white shadow-[0_20px_80px_-44px_rgba(0,0,0,0.55)] backdrop-blur-sm"
      : "border-secondary-200 bg-white text-secondary-900 shadow-[0_20px_80px_-44px_rgba(15,23,42,0.14)]";

  const descriptionClasses =
    theme === "dark" ? "text-secondary-300" : "text-secondary-600";

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {items.map((item, index) => (
        <div
          key={item.title}
          className={`motion-reveal-up rounded-[1.75rem] border p-7 ${cardClasses}`}
          style={{ animationDelay: `${index * 120}ms` }}
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-gradient text-sm font-black text-secondary-950">
              0{index + 1}
            </div>

            <h3
              className={
                theme === "dark"
                  ? "text-xl font-bold text-white"
                  : "text-xl font-bold text-secondary-900"
              }
            >
              {item.title}
            </h3>
          </div>

          <p className={`mt-5 text-sm leading-7 ${descriptionClasses}`}>
            {item.description}
          </p>
        </div>
      ))}
    </div>
  );
}

// ─── PageCta ──────────────────────────────────────────────────────────────────

export function PageCta({
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: {
  title: string;
  description: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="motion-reveal-up relative overflow-hidden rounded-[20px] bg-secondary-900 px-8 py-12 text-white shadow-[0_30px_120px_-40px_rgba(15,23,42,0.35)] sm:px-12">
        <p className="text-xs font-semibold uppercase tracking-[0.34em] text-gold-300">
          Ready To Talk
        </p>

        <h2 className="mt-4 max-w-3xl text-3xl font-black leading-tight sm:text-4xl">
          {title}
        </h2>

        <p className="mt-5 max-w-2xl text-base leading-8 text-secondary-300">
          {description}
        </p>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Link
            href={primaryHref}
            className="inline-flex items-center justify-center rounded-full bg-gold-gradient px-7 py-3.5 text-sm font-semibold text-secondary-950 transition hover:bg-gold-gradient-hover"
          >
            {primaryLabel}
          </Link>

          {secondaryHref && secondaryLabel ? (
            <Link
              href={secondaryHref}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              {secondaryLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
