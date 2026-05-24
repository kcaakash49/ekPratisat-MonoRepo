import { PropertyListingSection } from "./PropertyListingSection";

export async function HomePageFeaturedProperties() {
  return (
    <PropertyListingSection
      eyebrow="Handpicked for you"
      title="Top Featured"
      accent="Listings"
      filters={{ isFeatured: true, pageSize: 6 }}
      ctaHref="/properties?isFeatured=true"
      enableContentVisibility
    />
  );
}
