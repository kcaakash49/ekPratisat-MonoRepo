/**
 * SectionHeader — centered poster-style header used by homepage sections
 * (Categories, PropertyListingSection). Three pieces, vertically stacked:
 *   1. eyebrow (gold, uppercase, tracked)
 *   2. title with an accent word that flips to gold
 *   3. gold-gradient hairline underneath
 *
 * For editorial intros that need a description paragraph or left
 * alignment, use `SectionHeading` / `EditorialHeader` from
 * `components/marketing/MarketingSections.tsx` instead.
 *
 * Variants exist because the original homepage shipped two slightly
 * different sizes — `sm` for Categories, `md` for the listing sections.
 * The class strings are preserved verbatim from the originals so the
 * extraction is purely structural; no visual change.
 */

type SectionHeaderVariant = "sm" | "md";

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  /** The trailing word that renders in gold (e.g. "Properties" in "Browse Properties"). */
  accent: string;
  variant?: SectionHeaderVariant;
};

const VARIANT_CLASSES: Record<
  SectionHeaderVariant,
  { wrapper: string; eyebrow: string; title: string; line: string }
> = {
  sm: {
    wrapper: "text-center mb-12",
    eyebrow:
      "text-[var(--ek-gold-text)] font-bold tracking-[0.2em] text-sm uppercase dark:text-[var(--ek-dark-gold)]",
    title:
      "text-[var(--ek-text-primary)] dark:text-[var(--ek-dark-text)] text-3xl md:text-4xl font-black mt-2",
    line: "h-1 w-20 bg-gold-gradient mx-auto mt-4 rounded-full",
  },
  md: {
    wrapper: "text-center mb-16",
    eyebrow:
      "text-[var(--ek-gold-text)] font-bold tracking-[0.3em] text-xs md:text-sm uppercase dark:text-[var(--ek-dark-gold)]",
    title:
      "text-[var(--ek-text-primary)] dark:text-[var(--ek-dark-text)] text-3xl md:text-5xl font-black mt-3",
    line: "h-1 w-24 bg-gold-gradient mx-auto mt-6 rounded-full shadow-sm",
  },
};

export default function SectionHeader({
  eyebrow,
  title,
  accent,
  variant = "md",
}: SectionHeaderProps) {
  const styles = VARIANT_CLASSES[variant];

  return (
    <div className={styles.wrapper}>
      <span className={styles.eyebrow}>{eyebrow}</span>
      <h2 className={styles.title}>
        {title}{" "}
        <span className="text-[var(--ek-gold-text)] dark:text-[var(--ek-dark-gold)]">
          {accent}
        </span>
      </h2>
      <div className={styles.line} />
    </div>
  );
}
