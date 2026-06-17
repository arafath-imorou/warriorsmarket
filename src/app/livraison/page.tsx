'use client';

import React from 'react';
import { 
  Truck, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  HelpCircle,
  MessageCircle,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

export default function DeliveryPage() {
  const deliveryZones = [
    {
      zone: 'Cotonou Intra-Muros',
      neighborhoods: 'Fidjrossè, Haie Vive, Cadjehoun, Gbégamey, Akpakpa, Zongo, etc.',
      fee: '1 000 - 1 500 FCFA',
      time: 'Moins de 24h (Commandez avant 12h, livré le jour-même)'
    },
    {
      zone: 'Abomey-Calavi & Banlieues',
      neighborhoods: 'Calavi Centre, Kpota, Akassato, Godomey, Cocotomey, Tankpè, etc.',
      fee: '1 500 - 2 000 FCFA',
      time: 'Moins de 24h (Livraisons groupées après-midi)'
    },
    {
      zone: 'Porto-Novo & Ouidah',
      neighborhoods: 'Toutes zones accessibles.',
      fee: 'À partir de 2 500 FCFA',
      time: '24h à 48h'
    },
    {
      zone: 'Autres villes du Bénin',
      neighborhoods: 'Parakou, Bohicon, Abomey, Natitingou, etc.',
      fee: 'Frais de gare + Expédition',
      time: '24h à 72h (Par compagnies de transport terrestre)'
    }
  ];

  return (
    <div className="w-full bg-cream pb-20">
      {/* 1. Header Banner */}
      <div className="relative bg-slate-dark text-white py-16 md:py-24 overflow-hidden border-b-4 border-accent">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-dark/95 to-slate-dark/40 z-10"></div>
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-20 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-white/60">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-accent">Livraison</span>
          </div>

          <div className="inline-flex self-start items-center gap-1.5 rounded-full bg-accent/20 border border-accent/30 px-3.5 py-1 text-xs font-bold text-accent uppercase tracking-wider">
            <Truck className="h-3.5 w-3.5" />
            <span>Informations de Livraison</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black">Zones & Délais de Livraison</h1>
          <p className="text-gray-300 text-sm md:text-base max-w-2xl leading-relaxed">
            Nous apportons la fraîcheur de nos viandes et la qualité de nos farines directement à votre porte, dans des conditions d'hygiène optimales.
          </p>
        </div>
      </div>

      {/* 2. Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Main Info Columns */}
          <div className="lg:col-span-8 flex flex-col gap-10">
            {/* Table of Zones */}
            <div className="bg-white p-8 rounded-3xl border border-primary/5 shadow-md">
              <h2 className="text-2xl font-bold text-slate-dark mb-6 flex items-center gap-2">
                <MapPin className="h-6 w-6 text-primary" />
                <span>Zones desservies et Tarifs</span>
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-primary/10 text-xs font-bold text-slate-dark/60 uppercase">
                      <th className="py-4 pr-4">Zone</th>
                      <th className="py-4 px-4">Quartiers / Secteurs</th>
                      <th className="py-4 px-4">Tarif estimé</th>
                      <th className="py-4 pl-4">Délai indicatif</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-primary/5">
                    {deliveryZones.map((z) => (
                      <tr key={z.zone} className="hover:bg-cream/40 transition-colors">
                        <td className="py-4 pr-4 font-bold text-slate-dark">{z.zone}</td>
                        <td className="py-4 px-4 text-slate-dark/80 text-xs">{z.neighborhoods}</td>
                        <td className="py-4 px-4 font-semibold text-primary">{z.fee}</td>
                        <td className="py-4 pl-4 text-xs text-slate-dark/70 font-semibold">{z.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* How we preserve freshness */}
            <div className="bg-white p-8 rounded-3xl border border-primary/5 shadow-md">
              <h2 className="text-2xl font-bold text-slate-dark mb-6 flex items-center gap-2">
                <ShieldCheck className="h-6 w-6 text-primary" />
                <span>Garantie Fraîcheur & Hygiène</span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="border border-primary/10 p-5 rounded-2xl bg-cream/30">
                  <h4 className="font-bold text-slate-dark mb-2">Conditionnement Sous Vide</h4>
                  <p className="text-slate-dark/75 text-xs leading-relaxed text-justify">
                    Nos viandes fraîches sont découpées de manière hygiénique, puis immédiatement emballées sous vide pour ralentir l'oxydation et préserver toutes les saveurs de la viande.
                  </p>
                </div>

                <div className="border border-primary/10 p-5 rounded-2xl bg-cream/30">
                  <h4 className="font-bold text-slate-dark mb-2">Chaîne du Froid</h4>
                  <p className="text-slate-dark/75 text-xs leading-relaxed text-justify">
                    Les livreurs disposent de caissons isothermes rigides équipés de plaques eutectiques congelées pour maintenir les produits à une température idéale (&lt; 4°C) durant tout le trajet.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery FAQ / Quick CTA */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            <div className="bg-white p-8 rounded-3xl border border-primary/5 shadow-md flex flex-col gap-6">
              <h3 className="text-xl font-bold text-slate-dark flex items-center gap-2">
                <Clock className="h-5 w-5 text-accent" />
                <span>Commande Express</span>
              </h3>
              
              <p className="text-xs text-slate-dark/80 leading-relaxed">
                Vous avez besoin de votre commande très rapidement ? Optez pour la commande express WhatsApp.
              </p>

              <div className="flex flex-col gap-4 text-xs text-slate-dark/80 bg-cream/50 p-4 rounded-2xl border border-primary/5">
                <div className="flex gap-2">
                  <span className="h-5 w-5 rounded-full bg-primary text-white font-bold flex items-center justify-center shrink-0">1</span>
                  <span>Ajoutez vos articles au panier sur le site.</span>
                </div>
                <div className="flex gap-2">
                  <span className="h-5 w-5 rounded-full bg-primary text-white font-bold flex items-center justify-center shrink-0">2</span>
                  <span>Validez en cliquant sur "Commander sur WhatsApp".</span>
                </div>
                <div className="flex gap-2">
                  <span className="h-5 w-5 rounded-full bg-primary text-white font-bold flex items-center justify-center shrink-0">3</span>
                  <span>Un conseiller valide l'adresse et envoie le livreur.</span>
                </div>
              </div>

              <Link
                href="https://wa.me/2290153302051"
                target="_blank"
                className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white py-3.5 rounded-xl text-sm font-bold shadow-md transition-colors"
              >
                <MessageCircle className="h-4.5 w-4.5 fill-current" />
                <span>Lancer un chat express</span>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
