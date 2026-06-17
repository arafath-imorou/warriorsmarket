'use client';

import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  ChevronRight, 
  X, 
  Phone, 
  MapPin, 
  ShoppingBag, 
  DollarSign, 
  Calendar,
  Package
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface CustomerManagerProps {
  initialCustomers: any[];
  allOrders: any[];
}

export default function CustomerManager({ initialCustomers, allOrders }: CustomerManagerProps) {
  const [customers, setCustomers] = useState<any[]>(initialCustomers);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [customerOrders, setCustomerOrders] = useState<any[]>([]);

  const handleOpenDetails = (customer: any) => {
    setSelectedCustomer(customer);
    
    // Filter orders matching customer phone
    const filteredOrders = allOrders.filter(
      (o) => o.customer_phone === customer.phone || o.customer_name === customer.name
    );
    setCustomerOrders(filteredOrders);
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery) ||
    (c.email && c.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Helper to calculate statistics for each customer
  const getCustomerStats = (phone: string, name: string) => {
    const matchingOrders = allOrders.filter(
      (o) => o.customer_phone === phone || o.customer_name === name
    );
    
    const totalSpent = matchingOrders
      .filter((o) => o.status === 'delivered' || o.status === 'validated')
      .reduce((sum, o) => sum + Number(o.total_amount), 0);
      
    return {
      ordersCount: matchingOrders.length,
      totalSpent
    };
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-dark">Gestion des Clients</h2>
        <p className="text-xs text-slate-dark/60 mt-0.5">Consulter la liste des clients et leur historique d'achat.</p>
      </div>

      {/* Search */}
      <div className="relative max-w-md w-full">
        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-dark/40">
          <Search className="h-4 w-4" />
        </span>
        <input
          type="text"
          placeholder="Rechercher par nom, téléphone, email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-white border border-primary/5 rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none focus:border-primary w-full shadow-sm"
        />
      </div>

      {/* Table list */}
      <div className="bg-white rounded-3xl border border-primary/5 shadow-sm overflow-hidden">
        {filteredCustomers.length === 0 ? (
          <div className="text-center py-16 text-slate-dark/50 text-xs flex flex-col items-center gap-3">
            <Users className="h-10 w-10 text-slate-dark/30" />
            <span>Aucun client trouvé.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-primary/5 text-slate-dark/50 font-bold uppercase bg-cream-dark/20">
                  <th className="py-4 px-6">Nom</th>
                  <th className="py-4 px-4">Téléphone</th>
                  <th className="py-4 px-4">Adresse par défaut</th>
                  <th className="py-4 px-4 text-center">N° Commandes</th>
                  <th className="py-4 px-4 text-right">Dépenses cumulées</th>
                  <th className="py-4 px-4">Inscrit le</th>
                  <th className="py-4 px-6 text-right">Détails</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/5">
                {filteredCustomers.map((c) => {
                  const stats = getCustomerStats(c.phone, c.name);
                  return (
                    <tr key={c.id} className="hover:bg-cream/20">
                      <td className="py-3 px-6 font-bold text-slate-dark">{c.name}</td>
                      <td className="py-3 px-4 font-semibold text-slate-dark">{c.phone}</td>
                      <td className="py-3 px-4 text-slate-dark/80 max-w-xs truncate">{c.address || 'Non renseignée'}</td>
                      <td className="py-3 px-4 text-center font-bold text-slate-dark">{stats.ordersCount}</td>
                      <td className="py-3 px-4 text-right font-extrabold text-primary">
                        {stats.totalSpent.toLocaleString('fr-FR')} FCFA
                      </td>
                      <td className="py-3 px-4 text-slate-dark/60">
                        {new Date(c.created_at).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="py-3 px-6 text-right">
                        <button
                          onClick={() => handleOpenDetails(c)}
                          className="inline-flex items-center gap-1 bg-cream hover:bg-cream-dark text-slate-dark px-3 py-1.5 rounded-xl font-bold border border-primary/10 transition-colors cursor-pointer"
                        >
                          <span>Historique</span>
                          <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Customer Purchase History Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl my-8">
            <div className="bg-slate-dark text-white p-6 flex justify-between items-center border-b border-white/5">
              <div>
                <h3 className="font-bold text-base">Historique Client : {selectedCustomer.name}</h3>
                <span className="text-[10px] text-white/50 block mt-0.5">
                  Membre depuis le {new Date(selectedCustomer.created_at).toLocaleDateString('fr-FR')}
                </span>
              </div>
              <button 
                onClick={() => setSelectedCustomer(null)} 
                className="text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-6 overflow-y-auto max-h-[70vh]">
              {/* Customer Coordinates Card */}
              <div className="bg-cream/40 border border-primary/5 p-5 rounded-2xl flex flex-col gap-3">
                <h4 className="font-bold text-slate-dark text-sm border-b border-primary/5 pb-2">Coordonnées</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary shrink-0" />
                    <span>Téléphone : <strong className="text-slate-dark">{selectedCustomer.phone}</strong></span>
                  </div>
                  {selectedCustomer.email && (
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-primary shrink-0">@</span>
                      <span>Email : <strong className="text-slate-dark">{selectedCustomer.email}</strong></span>
                    </div>
                  )}
                  <div className="flex items-start gap-2 sm:col-span-2">
                    <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>Adresse : <strong className="text-slate-dark">{selectedCustomer.address || 'Non renseignée'}</strong></span>
                  </div>
                </div>
              </div>

              {/* Order History */}
              <div className="flex flex-col gap-3">
                <h4 className="font-bold text-slate-dark text-sm">Liste des commandes passées</h4>
                
                {customerOrders.length === 0 ? (
                  <div className="text-center py-10 bg-cream/10 border border-primary/5 rounded-2xl text-xs text-slate-dark/50">
                    Aucune commande associée à ce client dans la base de données.
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {customerOrders.map((order) => (
                      <div 
                        key={order.id} 
                        className="bg-white border border-primary/10 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs hover:border-primary/30 transition-all"
                      >
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-primary">{order.order_number}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                              order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                              order.status === 'validated' ? 'bg-blue-100 text-blue-700' :
                              order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                              'bg-amber-100 text-amber-700'
                            }`}>
                              {order.status === 'delivered' ? 'Livré' :
                               order.status === 'validated' ? 'Validé' :
                               order.status === 'cancelled' ? 'Annulé' :
                               'En attente'}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-slate-dark/60">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(order.created_at).toLocaleDateString('fr-FR')}
                            </span>
                            <span>|</span>
                            <span>{order.delivery_zone}</span>
                          </div>
                        </div>

                        <div className="text-right flex flex-col gap-1 items-end self-end sm:self-auto">
                          <span className="font-bold text-slate-dark">{Number(order.total_amount).toLocaleString('fr-FR')} FCFA</span>
                          <span className="text-[9px] text-slate-dark/50">{order.payment_method === 'cash_on_delivery' ? 'Paiement livraison' : 'Mobile Money'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
