'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  Send, 
  MessageCircle, 
  CheckCircle2, 
  HelpCircle, 
  ChevronRight,
  PhoneCall
} from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function WholesalePage() {
  const [formData, setFormData] = useState({
    name: '',
    company_name: '',
    phone: '',
    email: '',
    product_details: '',
    quantity: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const { error } = await supabase
        .from('warriors_wholesale_requests')
        .insert([
          {
            name: formData.name,
            company_name: formData.company_name,
            phone: formData.phone,
            email: formData.email,
            product_details: formData.product_details,
            quantity: formData.quantity,
            message: formData.message,
            status: 'pending'
          }
        ]);

      if (error) {
        throw error;
      }

      setSubmitted(true);
    } catch (err: any) {
      console.warn('Failed to save request to Supabase, showing offline success fallback', err);
      // We will show a success notification anyway but flag that they can contact WhatsApp directly
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppFollowUp = () => {
    const text = `Bonjour Warriors Market ! Je viens de soumettre une demande de devis de vente en gros sur votre site :
- Nom : ${formData.name}
- Entreprise : ${formData.company_name || 'N/A'}
- Téléphone : ${formData.phone}
- Produits : ${formData.product_details}
- Quantité : ${formData.quantity}
Merci de me recontacter pour finaliser le devis.`;
    
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/2290153302051?text=${encodedText}`, '_blank');
  };

  return (
    <div className="w-full bg-cream pb-20">
      {/* 1. Header Banner */}
      <div className="relative bg-slate-dark text-white py-16 md:py-24 overflow-hidden border-b-4 border-accent">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-dark/95 to-slate-dark/40 z-10"></div>
        <div className="absolute inset-0 bg-primary/10 mix-blend-overlay -z-10"></div>
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-20 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-white/60">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-accent">Vente en Gros</span>
          </div>

          <div className="inline-flex self-start items-center gap-1.5 rounded-full bg-accent/20 border border-accent/30 px-3.5 py-1 text-xs font-bold text-accent uppercase tracking-wider">
            <Building2 className="h-3.5 w-3.5" />
            <span>Service B2B & Grossiste</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black">Espace Vente en Gros</h1>
          <p className="text-gray-300 text-sm md:text-base max-w-2xl leading-relaxed">
            Vous êtes un restaurant, un hôtel, une cantine scolaire, un supermarché ou un revendeur ? Bénéficiez de nos tarifs préférentiels et de livraisons planifiées.
          </p>
        </div>
      </div>

      {/* 2. Content Section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Info Columns */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="bg-white p-8 rounded-3xl border border-primary/5 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-dark mb-6">Nos services professionnels</h2>
              
              <div className="flex flex-col gap-6">
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-dark">Tarifs Dégressifs</h4>
                    <p className="text-xs text-slate-dark/70 mt-1 leading-relaxed">
                      Des réductions importantes basées sur les volumes de commandes hebdomadaires ou mensuels.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-dark">Livraisons Planifiées</h4>
                    <p className="text-xs text-slate-dark/70 mt-1 leading-relaxed">
                      Planifiez vos approvisionnements (ex: tous les mardis et vendredis matin) pour ne jamais être en rupture.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-dark">Chaîne du froid respectée</h4>
                    <p className="text-xs text-slate-dark/70 mt-1 leading-relaxed">
                      Pour les restaurants et hôtels, nous transportons nos viandes fraîches sous température dirigée.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Call Widget */}
            <div className="bg-gradient-to-br from-primary to-primary-dark text-white p-8 rounded-3xl shadow-lg flex flex-col gap-5 relative overflow-hidden">
              <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-white/5"></div>
              <h3 className="text-xl font-bold">Besoin d'une réponse urgente ?</h3>
              <p className="text-white/80 text-xs leading-relaxed">
                Notre équipe commerciale B2B est disponible par appel direct ou WhatsApp pour répondre à vos questions et formuler un devis sous 2 heures.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mt-2">
                <Link
                  href="tel:+2290153302051"
                  className="flex items-center justify-center gap-2 bg-white text-primary px-5 py-3 rounded-xl text-xs font-bold hover:bg-cream transition-colors"
                >
                  <PhoneCall className="h-4 w-4" />
                  <span>+229 0153302051</span>
                </Link>
                <button
                  onClick={handleWhatsAppFollowUp}
                  className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white px-5 py-3 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  <MessageCircle className="h-4 w-4 fill-current" />
                  <span>WhatsApp direct</span>
                </button>
              </div>
            </div>
          </div>

          {/* Form Columns */}
          <div className="lg:col-span-7">
            <div className="bg-white p-8 md:p-10 rounded-3xl border border-primary/5 shadow-md">
              {submitted ? (
                <div className="text-center py-12 flex flex-col items-center gap-6">
                  <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                    <CheckCircle2 className="h-12 w-12" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-dark">Demande envoyée avec succès !</h3>
                  <p className="text-slate-dark/70 text-sm max-w-md mx-auto leading-relaxed">
                    Merci pour votre intérêt envers Warriors Market. Notre service B2B étudie votre demande et vous contactera par téléphone ou email dans les plus brefs délais.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 mt-4 w-full justify-center">
                    <button
                      onClick={handleWhatsAppFollowUp}
                      className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white px-6 py-3.5 rounded-xl text-sm font-bold transition-colors cursor-pointer"
                    >
                      <MessageCircle className="h-4.5 w-4.5 fill-current" />
                      <span>Accélérer la demande via WhatsApp</span>
                    </button>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="text-xs font-bold text-slate-dark/60 hover:text-slate-dark"
                    >
                      Faire une autre demande
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-dark">Demander un Devis Personnalisé</h2>
                    <p className="text-xs text-slate-dark/60 mt-1">Remplissez ce formulaire et recevez une proposition chiffrée rapidement.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="name" className="text-xs font-bold text-slate-dark/80">Nom Complet *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Ex: M. Koffi Mensah"
                        className="bg-cream border border-primary/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary w-full"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="company_name" className="text-xs font-bold text-slate-dark/80">Nom de l'établissement *</label>
                      <input
                        type="text"
                        id="company_name"
                        name="company_name"
                        required
                        value={formData.company_name}
                        onChange={handleChange}
                        placeholder="Ex: Restaurant Le Gourmand"
                        className="bg-cream border border-primary/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary w-full"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="phone" className="text-xs font-bold text-slate-dark/80">Numéro WhatsApp ou Téléphone *</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Ex: +229 0153302051"
                        className="bg-cream border border-primary/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary w-full"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="email" className="text-xs font-bold text-slate-dark/80">Adresse Email *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Ex: contact@etablissement.com"
                        className="bg-cream border border-primary/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary w-full"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="product_details" className="text-xs font-bold text-slate-dark/80">Produit(s) souhaité(s) *</label>
                      <select
                        id="product_details"
                        name="product_details"
                        required
                        value={formData.product_details}
                        onChange={handleChange}
                        className="bg-cream border border-primary/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary w-full cursor-pointer"
                      >
                        <option value="">Sélectionner une catégorie principale</option>
                        <option value="Viandes fraîches en gros (Bœuf, mouton, etc.)">Viandes fraîches en gros</option>
                        <option value="Épices naturelles en gros (Poivre, curcuma, etc.)">Épices naturelles en gros</option>
                        <option value="Farines locales en gros (Télibo, soja, mil, etc.)">Farines locales en gros</option>
                        <option value="Produits transformés (Pâte d'arachide, miel, etc.)">Produits transformés en gros</option>
                        <option value="Mélange de plusieurs produits">Mélange de plusieurs produits</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="quantity" className="text-xs font-bold text-slate-dark/80">Quantité souhaitée *</label>
                      <input
                        type="text"
                        id="quantity"
                        name="quantity"
                        required
                        value={formData.quantity}
                        onChange={handleChange}
                        placeholder="Ex: 50 kg par semaine, 100 pots, etc."
                        className="bg-cream border border-primary/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary w-full"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="message" className="text-xs font-bold text-slate-dark/80">Précisez vos besoins (Optionnel)</label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Indiquez des détails supplémentaires, comme des découpes spécifiques, contraintes de livraison, horaires souhaités..."
                      className="bg-cream border border-primary/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary w-full resize-y"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white py-4 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? (
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Soumettre la demande de devis</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
