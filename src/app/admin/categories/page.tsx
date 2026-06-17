import React from 'react';
import { verifyAdminSession } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import CategoryManager from '@/components/CategoryManager';
import { FALLBACK_CATEGORIES } from '@/lib/fallbacks';

export const revalidate = 0; // Disable server-side caching for admin panel

export default async function AdminCategoriesPage() {
  // 1. Verify session
  await verifyAdminSession();

  // 2. Fetch categories from Supabase
  let categoriesList: any[] = [];

  try {
    const { data: dbCategories } = await supabase
      .from('warriors_categories')
      .select('*')
      .order('name');
    
    categoriesList = dbCategories || [];
  } catch (err) {
    console.warn('Failed to load database categories on server page. Using fallbacks.', err);
  }

  // Fallback to static mock categories if none exist
  if (categoriesList.length === 0) {
    categoriesList = FALLBACK_CATEGORIES;
  }

  return (
    <CategoryManager initialCategories={categoriesList} />
  );
}
