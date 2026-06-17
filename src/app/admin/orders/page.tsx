import React from 'react';
import { verifyAdminSession } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import OrderManager from '@/components/OrderManager';

export const revalidate = 0; // Disable server-side caching for admin panel

export default async function AdminOrdersPage() {
  // 1. Verify session
  await verifyAdminSession();

  // 2. Fetch orders from Supabase
  let ordersList: any[] = [];

  try {
    const { data: dbOrders } = await supabase
      .from('warriors_orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    ordersList = dbOrders || [];
  } catch (err) {
    console.warn('Failed to load database orders on server page. Using empty list.', err);
  }

  return (
    <OrderManager initialOrders={ordersList} />
  );
}
