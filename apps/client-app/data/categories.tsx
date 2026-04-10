import { prisma } from "@repo/database";
import { unstable_cache } from "next/cache";

export const getCategories = unstable_cache(
  async () => {
    return await prisma.category.findMany({
      select: { id: true, name: true, imageUrl: true }
    });
  },
  ['categories-list'],
  { tags: ['categories'], revalidate: 3600 }
);


const _getCachedCategories = async () => {
  return await prisma.category.findMany({
    select: { id: true, name: true, imageUrl: true }
  });
}

export const getCachedCategories = async () => {
  return unstable_cache(
    _getCachedCategories,
    ['categories-list'],
    { tags: ['categories'], revalidate: 3600 }
  )();
}