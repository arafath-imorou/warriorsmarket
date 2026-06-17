import React from 'react';
import { verifyAdminSession } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import ProductManager from '@/components/ProductManager';
import { FALLBACK_CATEGORIES, FALLBACK_PRODUCTS } from '@/lib/fallbacks';

export const revalidate = 0; // Disable server-side caching for admin panel

export default async function AdminProductsPage() {
  // 1. Verify session
  await verifyAdminSession();

  // 2. Fetch categories and products
  let productsList: any[] = [];
  let categoriesList: any[] = [];

  try {
    const { data: dbCategories } = await supabase
      .from('warriors_categories')
      .select('*')
      .order('name');
    
    categoriesList = dbCategories || [];

    const { data: dbProducts } = await supabase
      .from('warriors_products')
      .select('*')
      .order('created_at', { ascending: false });

    productsList = dbProducts || [];
  } catch (err) {
    console.warn('Failed to load database values inside server page. Falling back to static values.', err);
  }

  // Fallback to static mock categories if none exist
  if (categoriesList.length === 0) {
    categoriesList = FALLBACK_CATEGORIES;
  }

  // Fallback to static mock products if none exist
  if (productsList.length === 0) {
    productsList = Object.values(FALLBACK_PRODUCTS).flat();
  }

  return (
    <ProductManager 
      initialProducts={productsList} 
      categories={categoriesList} 
    />
  );
}
