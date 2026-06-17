import React from 'react';
import Link from 'next/link';
import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  Receipt,
  Calendar,
  ChevronRight,
  Plus,
  ArrowRight,
  TrendingDown
} from 'lucide-react';
import { verifyAdminSession } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

interface TopProduct {
  name: string;
  salesCount: number;
  revenue: number;
}

export default async function AdminDashboard() {
  // 1. Verify admin session on server side
  const admin = await verifyAdminSession();

  // 2. Initialize default dashboard metrics
  let totalOrders = 0;
  let totalRevenue = 0;
  let clientCount = 0;
  let recentOrders: any[] = [];
  let recentClients: any[] = [];
  let topProducts: TopProduct[] = [];

  try {
    // 3. Fetch metrics from Supabase
    const { count: ordersCount } = await supabase
      .from('warriors_orders')
      .select('*', { count: 'exact', head: true });
    
    totalOrders = ordersCount || 0;

    const { data: revenueData } = await supabase
      .from('warriors_orders')
      .select('total_amount')
      .in('status', ['validated', 'delivered']); // Sum only validated or delivered

    totalRevenue = revenueData?.reduce((sum, item) => sum + Number(item.total_amount), 0) || 0;

    const { count: clientsCount } = await supabase
      .from('warriors_clients')
      .select('*', { count: 'exact', head: true });
    
    clientCount = clientsCount || 0;

    // Recent orders
    const { data: dbRecentOrders } = await supabase
      .from('warriors_orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
    
    recentOrders = dbRecentOrders || [];

    // Recent clients
    const { data: dbRecentClients } = await supabase
      .from('warriors_clients')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
      
    recentClients = dbRecentClients || [];

    // Top selling products (simplified aggregate)
    const { data: items } = await supabase
      .from('warriors_order_items')
      .select('product_name, quantity, price_at_purchase');

    if (items && items.length > 0) {
      const salesMap: Record<string, { qty: number; rev: number }> = {};
      items.forEach((item) => {
        if (!salesMap[item.product_name]) {
          salesMap[item.product_name] = { qty: 0, rev: 0 };
        }
        salesMap[item.product_name].qty += item.quantity;
        salesMap[item.product_name].rev += item.quantity * Number(item.price_at_purchase);
      });

      topProducts = Object.entries(salesMap)
        .map(([name, stats]) => ({
          name,
          salesCount: stats.qty,
          revenue: stats.rev,
        }))
        .sort((a, b) => b.salesCount - a.salesCount)
        .slice(0, 5);
    }
  } catch (err) {
    console.warn('Failed to load dashboard metrics from Supabase database.', err);
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Top Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-primary/5 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-dark">Bonjour, {admin.username} 👋</h1>
          <p className="text-xs text-slate-dark/60 mt-1">Voici le point d'activité global pour Warriors Market.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-dark/70 bg-cream px-4 py-2.5 rounded-xl border border-primary/5">
          <Calendar className="h-4 w-4 text-primary" />
          <span>{new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue Card */}
        <div className="bg-white p-6 rounded-3xl border border-primary/5 shadow-sm flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-slate-dark/50 uppercase">Chiffre d'affaires</span>
            <span className="text-2xl font-black text-slate-dark">{totalRevenue.toLocaleString('fr-FR')} FCFA</span>
            <span className="text-[10px] text-green-600 font-semibold flex items-center gap-0.5 mt-1">
              <TrendingUp className="h-3 w-3" />
              <span>Cumul validé / livré</span>
            </span>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <TrendingUp className="h-6 w-6" />
          </div>
        </div>

        {/* Orders Card */}
        <div className="bg-white p-6 rounded-3xl border border-primary/5 shadow-sm flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-slate-dark/50 uppercase">Commandes</span>
            <span className="text-2xl font-black text-slate-dark">{totalOrders}</span>
            <span className="text-[10px] text-slate-dark/60 font-semibold flex items-center gap-0.5 mt-1">
              <Receipt className="h-3 w-3" />
              <span>Commandes totales</span>
            </span>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
            <ShoppingBag className="h-6 w-6" />
          </div>
        </div>

        {/* Clients Card */}
        <div className="bg-white p-6 rounded-3xl border border-primary/5 shadow-sm flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-slate-dark/50 uppercase">Clients</span>
            <span className="text-2xl font-black text-slate-dark">{clientCount}</span>
            <span className="text-[10px] text-slate-dark/60 font-semibold flex items-center gap-0.5 mt-1">
              <Users className="h-3 w-3" />
              <span>Clients enregistrés</span>
            </span>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
            <Users className="h-6 w-6" />
          </div>
        </div>

        {/* Catalog quick access */}
        <div className="bg-gradient-to-br from-primary to-primary-dark text-white p-6 rounded-3xl shadow-sm flex flex-col justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold">Actions rapides</h4>
            <p className="text-[10px] text-white/70 mt-1">Gérer les stocks et ajouter de nouveaux produits au catalogue.</p>
          </div>
          <Link
            href="/admin/products"
            className="self-start inline-flex items-center gap-1.5 text-xs font-bold bg-white text-primary px-4 py-2.5 rounded-xl hover:bg-cream transition-colors"
          >
            <span>Nouveau produit</span>
            <Plus className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Col: Recent Orders */}
        <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-3xl border border-primary/5 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-dark">Commandes Récentes</h3>
            <Link href="/admin/orders" className="text-xs font-bold text-primary hover:underline flex items-center gap-0.5">
              <span>Voir tout</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="text-center py-12 text-slate-dark/50 text-xs">
              Aucune commande enregistrée pour le moment.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-primary/5 text-slate-dark/50 font-bold uppercase">
                    <th className="pb-3 pr-2">N° Commande</th>
                    <th className="pb-3 px-2">Client</th>
                    <th className="pb-3 px-2">Zone</th>
                    <th className="pb-3 px-2">Total</th>
                    <th className="pb-3 px-2">Statut</th>
                    <th className="pb-3 pl-2 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/5">
                  {recentOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-cream/40">
                      <td className="py-3 pr-2 font-bold text-slate-dark">
                        <Link href="/admin/orders" className="text-primary hover:underline">
                          {o.order_number}
                        </Link>
                      </td>
                      <td className="py-3 px-2 font-semibold text-slate-dark">{o.customer_name}</td>
                      <td className="py-3 px-2 text-slate-dark/70">{o.delivery_zone}</td>
                      <td className="py-3 px-2 font-bold text-slate-dark">{Number(o.total_amount).toLocaleString('fr-FR')} FCFA</td>
                      <td className="py-3 px-2">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          o.status === 'delivered' ? 'bg-green-100 text-green-700' :
                          o.status === 'validated' ? 'bg-blue-100 text-blue-700' :
                          o.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {o.status === 'delivered' ? 'Livré' :
                           o.status === 'validated' ? 'Validé' :
                           o.status === 'cancelled' ? 'Annulé' :
                           'En attente'}
                        </span>
                      </td>
                      <td className="py-3 pl-2 text-right text-slate-dark/60">
                        {new Date(o.created_at).toLocaleDateString('fr-FR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Col: Top selling & recent clients */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          {/* Top Products */}
          <div className="bg-white p-6 rounded-3xl border border-primary/5 shadow-sm">
            <h3 className="text-base font-bold text-slate-dark mb-4">Produits populaires</h3>
            {topProducts.length === 0 ? (
              <div className="text-center py-6 text-slate-dark/50 text-xs">
                Aucune vente enregistrée.
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {topProducts.map((p, idx) => (
                  <div key={p.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <span className="h-6 w-6 rounded-lg bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="font-semibold text-slate-dark truncate max-w-[120px]">{p.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-dark block">{p.salesCount} ventes</span>
                      <span className="text-[10px] text-slate-dark/60">{p.revenue.toLocaleString('fr-FR')} FCFA</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Clients */}
          <div className="bg-white p-6 rounded-3xl border border-primary/5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-dark">Nouveaux Clients</h3>
              <Link href="/admin/customers" className="text-xs font-bold text-primary hover:underline">
                Tous
              </Link>
            </div>

            {recentClients.length === 0 ? (
              <div className="text-center py-6 text-slate-dark/50 text-xs">
                Aucun client enregistré.
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {recentClients.map((c) => (
                  <div key={c.id} className="flex items-center justify-between text-xs border-b border-primary/5 pb-3 last:border-none last:pb-0">
                    <div>
                      <span className="font-bold text-slate-dark block">{c.name}</span>
                      <span className="text-[10px] text-slate-dark/60">{c.phone}</span>
                    </div>
                    <span className="text-[10px] text-slate-dark/50">
                      {new Date(c.created_at).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
