import { getCachedCategories } from "../../data/categories";
import HomeHeroSearch from "./HomeHeroSearch";

// app/page.tsx (Home Page)
export default async function HomeSearch() {
  const categories = await getCachedCategories(); // Reuses your existing cache logic!

  return (
    <div>
        <HomeHeroSearch categories={categories} />

    </div>
  );
}