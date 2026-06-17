import React from 'react';
import { verifyAdminSession } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import CustomerManager from '@/components/CustomerManager';

export const revalidate = 0; // Disable server-side caching for admin panel

export default async function AdminCustomersPage() {
  // 1. Verify session
  await verifyAdminSession();

  // 2. Fetch clients and all orders (for stats mapping)
  let clientsList: any[] = [];
  let ordersList: any[] = [];

  try {
    const { data: dbClients } = await supabase
      .from('warriors_clients')
      .select('*')
      .order('created_at', { ascending: false });
    
    clientsList = dbClients || [];

    const { data: dbOrders } = await supabase
      .from('warriors_orders')
      .select('customer_name, customer_phone, total_amount, status, created_at, order_number, payment_method, delivery_zone');
      
    ordersList = dbOrders || [];
  } catch (err) {
    console.warn('Failed to load database values inside customers server page.', err);
  }

  return (
    <CustomerManager 
      initialCustomers={clientsList} 
      allOrders={ordersList} 
    />
  );
}
