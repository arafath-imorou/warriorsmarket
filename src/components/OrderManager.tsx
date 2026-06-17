'use client';

import React, { useState } from 'react';
import { 
  Receipt, 
  Search, 
  ChevronRight, 
  X, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Truck,
  MessageCircle,
  Phone,
  MapPin,
  Calendar,
  Check,
  Users
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface OrderManagerProps {
  initialOrders: any[];
}

export default function OrderManager({ initialOrders }: OrderManagerProps) {
  const [orders, setOrders] = useState<any[]>(initialOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);
  
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchOrderItems = async (orderId: string) => {
    setLoadingItems(true);
    try {
      const { data, error } = await supabase
        .from('warriors_order_items')
        .select('*')
        .eq('order_id', orderId);
      
      if (error) throw error;
      setOrderItems(data || []);
    } catch (err) {
      console.warn('Failed to load order items from DB, showing empty items list.', err);
      setOrderItems([]);
    } finally {
      setLoadingItems(false);
    }
  };

  const handleOpenDetails = (order: any) => {
    setSelectedOrder(order);
    fetchOrderItems(order.id);
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('warriors_orders')
        .update({ status: newStatus, updated_at: new Date() })
        .eq('id', orderId)
        .select()
        .single();

      if (error) throw error;

      setOrders(orders.map(o => o.id === orderId ? data : o));
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(data);
      }
      showNotification('Statut de la commande mis à jour !');
    } catch (err: any) {
      console.warn('Failed to update status in DB, simulating locally', err);
      // Simulate locally if offline
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
      showNotification('Statut mis à jour localement.');
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer_phone.includes(searchQuery);

    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-dark">Suivi des Commandes</h2>
        <p className="text-xs text-slate-dark/60 mt-0.5">Consulter, valider ou modifier le statut des commandes clients.</p>
      </div>

      {/* Filter and search bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative max-w-xs w-full">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-dark/40">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Rechercher par N°, nom, tél..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white border border-primary/5 rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none focus:border-primary w-full shadow-sm"
          />
        </div>

        <div className="flex gap-2">
          {['all', 'pending', 'validated', 'delivered', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wide border transition-all cursor-pointer ${
                statusFilter === status
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-white text-slate-dark/80 border-primary/5 hover:bg-cream-dark'
              }`}
            >
              {status === 'all' ? 'Toutes' :
               status === 'pending' ? 'En attente' :
               status === 'validated' ? 'Validées' :
               status === 'delivered' ? 'Livrées' :
               'Annulées'}
            </button>
          ))}
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-dark text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 animate-slideIn">
          <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-white">
            <Check className="h-4 w-4" />
          </div>
          <p className="text-sm font-semibold">{notification}</p>
        </div>
      )}

      {/* Table list */}
      <div className="bg-white rounded-3xl border border-primary/5 shadow-sm overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16 text-slate-dark/50 text-xs flex flex-col items-center gap-3">
            <Receipt className="h-10 w-10 text-slate-dark/30" />
            <span>Aucune commande trouvée.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-primary/5 text-slate-dark/50 font-bold uppercase bg-cream-dark/20">
                  <th className="py-4 px-6">N° Commande</th>
                  <th className="py-4 px-4">Client</th>
                  <th className="py-4 px-4">Téléphone</th>
                  <th className="py-4 px-4">Zone de livraison</th>
                  <th className="py-4 px-4">Montant Total</th>
                  <th className="py-4 px-4">Date</th>
                  <th className="py-4 px-4">Statut</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/5">
                {filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-cream/20">
                    <td className="py-4 px-6 font-bold text-primary">{o.order_number}</td>
                    <td className="py-4 px-4 font-bold text-slate-dark">{o.customer_name}</td>
                    <td className="py-4 px-4 text-slate-dark/80">{o.customer_phone}</td>
                    <td className="py-4 px-4 text-slate-dark/70">{o.delivery_zone}</td>
                    <td className="py-4 px-4 font-extrabold text-slate-dark">
                      {Number(o.total_amount).toLocaleString('fr-FR')} FCFA
                    </td>
                    <td className="py-4 px-4 text-slate-dark/60">
                      {new Date(o.created_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="py-4 px-4">
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
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleOpenDetails(o)}
                        className="inline-flex items-center gap-1 bg-cream hover:bg-cream-dark text-slate-dark px-3 py-1.5 rounded-xl font-bold border border-primary/10 transition-colors cursor-pointer"
                      >
                        <span>Détails</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl my-8">
            <div className="bg-slate-dark text-white p-6 flex justify-between items-center border-b border-white/5">
              <div>
                <h3 className="font-bold text-base">Commande : {selectedOrder.order_number}</h3>
                <span className="text-[10px] text-white/50 block mt-0.5">
                  Reçue le {new Date(selectedOrder.created_at).toLocaleString('fr-FR')}
                </span>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)} 
                className="text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-6 overflow-y-auto max-h-[70vh]">
              {/* Customer Coordinates Card */}
              <div className="bg-cream/40 border border-primary/5 p-5 rounded-2xl flex flex-col gap-3">
                <h4 className="font-bold text-slate-dark text-sm border-b border-primary/5 pb-2">Informations de livraison</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary shrink-0" />
                    <span>Client : <strong className="text-slate-dark">{selectedOrder.customer_name}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary shrink-0" />
                    <span>Téléphone : <strong className="text-slate-dark">{selectedOrder.customer_phone}</strong></span>
                  </div>
                  <div className="flex items-start gap-2 sm:col-span-2">
                    <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>Adresse : <strong className="text-slate-dark">{selectedOrder.customer_address}</strong> ({selectedOrder.delivery_zone})</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs border-t border-primary/5 pt-3 mt-1">
                  <div>
                    <span className="text-slate-dark/60 block">Méthode de paiement :</span>
                    <strong className="text-slate-dark">
                      {selectedOrder.payment_method === 'cash_on_delivery' ? 'Paiement à la livraison' : 'Mobile Money'}
                    </strong>
                  </div>
                  {selectedOrder.notes && (
                    <div>
                      <span className="text-slate-dark/60 block">Instructions client :</span>
                      <p className="text-slate-dark/80 italic">{selectedOrder.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Items Table */}
              <div className="flex flex-col gap-3">
                <h4 className="font-bold text-slate-dark text-sm">Contenu du panier</h4>
                
                {loadingItems ? (
                  <div className="text-center py-6 text-xs text-slate-dark/60">Chargement des articles...</div>
                ) : (
                  <div className="border border-primary/5 rounded-2xl overflow-hidden text-xs">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-cream-dark/30 font-bold text-slate-dark border-b border-primary/5">
                          <th className="py-2.5 px-4">Nom de l'article</th>
                          <th className="py-2.5 px-4">Format</th>
                          <th className="py-2.5 px-4 text-center">Quantité</th>
                          <th className="py-2.5 px-4 text-right">Prix Unitaire</th>
                          <th className="py-2.5 px-4 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-primary/5">
                        {orderItems.map((item) => (
                          <tr key={item.id}>
                            <td className="py-2.5 px-4 font-bold text-slate-dark">{item.product_name}</td>
                            <td className="py-2.5 px-4 text-slate-dark/70">{item.format || 'Standard'}</td>
                            <td className="py-2.5 px-4 text-center font-bold text-slate-dark">{item.quantity}</td>
                            <td className="py-2.5 px-4 text-right">{Number(item.price_at_purchase).toLocaleString('fr-FR')} FCFA</td>
                            <td className="py-2.5 px-4 text-right font-bold text-primary">
                              {(item.quantity * Number(item.price_at_purchase)).toLocaleString('fr-FR')} FCFA
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Status Update Actions */}
              <div className="border-t border-primary/5 pt-5 mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-col gap-1 text-xs">
                  <span className="text-slate-dark/60">Modifier le statut de la commande :</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {[
                      { id: 'pending', label: 'En attente', color: 'bg-amber-100 hover:bg-amber-200 text-amber-700 border-amber-300' },
                      { id: 'validated', label: 'Valider', color: 'bg-blue-100 hover:bg-blue-200 text-blue-700 border-blue-300' },
                      { id: 'delivered', label: 'Livrer', color: 'bg-green-100 hover:bg-green-200 text-green-700 border-green-300' },
                      { id: 'cancelled', label: 'Annuler', color: 'bg-red-100 hover:bg-red-200 text-red-700 border-red-300' },
                    ].map((st) => (
                      <button
                        key={st.id}
                        onClick={() => handleStatusChange(selectedOrder.id, st.id)}
                        disabled={loading}
                        className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer ${st.color} ${
                          selectedOrder.status === st.id ? 'ring-2 ring-slate-dark ring-offset-1' : ''
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-right border-l-0 sm:border-l border-primary/10 pl-0 sm:pl-6 text-xs flex flex-col gap-1">
                  <div className="flex justify-between sm:justify-end gap-6 text-slate-dark/70">
                    <span>Frais de livraison:</span>
                    <span className="font-bold">{Number(selectedOrder.delivery_fee).toLocaleString('fr-FR')} FCFA</span>
                  </div>
                  <div className="flex justify-between sm:justify-end gap-6 text-sm font-black text-slate-dark border-t border-primary/5 pt-2 mt-1">
                    <span>Montant Total:</span>
                    <span className="text-primary">{Number(selectedOrder.total_amount).toLocaleString('fr-FR')} FCFA</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
