'use client';

import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  MessageCircle, 
  Send, 
  CheckCircle2, 
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }, 1200);
  };

  return (
    <div className="w-full bg-cream pb-20">
      {/* 1. Header Banner */}
      <div className="relative bg-slate-dark text-white py-16 md:py-24 overflow-hidden border-b-4 border-accent">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-dark/95 to-slate-dark/40 z-10"></div>
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-20 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-white/60">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-accent">Contact</span>
          </div>

          <div className="inline-flex self-start items-center gap-1.5 rounded-full bg-accent/20 border border-accent/30 px-3.5 py-1 text-xs font-bold text-accent uppercase tracking-wider">
            <Mail className="h-3.5 w-3.5" />
            <span>Support & Assistance</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black">Nous Contacter</h1>
          <p className="text-gray-300 text-sm md:text-base max-w-2xl leading-relaxed">
            Une question ? Une commande spécifique ? Remplissez notre formulaire ou contactez-nous directement par téléphone ou WhatsApp.
          </p>
        </div>
      </div>

      {/* 2. Main content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Contact Details */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="bg-white p-8 rounded-3xl border border-primary/5 shadow-md flex flex-col gap-6">
              <h3 className="text-xl font-bold text-slate-dark">Nos Coordonnées</h3>

              <div className="flex flex-col gap-6 text-sm">
                
                {/* Phone */}
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-dark">Téléphone Direct</h4>
                    <Link href="tel:+2290153302051" className="text-primary hover:underline block font-semibold mt-1">
                      +229 0153302051
                    </Link>
                    <span className="text-xs text-slate-dark/60">Disponibilité: Lun-Sam 08h-19h</span>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-xl bg-[#25D366]/10 flex items-center justify-center text-[#25D366] shrink-0">
                    <MessageCircle className="h-5 w-5 fill-current" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-dark">WhatsApp Express</h4>
                    <Link 
                      href="https://wa.me/2290153302051" 
                      target="_blank"
                      className="text-[#25D366] hover:underline block font-semibold mt-1"
                    >
                      +229 0153302051
                    </Link>
                    <span className="text-xs text-slate-dark/60">Disponibilité: 7j/7</span>
                  </div>
                </div>

                {/* Address */}
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-dark">Notre Localisation</h4>
                    <p className="text-slate-dark/80 mt-1">
                      Cotonou, Quartier Fidjrossè, Bénin.
                    </p>
                    <span className="text-xs text-slate-dark/60">Service de livraison opérationnel</span>
                  </div>
                </div>

              </div>

              {/* Social networks */}
              <div className="border-t border-primary/10 pt-6 mt-2">
                <h4 className="text-xs font-bold text-slate-dark/60 uppercase mb-3">Suivez-nous sur les réseaux</h4>
                <div className="flex items-center gap-3">
                  <Link 
                    href="#" 
                    className="h-10 w-10 rounded-xl bg-cream hover:bg-primary hover:text-white transition-all text-slate-dark flex items-center justify-center border border-primary/5"
                  >
                    <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8.02 9.69v-6.85H7.53v-2.84h2.49V9.8c0-2.46 1.46-3.83 3.71-3.83 1.08 0 2.2.19 2.2.19v2.42h-1.24c-1.22 0-1.6.76-1.6 1.54v1.85h2.72l-.43 2.84h-2.29V21.7C18.56 20.87 22 16.84 22 12z"/>
                    </svg>
                  </Link>
                  <Link 
                    href="#" 
                    className="h-10 w-10 rounded-xl bg-cream hover:bg-primary hover:text-white transition-all text-slate-dark flex items-center justify-center border border-primary/5"
                  >
                    <svg className="h-5 w-5 stroke-current fill-none stroke-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            {/* Google Map mock/iframe */}
            <div className="bg-white rounded-3xl overflow-hidden border border-primary/5 shadow-md h-72 relative">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15862.062089408642!2d2.3524584!3d6.3564344!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1023f24bf71887e5%3A0xe54d249d3fbc9b7b!2sFidjross%C3%A8%2C%20Cotonou!5e0!3m2!1sfr!2sbj!4v1716382000000!5m2!1sfr!2sbj"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Warriors Market Location"
              ></iframe>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-8 md:p-10 rounded-3xl border border-primary/5 shadow-md">
              {submitted ? (
                <div className="text-center py-12 flex flex-col items-center gap-6">
                  <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                    <CheckCircle2 className="h-12 w-12" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-dark">Message envoyé !</h3>
                  <p className="text-slate-dark/70 text-sm max-w-md mx-auto leading-relaxed">
                    Merci pour votre message. Notre équipe commerciale vous répondra par email ou par téléphone sous 24 heures ouvrées.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer"
                  >
                    Envoyer un nouveau message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-dark">Écrivez-nous</h2>
                    <p className="text-xs text-slate-dark/60 mt-1">Vous recevrez une réponse sous peu.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="name" className="text-xs font-bold text-slate-dark/80">Votre Nom Complet *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Ex: Aminata Diallo"
                        className="bg-cream border border-primary/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary w-full"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="phone" className="text-xs font-bold text-slate-dark/80">Numéro de téléphone *</label>
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
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="email" className="text-xs font-bold text-slate-dark/80">Adresse Email *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Ex: diallo@email.com"
                        className="bg-cream border border-primary/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary w-full"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="subject" className="text-xs font-bold text-slate-dark/80">Sujet *</label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Ex: Question sur la viande"
                        className="bg-cream border border-primary/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary w-full"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="message" className="text-xs font-bold text-slate-dark/80">Votre Message *</label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Saisissez ici le contenu de votre message..."
                      className="bg-cream border border-primary/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary w-full resize-y"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white py-4 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? (
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Envoyer le Message</span>
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
