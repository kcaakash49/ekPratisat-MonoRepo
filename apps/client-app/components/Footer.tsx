import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Building,
  Building2,
  Calculator,
  Facebook,
  FileCheck,
  FileText,
  Home,
  Instagram,
  Key,
  LandPlot,
  Linkedin,
  Phone,
  Search,
  Shield,
  Store,
  Twitter,
  UserPlus,
  Youtube,
} from "lucide-react";

const socialLinks = [
  { label: "Facebook", href: "#", icon: Facebook },
  { label: "Instagram", href: "#", icon: Instagram },
  { label: "Twitter", href: "#", icon: Twitter },
  { label: "YouTube", href: "#", icon: Youtube },
  { label: "LinkedIn", href: "#", icon: Linkedin },
];

const footerColumns = [
  {
    title: "Explore",
    links: [
      { label: "Buy Properties", href: "/properties?type=sale", icon: Home },
      { label: "Rent Properties", href: "/properties?type=rent", icon: Key },
      { label: "Land", href: "/category/land", icon: LandPlot },
      { label: "Apartments & Flats", href: "/category/apartment", icon: Building },
      { label: "Commercial Spaces", href: "/category/business", icon: Store },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "List a Property", href: "/user/add-property", icon: Building2 },
      { label: "Home Loans", href: "#", icon: Calculator },
      { label: "Unit Converter", href: "/unit-converter", icon: Calculator },
      { label: "Property Valuation", href: "#", icon: FileCheck },
      { label: "Buyer Checklist", href: "#", icon: Shield },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about", icon: Home },
      { label: "Contact", href: "/contact", icon: Phone },
      { label: "Blog / Guides", href: "#", icon: FileText },
      { label: "Become an Agent", href: "#", icon: UserPlus },
      { label: "Careers", href: "#", icon: Building2 },
    ],
  },
];

const revealSteps = [
  {
    title: "Search",
    icon: Search,
  },
  {
    title: "Compare",
    icon: Calculator,
  },
  {
    title: "Verify",
    icon: Shield,
  },
  {
    title: "Move",
    icon: ArrowUpRight,
  },
];

/**
 * Footer tone inversion — by design.
 *
 * Light mode page → footer UPPER section is DARK, LOWER section is LIGHT.
 * Dark mode page  → footer UPPER section is LIGHT, LOWER section is DARK.
 *
 * Every base ↔ dark: class pair below is intentionally swapped relative
 * to the rest of the app: base classes carry the dark-token values that
 * apply in light mode, dark: variants carry the light-token values that
 * apply in dark mode. Re-read this comment before "fixing" what looks
 * like a pair that's been flipped — it's load-bearing.
 */
export default function Footer() {
  return (
    <section className="relative z-0">
      <footer
        className="relative z-10 overflow-hidden border-t border-[var(--ek-dark-border)] bg-[linear-gradient(180deg,var(--ek-dark-surface),var(--ek-dark-section))] text-[var(--ek-dark-text)] shadow-[0_-2px_0_rgba(214,169,54,0.15),0_8px_48px_rgba(0,0,0,0.22),0_2px_8px_rgba(0,0,0,0.10)] dark:border-[var(--ek-border-soft)] dark:bg-[linear-gradient(180deg,var(--ek-bg-section),var(--ek-bg-main))] dark:text-[var(--ek-text-primary)]"
      >
        <div className="absolute inset-x-0 top-0 h-0.5 bg-[linear-gradient(90deg,transparent,rgba(229,184,62,0.42),rgba(255,235,170,0.88),rgba(229,184,62,0.42),transparent)]" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="grid gap-7 border-b border-[var(--ek-dark-border)] py-9 dark:border-[var(--ek-border-soft)] lg:grid-cols-[minmax(0,0.9fr)_minmax(320px,0.55fr)] lg:items-start lg:gap-12">
            <div>
              <p className="mb-3 text-[10px] font-black uppercase tracking-[0.34em] text-[var(--ek-dark-gold)] dark:text-[var(--ek-gold-text)]">
                Ekpratishat Real Estate
              </p>
              <h2 className="max-w-3xl text-2xl font-black leading-tight tracking-tight text-[var(--ek-dark-text)] dark:text-[var(--ek-text-primary)] sm:text-4xl lg:text-[2.5rem]">
                Property decisions made clearer.
              </h2>

              <p className="mt-3 text-sm font-bold text-[var(--ek-dark-gold)] dark:text-[var(--ek-gold-text)]">
                &ldquo;एक प्रतिशत - उत्कृष्ट सेवा, उत्तम कारोबार।&rdquo;
              </p>

              <div className="mt-5 flex w-fit flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl border border-[var(--ek-dark-border)] bg-[rgba(255,255,255,0.035)] px-4 py-3 shadow-[0_18px_36px_rgba(0,0,0,0.18)] dark:border-[var(--ek-border-soft)] dark:bg-[rgba(255,253,248,0.50)] dark:shadow-[0_14px_34px_rgba(15,23,42,0.05)]">
                <span className="text-[10px] font-black uppercase tracking-[0.22em] text-[var(--ek-dark-gold)] dark:text-[var(--ek-gold-text)]">
                  Need help choosing?
                </span>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 text-sm font-black text-[var(--ek-dark-text)] transition-colors hover:text-[var(--ek-dark-gold)] dark:text-[var(--ek-text-primary)] dark:hover:text-[var(--ek-gold-text)]"
                >
                  Contact Support
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                {socialLinks.map(({ href, icon: Icon, label }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--ek-dark-border)] bg-[rgba(255,255,255,0.045)] text-[var(--ek-dark-muted)] transition-colors hover:border-[var(--ek-dark-border-strong)] hover:bg-white/[0.075] hover:text-[var(--ek-dark-gold)] dark:border-[var(--ek-border-soft)] dark:bg-[rgba(255,253,248,0.68)] dark:text-[var(--ek-text-secondary)] dark:hover:border-[var(--ek-border-strong)] dark:hover:bg-[var(--ek-bg-card)] dark:hover:text-[var(--ek-gold-text)]"
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--ek-dark-border)] bg-[rgba(255,255,255,0.04)] p-5 shadow-[0_18px_42px_rgba(0,0,0,0.20)] dark:border-[var(--ek-border-soft)] dark:bg-[rgba(255,253,248,0.62)] dark:shadow-[0_16px_36px_rgba(15,23,42,0.06)]">
              <p className="mb-3 text-[10px] font-black uppercase tracking-[0.22em] text-[var(--ek-dark-soft)] dark:text-[var(--ek-text-muted)]">
                Get the app
              </p>
              <div className="flex flex-wrap gap-2">
                <a href="#" className="inline-block w-fit transition-transform hover:-translate-y-0.5">
                  <span className="relative block h-9 w-28">
                    <Image
                      src="/google-play.png"
                      alt="Download on Google Play"
                      fill
                      className="object-contain"
                    />
                  </span>
                </a>
                <a href="#" className="inline-block w-fit transition-transform hover:-translate-y-0.5">
                  <span className="relative block h-9 w-28">
                    <Image
                      src="/app-store.png"
                      alt="Download on App Store"
                      fill
                      className="object-contain"
                    />
                  </span>
                </a>
              </div>
            </div>
          </div>

          <div className="border-b border-[var(--ek-dark-border)] py-8 dark:border-[var(--ek-border-soft)]">
            <div className="grid gap-8 sm:grid-cols-3">
              {footerColumns.map((column) => (
                <div key={column.title}>
                  <h3 className="mb-4 text-sm font-black uppercase tracking-[0.2em] text-[var(--ek-dark-text)] dark:text-[var(--ek-text-primary)]">
                    {column.title}
                  </h3>
                  <ul className="space-y-3">
                    {column.links.map(({ href, icon: Icon, label }) => (
                      <li key={label}>
                        <Link
                          href={href}
                          className="group inline-flex items-center gap-2 text-sm font-medium text-[var(--ek-dark-muted)] transition-colors hover:text-[var(--ek-dark-gold)] dark:text-[var(--ek-text-secondary)] dark:hover:text-[var(--ek-gold-text)]"
                        >
                          <Icon className="h-4 w-4 text-[var(--ek-dark-soft)] transition-colors group-hover:text-[var(--ek-dark-gold)] dark:text-[var(--ek-text-muted)] dark:group-hover:text-[var(--ek-gold-text)]" />
                          {label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <section className="sticky bottom-0 z-0 min-h-[var(--footer-reveal-min)] overflow-hidden bg-[linear-gradient(160deg,#fffaf0_0%,#f7f0df_58%,#eadcc4_100%)] text-[var(--ek-text-primary)] [--footer-reveal-min:380px] max-sm:[--footer-reveal-min:440px] dark:bg-[linear-gradient(160deg,#18150f_0%,#211a12_56%,#11100c_100%)] dark:text-[var(--ek-dark-text)] lg:[--footer-reveal-min:340px]">
        <div
          className="relative z-10 mx-auto flex min-h-[var(--footer-reveal-min)] w-full max-w-7xl flex-col justify-between gap-4 px-4 pb-5 sm:gap-6 sm:px-6 sm:pb-7 lg:px-8"
          style={{
            paddingTop:
              "calc(clamp(1.25rem, 3svh, 2rem) + max(0px, calc(var(--site-nav-height) + 0.75rem + var(--footer-reveal-min) - 100svh)))",
          }}
        >
          <div>
            <p className="mb-1.5 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-[var(--ek-gold-text)] dark:text-[var(--ek-dark-gold)] sm:tracking-[0.30em]">
              <span className="h-px w-6 bg-gold-gradient" />
              Property Pathways
            </p>
            <h2 className="max-w-3xl text-[1.9rem] font-black leading-[1.05] tracking-tight text-[var(--ek-text-primary)] dark:text-[var(--ek-dark-text)] sm:text-4xl sm:leading-tight">
              A clearer property <span className="text-[var(--ek-gold-text)] dark:text-[var(--ek-dark-gold)]">journey.</span>
            </h2>
            <p className="mt-2.5 max-w-2xl text-sm leading-6 text-[var(--ek-text-secondary)] dark:text-[var(--ek-dark-muted)]">
              Know what to trust, what to compare, and what to do next.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-x-5 gap-y-4 sm:grid-cols-4 sm:gap-x-6">
              {revealSteps.map(({ title, icon: Icon }) => (
                <div
                  key={title}
                  className="flex items-center gap-3 sm:flex-col sm:items-start"
                >
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[var(--ek-border-strong)] bg-[linear-gradient(145deg,rgba(255,253,248,0.92),rgba(248,241,227,0.62))] text-[var(--ek-gold-text)] shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_14px_28px_rgba(154,106,0,0.10)] dark:border-[rgba(229,184,62,0.22)] dark:bg-[linear-gradient(145deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] dark:text-[var(--ek-dark-gold)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_14px_28px_rgba(0,0,0,0.24)]">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <h3 className="text-xs font-black uppercase tracking-[0.18em] text-[var(--ek-text-primary)] drop-shadow-[0_1px_0_rgba(255,255,255,0.5)] dark:text-[var(--ek-dark-text)] dark:drop-shadow-[0_1px_0_rgba(255,255,255,0.05)] sm:mt-1">
                    {title}
                  </h3>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-3 border-t border-[var(--ek-border-soft)] pt-4 dark:border-[rgba(229,184,62,0.14)] sm:gap-5 lg:grid-cols-[auto_1fr_auto] lg:items-center">
            <Link
              href="/properties"
              className="inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-gold-gradient px-5 py-2.5 text-sm font-black text-[#151006] shadow-[0_14px_30px_rgba(0,0,0,0.24)] transition-transform hover:-translate-y-0.5 hover:bg-gold-gradient-hover sm:px-6 sm:py-3"
            >
              Start Your Property Journey
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <p className="text-xs leading-5 text-[var(--ek-text-muted)] dark:text-[var(--ek-dark-soft)] sm:leading-6">
              Ekpratishat.com is a real estate information platform and does not directly manage transactions.
            </p>
            <div className="flex flex-wrap gap-x-2.5 gap-y-1.5 text-xs font-bold leading-5 text-[var(--ek-text-secondary)] dark:text-[var(--ek-dark-muted)] sm:gap-x-3 sm:gap-y-2 lg:justify-end">
              <span>© {new Date().getFullYear()} Ekpratishat. All rights reserved.</span>
              <Link href="#" className="hover:text-[var(--ek-gold-text)] dark:hover:text-[var(--ek-dark-gold)]">Privacy</Link>
              <span>·</span>
              <Link href="#" className="hover:text-[var(--ek-gold-text)] dark:hover:text-[var(--ek-dark-gold)]">Terms</Link>
              <span>·</span>
              <Link href="#" className="hover:text-[var(--ek-gold-text)] dark:hover:text-[var(--ek-dark-gold)]">Disclaimer</Link>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
