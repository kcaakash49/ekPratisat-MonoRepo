import { PropertyListingSection } from "./PropertyListingSection";

export default async function RecentListings() {
  return (
    <PropertyListingSection
      eyebrow="Handpicked for you"
      title="Recent"
      accent="Listings"
      filters={{}}
      ctaHref="/properties"
    />
  );
}
