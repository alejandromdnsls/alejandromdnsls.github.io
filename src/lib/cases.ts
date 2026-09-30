import { getCollection, type CollectionEntry } from 'astro:content';

/** Case studies that are live on the site. Drafts stay in the repo but are never built or linked. */
export async function getPublishedCases(
  filter: (entry: CollectionEntry<'cases'>) => boolean = () => true,
): Promise<CollectionEntry<'cases'>[]> {
  return getCollection('cases', (entry) => !entry.data.draft && filter(entry));
}

/**
 * Cases with imagery first, then the rest; `order` breaks ties within each group.
 * Returns a new array.
 */
export function sortCases(entries: CollectionEntry<'cases'>[]): CollectionEntry<'cases'>[] {
  const hasImages = (e: CollectionEntry<'cases'>) => (e.data.images.length > 0 ? 1 : 0);
  return [...entries].sort((a, b) => hasImages(b) - hasImages(a) || a.data.order - b.data.order);
}
