'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowLeft, 
  MessageCircle, 
  CheckCircle2, 
  MapPin, 
  FileText,
  CreditCard,
  ChevronRight
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/lib/supabase';

const DELIVERY_OPTIONS = [
  { id: 'cotonou', name: 'Cotonou (Intra Muros)', fee: 1500 },
  { id: 'calavi', name: 'Calavi / Godomey', fee: 2000 },
  { id: 'porto-novo', name: 'Porto-Novo / Ouidah', fee: 3000 },
  { id: 'autre', name: 'Autres villes du Bénin', fee: 4000 }
];

export default function CartPage() {
  const { 
    cart, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    cartTotal, 
    cartCount 
  } = useCart();

  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    address: '',
    delivery_zone: 'cotonou',
    payment_method: 'cash_on_delivery',
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [createdOrderNumber, setCreatedOrderNumber] = useState('');

  const selectedZone = DELIVERY_OPTIONS.find(z => z.id === customer.delivery_zone) || DELIVERY_OPTIONS[0];
  const deliveryFee = selectedZone.fee;
  const grandTotal = cartTotal + deliveryFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setLoading(true);
    const orderNumber = `WM-${Date.now().toString().slice(-6)}`;
    
    try {
      // 1. Save client info first
      await supabase
        .from('warriors_clients')
        .insert([{ 
          name: customer.name, 
          phone: customer.phone, 
          address: customer.address 
        }])
        .select();
        // Ignore unique constraint conflict on phone - if client exists, it's fine

      // 2. Insert order
      const { data: orderData, error: orderError } = await supabase
        .from('warriors_orders')
        .insert([
          {
            order_number: orderNumber,
            customer_name: customer.name,
            customer_phone: customer.phone,
            customer_address: customer.address,
            delivery_zone: selectedZone.name,
            delivery_fee: deliveryFee,
            total_amount: grandTotal,
            payment_method: customer.payment_method,
            notes: customer.notes,
            status: 'pending'
          }
        ])
        .select()
        .single();

      if (orderError) throw orderError;

      // 3. Insert order items
      if (orderData) {
        const orderItems = cart.map(item => ({
          order_id: orderData.id,
          product_id: item.id.startsWith('v-') || item.id.startsWith('e-') || item.id.startsWith('f-') || item.id.startsWith('t-') ? null : item.id, // Set null if fake UUID
          product_name: item.name,
          quantity: item.quantity,
          price_at_purchase: item.price,
          format: item.format || null
        }));

        const { error: itemsError } = await supabase
          .from('warriors_order_items')
          .insert(orderItems);

        if (itemsError) throw itemsError;
      }

      setCreatedOrderNumber(orderNumber);
      
      // 4. Generate WhatsApp redirection
      triggerWhatsAppMessage(orderNumber);
      
      // 5. Success state
      setOrderSuccess(true);
      clearCart();
    } catch (err: any) {
      console.warn('Supabase checkout failed (offline/network), falling back to pure WhatsApp checkout', err);
      // Fallback: still process checkout on WhatsApp but warn client or just make it smooth
      setCreatedOrderNumber(orderNumber);
      triggerWhatsAppMessage(orderNumber);
      setOrderSuccess(true);
      clearCart();
    } finally {
      setLoading(false);
    }
  };

  const triggerWhatsAppMessage = (orderNum: string) => {
    // Generate text formatting
    let itemsText = '';
    cart.forEach((item, index) => {
      const formatText = item.format ? ` (${item.format})` : '';
      itemsText += `${index + 1}. *${item.name}*${formatText}\n   Qté: ${item.quantity} x ${item.price} FCFA = *${item.quantity * item.price} FCFA*\n`;
    });

    const paymentText = customer.payment_method === 'cash_on_delivery' ? 'Paiement à la livraison' : 'Mobile Money';

    const text = `🛒 *NOUVELLE COMMANDE WARRIORS MARKET*
N° Commande : *${orderNum}*

*Articles :*
${itemsText}
*Sous-Total :* ${cartTotal} FCFA
*Livraison (${selectedZone.name}) :* ${deliveryFee} FCFA
*TOTAL À PAYER :* *${grandTotal} FCFA*

*Coordonnées Client :*
- Nom : ${customer.name}
- Téléphone : ${customer.phone}
- Adresse : ${customer.address}
- Paiement : ${paymentText}
${customer.notes ? `- Notes : ${customer.notes}` : ''}

Merci de me confirmer ma commande et l'heure de livraison !`;

    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/2290153302051?text=${encodedText}`, '_blank');
  };

  if (orderSuccess) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-6 shadow-inner animate-bounce">
          <CheckCircle2 className="h-12 w-12" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-dark">Commande Envoyée !</h2>
        <p className="text-slate-dark/70 text-sm mt-3 max-w-md mx-auto leading-relaxed">
          Votre commande *{createdOrderNumber}* a été enregistrée et transmise sur WhatsApp. Un conseiller Warriors Market va vous recontacter d'ici quelques minutes.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-10">
          <Link href="/" className="bg-primary hover:bg-primary-dark text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-md">
            Continuer mes achats
          </Link>
          <button 
            onClick={() => triggerWhatsAppMessage(createdOrderNumber)}
            className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white px-6 py-3.5 rounded-xl font-bold transition-colors cursor-pointer"
          >
            <MessageCircle className="h-4.5 w-4.5 fill-current" />
            <span>Renvoyer sur WhatsApp</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-cream pb-20">
      {/* 1. Header Banner */}
      <div className="bg-slate-dark text-white py-12 border-b-4 border-accent">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-white/60">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-accent">Panier</span>
          </div>
          <h1 className="text-3xl font-black">Mon Panier d'Achat</h1>
          <p className="text-gray-300 text-xs">{cartCount} article(s) sélectionné(s)</p>
        </div>
      </div>

      {/* 2. Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12">
        {cart.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-primary/5 shadow-sm">
            <ShoppingBag className="h-16 w-16 text-slate-dark/30 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-dark">Votre panier est vide</h2>
            <p className="text-slate-dark/60 text-sm mt-2 mb-8">N'hésitez pas à parcourir nos rayons pour faire vos choix.</p>
            <Link href="/" className="bg-primary text-white px-8 py-4 rounded-xl font-bold hover:bg-primary-dark shadow-md transition-colors">
              Découvrir nos produits
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Cart Items List */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <div className="bg-white p-6 rounded-3xl border border-primary/5 shadow-sm">
                <div className="flex items-center justify-between mb-6 border-b border-primary/5 pb-4">
                  <h3 className="text-lg font-bold text-slate-dark">Liste des articles</h3>
                  <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline">
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Ajouter d'autres produits</span>
                  </Link>
                </div>

                <div className="flex flex-col gap-5 divide-y divide-primary/5">
                  {cart.map((item) => {
                    const uniqueKey = `${item.id}-${item.format || ''}`;
                    
                    return (
                      <div key={uniqueKey} className="flex flex-row items-center gap-3 pt-5 first:pt-0 justify-between">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative h-14 w-14 sm:h-16 sm:w-16 rounded-xl overflow-hidden bg-cream-dark/30 shrink-0 border border-primary/10">
                            {item.image_url ? (
                              <Image
                                src={item.image_url}
                                alt={item.name}
                                fill
                                className="object-contain p-1"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary">
                                <ShoppingBag className="h-5 w-5" />
                              </div>
                            )}
                          </div>

                          {/* Title & Format */}
                          <div className="min-w-0">
                            <h4 className="font-bold text-slate-dark text-xs sm:text-sm truncate max-w-[100px] xs:max-w-[150px] sm:max-w-[200px] md:max-w-none">{item.name}</h4>
                            <span className="text-[10px] sm:text-xs text-slate-dark/60 block mt-0.5">
                              {item.format ? `Format: ${item.format}` : `1 ${item.unit}`}
                            </span>
                            <span className="text-xs font-bold text-accent block mt-0.5">
                              {item.price.toLocaleString('fr-FR')} FCFA
                            </span>
                          </div>
                        </div>

                        {/* Controls on the right (Quantity + Delete) */}
                        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                          {/* Quantity controls */}
                          <div className="flex items-center gap-1 bg-cream rounded-lg p-1 border border-primary/5">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1, item.format)}
                              className="p-1 rounded-md hover:bg-cream-dark/50"
                            >
                              <Minus className="h-3 w-3 text-slate-dark" />
                            </button>
                            <span className="text-xs font-extrabold w-5 text-center text-slate-dark">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1, item.format)}
                              className="p-1 rounded-md hover:bg-cream-dark/50"
                            >
                              <Plus className="h-3 w-3 text-slate-dark" />
                            </button>
                          </div>

                          {/* Remove button */}
                          <button
                            onClick={() => removeFromCart(item.id, item.format)}
                            className="p-1.5 rounded-xl text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Checkout Form */}
            <div className="lg:col-span-5">
              <div className="bg-white p-6 md:p-8 rounded-3xl border border-primary/5 shadow-md">
                <h3 className="text-lg font-bold text-slate-dark mb-5 border-b border-primary/5 pb-3">Finaliser la Commande</h3>
                
                <form onSubmit={handleCheckout} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <label htmlFor="name" className="text-xs font-bold text-slate-dark/80">Nom Complet *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={customer.name}
                      onChange={handleInputChange}
                      placeholder="Ex: M. Jean Soglo"
                      className="bg-cream border border-primary/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary w-full"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label htmlFor="phone" className="text-xs font-bold text-slate-dark/80">Numéro WhatsApp ou Téléphone *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={customer.phone}
                      onChange={handleInputChange}
                      placeholder="Ex: +229 0153302051"
                      className="bg-cream border border-primary/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary w-full"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label htmlFor="address" className="text-xs font-bold text-slate-dark/80">Adresse de livraison complète *</label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      required
                      value={customer.address}
                      onChange={handleInputChange}
                      placeholder="Ex: Fidjrossè, Rue après la station Lolo"
                      className="bg-cream border border-primary/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary w-full"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label htmlFor="delivery_zone" className="text-xs font-bold text-slate-dark/80">Zone de livraison *</label>
                      <select
                        id="delivery_zone"
                        name="delivery_zone"
                        required
                        value={customer.delivery_zone}
                        onChange={handleInputChange}
                        className="bg-cream border border-primary/10 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-primary w-full cursor-pointer"
                      >
                        {DELIVERY_OPTIONS.map((opt) => (
                          <option key={opt.id} value={opt.id}>
                            {opt.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label htmlFor="payment_method" className="text-xs font-bold text-slate-dark/80">Méthode de paiement *</label>
                      <select
                        id="payment_method"
                        name="payment_method"
                        required
                        value={customer.payment_method}
                        onChange={handleInputChange}
                        className="bg-cream border border-primary/10 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-primary w-full cursor-pointer"
                      >
                        <option value="cash_on_delivery">Paiement à la livraison</option>
                        <option value="mobile_money">Mobile Money (MTN/Moov)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label htmlFor="notes" className="text-xs font-bold text-slate-dark/80">Instructions / Notes (Optionnel)</label>
                    <textarea
                      id="notes"
                      name="notes"
                      rows={2}
                      value={customer.notes}
                      onChange={handleInputChange}
                      placeholder="Ex: Appeler avant d'arriver..."
                      className="bg-cream border border-primary/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-primary w-full resize-none"
                    ></textarea>
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="border-t border-primary/10 pt-4 mt-2 flex flex-col gap-2 text-xs">
                    <div className="flex justify-between text-slate-dark/70">
                      <span>Sous-Total</span>
                      <span className="font-bold">{cartTotal.toLocaleString('fr-FR')} FCFA</span>
                    </div>
                    <div className="flex justify-between text-slate-dark/70">
                      <span>Frais de livraison ({selectedZone.name})</span>
                      <span className="font-bold">{deliveryFee.toLocaleString('fr-FR')} FCFA</span>
                    </div>
                    <div className="flex justify-between text-base font-black text-slate-dark border-t border-primary/5 pt-3">
                      <span>Total à payer</span>
                      <span className="text-accent">{grandTotal.toLocaleString('fr-FR')} FCFA</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white py-4 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 transition-all disabled:opacity-50 mt-4 cursor-pointer"
                  >
                    {loading ? (
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <MessageCircle className="h-4.5 w-4.5 fill-current" />
                        <span>Commander sur WhatsApp</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
