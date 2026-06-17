import { MetadataRoute } from 'next';
import { FALLBACK_CATEGORIES } from '@/lib/fallbacks';
import { supabase } from '@/lib/supabase';

export const revalidate = 86400; // Cache sitemap for 24 hours

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://ampktfwcpopkomrsckjm.supabase.co'; // Replace with production URL when deployed

  // 1. Static routes
  const staticRoutes = [
    '',
    '/gros',
    '/livraison',
    '/about',
    '/contact',
    '/cart',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // 2. Dynamic category routes
  let categoryRoutes = FALLBACK_CATEGORIES.map((c) => ({
    url: `${baseUrl}/catalog/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  try {
    const { data: dbCategories } = await supabase
      .from('warriors_categories')
      .select('slug');

    if (dbCategories && dbCategories.length > 0) {
      categoryRoutes = dbCategories.map((c) => ({
        url: `${baseUrl}/catalog/${c.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
    }
  } catch (err) {
    console.warn('Sitemap generator: Failed to fetch categories from Supabase, using fallbacks.');
  }

  return [...staticRoutes, ...categoryRoutes];
}
