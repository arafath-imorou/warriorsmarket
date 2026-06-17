'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Phone, MapPin, ChevronRight, Clock } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();

  // Don't render global footer on admin routes
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="relative bg-gradient-to-br from-[#0c2214] via-[#091a0f] to-[#06120b] text-white pt-14 pb-6 mt-auto border-t-4 border-accent overflow-hidden">
      {/* Decorative premium elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[150px] bg-primary/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16 relative z-10">
        {/* Row 1: Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-10">
          
          {/* Column 1: Brand Info (width 4/12) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <Link href="/" className="flex items-center group self-start">
              <div className="relative h-[82px] w-[256px] shrink-0 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-2 flex items-center justify-center group-hover:scale-[1.02] group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-300 shadow-md">
                <Image
                  src="/logo.png"
                  alt="Warriors Market Logo"
                  fill
                  className="object-contain p-1.5"
                />
              </div>
            </Link>
            
            <p className="text-white/75 text-xs leading-relaxed font-normal max-w-sm">
              Produits locaux de qualité supérieure sélectionnés avec soin.
            </p>

            {/* Badges de confiance */}
            <div className="grid grid-cols-2 gap-2 mt-2 border-t border-white/5 pt-4">
              <div className="flex items-center gap-1.5 text-xs text-white/70">
                <svg className="h-3.5 w-3.5 text-[#25D366] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-medium text-[11px]">Produits locaux certifiés</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-white/70">
                <svg className="h-3.5 w-3.5 text-[#25D366] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-medium text-[11px]">Livraison rapide</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-white/70">
                <svg className="h-3.5 w-3.5 text-[#25D366] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-medium text-[11px]">Qualité contrôlée</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-white/70">
                <svg className="h-3.5 w-3.5 text-[#25D366] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-medium text-[11px]">Service client réactif</span>
              </div>
            </div>

            {/* Réseaux Sociaux */}
            <div className="flex flex-col gap-2 mt-2 pt-4 border-t border-white/5">
              <span className="text-[10px] font-black text-accent uppercase tracking-widest">Suivez-nous</span>
              <div className="flex items-center gap-2.5">
                <Link 
                  href="#" 
                  className="h-8.5 w-8.5 rounded-xl bg-white/5 border border-white/10 hover:bg-[#1877F2] hover:text-white hover:border-transparent hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center text-white/70"
                  title="Facebook"
                >
                  <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8.02 9.69v-6.85H7.53v-2.84h2.49V9.8c0-2.46 1.46-3.83 3.71-3.83 1.08 0 2.2.19 2.2.19v2.42h-1.24c-1.22 0-1.6.76-1.6 1.54v1.85h2.72l-.43 2.84h-2.29V21.7C18.56 20.87 22 16.84 22 12z"/>
                  </svg>
                </Link>
                <Link 
                  href="#" 
                  className="h-8.5 w-8.5 rounded-xl bg-white/5 border border-white/10 hover:bg-[#E1306C] hover:text-white hover:border-transparent hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center text-white/70"
                  title="Instagram"
                >
                  <svg className="h-4.5 w-4.5 stroke-current fill-none stroke-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                </Link>
                <Link 
                  href="#" 
                  className="h-8.5 w-8.5 rounded-xl bg-white/5 border border-white/10 hover:bg-black hover:text-white hover:border-transparent hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center text-white/70"
                  title="TikTok"
                >
                  <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.23.86.17 1.72.28 2.58.29v3.87c-1.36-.08-2.68-.61-3.75-1.47v6.62c.03 3.08-1.56 5.95-4.26 7.42-2.73 1.48-6.11 1.4-8.76-.2-2.61-1.57-4.14-4.5-3.95-7.53.2-3.13 2.13-5.91 5.02-7.07.69-.27 1.43-.41 2.17-.42v3.91c-.69.04-1.36.25-1.92.65-.98.71-1.5 1.94-1.35 3.15.15 1.25.96 2.33 2.11 2.82.91.38 1.95.27 2.76-.32.61-.45.97-1.18.96-1.93v-14.1z"/>
                  </svg>
                </Link>
                <Link 
                  href="https://wa.me/2290153302051" 
                  target="_blank"
                  className="h-8.5 w-8.5 rounded-xl bg-white/5 border border-white/10 hover:bg-[#25D366] hover:text-white hover:border-transparent hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center text-white/70"
                  title="WhatsApp Business"
                >
                  <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.488 1.459 5.407 1.46h.007c5.626 0 10.204-4.579 10.207-10.205.002-2.727-1.053-5.29-2.971-7.21C17.37 1.278 14.807.225 12.01.225c-5.632 0-10.21 4.579-10.213 10.206-.001 1.928.504 3.811 1.464 5.418L1.874 22.03l6.23-1.632zM18.067 15.65c-.328-.164-1.947-.96-2.25-1.07-.302-.11-.522-.164-.74.164-.219.329-.848 1.07-1.04 1.288-.19.219-.382.247-.71.082-.328-.164-1.386-.51-2.64-1.627-1-.893-1.674-1.996-1.87-2.324-.197-.329-.021-.507.143-.671.148-.147.329-.382.493-.574.164-.192.219-.329.328-.548.11-.219.055-.411-.027-.575-.082-.164-.74-1.78-.1013-2.667-.367-.887-.712-1.07-1.04-1.082-.329-.012-.603-.012-.877-.012-.274 0-.712.103-1.082.507-.37.404-1.411 1.38-1.411 3.364 0 1.984 1.438 3.901 1.637 4.175.199.274 2.83 4.322 6.856 6.057.957.413 1.704.659 2.285.845.962.305 1.838.262 2.53.159.77-.116 2.373-.97 2.712-1.9.339-.93.339-1.727.238-1.89-.101-.163-.38-.26-.708-.423z"/>
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* Column 2: Nos Rayons (width 2/12) */}
          <div className="lg:col-span-2 flex flex-col gap-4 lg:pl-6 lg:border-l lg:border-white/5">
            <h3 className="text-xs font-black text-accent uppercase tracking-[0.2em] relative before:content-[''] before:block before:w-6 before:h-0.5 before:bg-accent before:absolute before:-bottom-2 before:left-0">
              Nos Rayons
            </h3>
            <ul className="flex flex-col gap-2.5 text-xs mt-1">
              <li>
                <Link href="/catalog/viandes" className="flex items-center gap-1.5 text-white/70 hover:text-accent hover:translate-x-1 transition-all duration-300 group">
                  <ChevronRight className="h-3 w-3 text-accent/40 group-hover:text-accent transition-colors shrink-0" />
                  <span>Viandes Fraîches</span>
                </Link>
              </li>
              <li>
                <Link href="/catalog/epices" className="flex items-center gap-1.5 text-white/70 hover:text-accent hover:translate-x-1 transition-all duration-300 group">
                  <ChevronRight className="h-3 w-3 text-accent/40 group-hover:text-accent transition-colors shrink-0" />
                  <span>Épices Naturelles</span>
                </Link>
              </li>
              <li>
                <Link href="/catalog/farines" className="flex items-center gap-1.5 text-white/70 hover:text-accent hover:translate-x-1 transition-all duration-300 group">
                  <ChevronRight className="h-3 w-3 text-accent/40 group-hover:text-accent transition-colors shrink-0" />
                  <span>Farines Locales</span>
                </Link>
              </li>
              <li>
                <Link href="/catalog/transformes" className="flex items-center gap-1.5 text-white/70 hover:text-accent hover:translate-x-1 transition-all duration-300 group">
                  <ChevronRight className="h-3 w-3 text-accent/40 group-hover:text-accent transition-colors shrink-0" />
                  <span>Produits Transformés</span>
                </Link>
              </li>
              <li>
                <Link href="/gros" className="flex items-center gap-1.5 text-white/70 hover:text-accent hover:translate-x-1 transition-all duration-300 group">
                  <ChevronRight className="h-3 w-3 text-accent/40 group-hover:text-accent transition-colors shrink-0" />
                  <span className="font-semibold text-accent/90">Vente en Gros (B2B)</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Informations (width 2/12) */}
          <div className="lg:col-span-2 flex flex-col gap-4 lg:pl-6 lg:border-l lg:border-white/5">
            <h3 className="text-xs font-black text-accent uppercase tracking-[0.2em] relative before:content-[''] before:block before:w-6 before:h-0.5 before:bg-accent before:absolute before:-bottom-2 before:left-0">
              Informations
            </h3>
            <ul className="flex flex-col gap-2.5 text-xs mt-1">
              <li>
                <Link href="/livraison" className="flex items-center gap-1.5 text-white/70 hover:text-accent hover:translate-x-1 transition-all duration-300 group">
                  <ChevronRight className="h-3 w-3 text-accent/40 group-hover:text-accent transition-colors shrink-0" />
                  <span>Frais de livraison</span>
                </Link>
              </li>
              <li>
                <Link href="/about" className="flex items-center gap-1.5 text-white/70 hover:text-accent hover:translate-x-1 transition-all duration-300 group">
                  <ChevronRight className="h-3 w-3 text-accent/40 group-hover:text-accent transition-colors shrink-0" />
                  <span>Qui sommes-nous ?</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="flex items-center gap-1.5 text-white/70 hover:text-accent hover:translate-x-1 transition-all duration-300 group">
                  <ChevronRight className="h-3 w-3 text-accent/40 group-hover:text-accent transition-colors shrink-0" />
                  <span>Nous Contacter</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="flex items-center gap-1.5 text-white/70 hover:text-accent hover:translate-x-1 transition-all duration-300 group">
                  <ChevronRight className="h-3 w-3 text-accent/40 group-hover:text-accent transition-colors shrink-0" />
                  <span>FAQ</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="flex items-center gap-1.5 text-white/70 hover:text-accent hover:translate-x-1 transition-all duration-300 group">
                  <ChevronRight className="h-3 w-3 text-accent/40 group-hover:text-accent transition-colors shrink-0" />
                  <span>Conditions Générales</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Horaires (width 4/12) */}
          <div className="lg:col-span-4 flex flex-col gap-4 lg:pl-6 lg:border-l lg:border-white/5">
            <h3 className="text-xs font-black text-accent uppercase tracking-[0.2em] relative before:content-[''] before:block before:w-6 before:h-0.5 before:bg-accent before:absolute before:-bottom-2 before:left-0">
              Contact & Horaires
            </h3>
            
            <div className="flex flex-col gap-2.5 text-xs mt-1">
              <Link href="tel:+2290153302051" className="flex items-center gap-2 text-white/70 hover:text-accent transition-colors group">
                <div className="h-6.5 w-6.5 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all duration-300 shrink-0">
                  <Phone className="h-3.5 w-3.5" />
                </div>
                <span className="font-semibold">+229 0153302051</span>
              </Link>
              
              <Link href="https://wa.me/2290153302051" target="_blank" className="flex items-center gap-2 text-white/70 hover:text-[#25D366] transition-colors group">
                <div className="h-6.5 w-6.5 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#25D366] group-hover:bg-[#25D366] group-hover:text-white transition-all duration-300 shrink-0">
                  <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.488 1.459 5.407 1.46h.007c5.626 0 10.204-4.579 10.207-10.205.002-2.727-1.053-5.29-2.971-7.21C17.37 1.278 14.807.225 12.01.225c-5.632 0-10.21 4.579-10.213 10.206-.001 1.928.504 3.811 1.464 5.418L1.874 22.03l6.23-1.632zM18.067 15.65c-.328-.164-1.947-.96-2.25-1.07-.302-.11-.522-.164-.74.164-.219.329-.848 1.07-1.04 1.288-.19.219-.382.247-.71.082-.328-.164-1.386-.51-2.64-1.627-1-.893-1.674-1.996-1.87-2.324-.197-.329-.021-.507.143-.671.148-.147.329-.382.493-.574.164-.192.219-.329.328-.548.11-.219.055-.411-.027-.575-.082-.164-.74-1.78-.1013-2.667-.367-.887-.712-1.07-1.04-1.082-.329-.012-.603-.012-.877-.012-.274 0-.712.103-1.082.507-.37.404-1.411 1.38-1.411 3.364 0 1.984 1.438 3.901 1.637 4.175.199.274 2.83 4.322 6.856 6.057.957.413 1.704.659 2.285.845.962.305 1.838.262 2.53.159.77-.116 2.373-.97 2.712-1.9.339-.93.339-1.727.238-1.89-.101-.163-.38-.26-.708-.423z"/>
                  </svg>
                </div>
                <span className="font-semibold">WhatsApp: +229 0153302051</span>
              </Link>
              
              <div className="flex items-center gap-2 text-white/70">
                <div className="h-6.5 w-6.5 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-accent shrink-0">
                  <MapPin className="h-3.5 w-3.5" />
                </div>
                <span className="font-medium">Cotonou, Fidjrossè - Bénin</span>
              </div>
            </div>

            {/* Horaires Glassmorphism */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-3.5 mt-1.5 flex flex-col gap-1.5 shadow-lg">
              <span className="text-[10px] text-accent font-black uppercase tracking-widest flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-accent animate-pulse" />
                <span>Horaires d'ouverture</span>
              </span>
              <div className="text-[11px] text-white/80 font-medium leading-normal">
                <span className="block">Lun - Sam : 08h00 - 19h00</span>
                <span className="block mt-0.5 text-white/50">Dimanche : 09h00 - 14h00</span>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-white/5 my-4" />

        {/* Row 3: Bottom footer */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/50 pb-2">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center md:text-left">
            <p>© 2026 Warriors Market — Tous droits réservés.</p>
            <span className="hidden sm:inline text-white/10">|</span>
            <p className="flex items-center gap-1.5 justify-center sm:justify-start">
              <span>Conçu et développé par</span>
              <a
                href="https://www.itainnovate.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-accent-light font-extrabold transition-all animate-blink drop-shadow-[0_0_8px_rgba(247,147,30,0.4)]"
              >
                ITA INNOVATE
              </a>
            </p>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <Link href="/admin/login" className="hover:text-white transition-colors font-medium">
              Espace Administrateur
            </Link>
            <span className="text-white/10">|</span>
            
            {/* Social Icons */}
            <div className="flex items-center gap-2.5">
              <Link 
                href="#" 
                className="h-7.5 w-7.5 rounded-full bg-white/5 border border-white/10 hover:bg-primary hover:text-white hover:border-transparent transition-all duration-300 flex items-center justify-center text-white/70"
                title="Facebook"
              >
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8.02 9.69v-6.85H7.53v-2.84h2.49V9.8c0-2.46 1.46-3.83 3.71-3.83 1.08 0 2.2.19 2.2.19v2.42h-1.24c-1.22 0-1.6.76-1.6 1.54v1.85h2.72l-.43 2.84h-2.29V21.7C18.56 20.87 22 16.84 22 12z"/>
                </svg>
              </Link>
              <Link 
                href="https://wa.me/2290153302051" 
                target="_blank"
                className="h-7.5 w-7.5 rounded-full bg-white/5 border border-white/10 hover:bg-[#25D366] hover:text-white hover:border-transparent transition-all duration-300 flex items-center justify-center text-white/70"
                title="WhatsApp"
              >
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.488 1.459 5.407 1.46h.007c5.626 0 10.204-4.579 10.207-10.205.002-2.727-1.053-5.29-2.971-7.21C17.37 1.278 14.807.225 12.01.225c-5.632 0-10.21 4.579-10.213 10.206-.001 1.928.504 3.811 1.464 5.418L1.874 22.03l6.23-1.632zM18.067 15.65c-.328-.164-1.947-.96-2.25-1.07-.302-.11-.522-.164-.74.164-.219.329-.848 1.07-1.04 1.288-.19.219-.382.247-.71.082-.328-.164-1.386-.51-2.64-1.627-1-.893-1.674-1.996-1.87-2.324-.197-.329-.021-.507.143-.671.148-.147.329-.382.493-.574.164-.192.219-.329.328-.548.11-.219.055-.411-.027-.575-.082-.164-.74-1.78-.1013-2.667-.367-.887-.712-1.07-1.04-1.082-.329-.012-.603-.012-.877-.012-.274 0-.712.103-1.082.507-.37.404-1.411 1.38-1.411 3.364 0 1.984 1.438 3.901 1.637 4.175.199.274 2.83 4.322 6.856 6.057.957.413 1.704.659 2.285.845.962.305 1.838.262 2.53.159.77-.116 2.373-.97 2.712-1.9.339-.93.339-1.727.238-1.89-.101-.163-.38-.26-.708-.423z"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
