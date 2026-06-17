'use client';

import React from 'react';
import { 
  History, 
  Target, 
  Eye, 
  Sparkles, 
  ShieldCheck, 
  Users2,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="w-full bg-cream pb-24">
      {/* 1. Header Banner */}
      <div className="relative bg-slate-dark text-white py-20 md:py-28 overflow-hidden border-b-4 border-accent">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-dark/90 via-slate-dark/70 to-slate-dark/30 z-10"></div>
        <Image
          src="/backgrounds/about.png"
          alt="À propos de Warriors Market"
          fill
          priority
          className="object-cover object-center opacity-45 z-0"
        />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-20 flex flex-col gap-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-white/60">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-accent">À propos</span>
          </div>

          <div className="inline-flex self-start items-center gap-1.5 rounded-full bg-accent/20 border border-accent/30 px-4 py-1.5 text-xs font-bold text-accent uppercase tracking-widest">
            <Users2 className="h-3.5 w-3.5" />
            <span>Notre Histoire & Valeurs</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight leading-none">Qui sommes-nous ?</h1>
          <p className="text-gray-300 text-base md:text-xl max-w-3xl leading-relaxed font-medium">
            Découvrez l'histoire de Warriors Market, une entreprise agroalimentaire béninoise d'excellence, engagée pour une alimentation saine, locale et premium.
          </p>
        </div>
      </div>

      {/* 2. Mot de la Promotrice Section */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mt-20">
        <div className="bg-white rounded-3xl p-8 md:p-14 shadow-lg border border-primary/5 flex flex-col md:flex-row gap-12 items-center">
          <div className="w-full md:w-2/5 shrink-0">
            <div className="relative h-[400px] w-full rounded-2xl overflow-hidden shadow-lg border-4 border-white rotate-1 hover:rotate-0 transition-transform duration-500 bg-cream-dark/30">
              <Image
                src="/promotrice.png"
                alt="Nassirine SALIFOU - Promotrice de Warriors Market"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
          <div className="w-full md:w-3/5 flex flex-col gap-6">
            <div className="inline-flex self-start items-center gap-1.5 rounded-full bg-accent/15 px-4 py-1.5 text-xs font-bold text-accent uppercase tracking-widest">
              <Sparkles className="h-3.5 w-3.5 fill-current" />
              <span>Le Mot de la Promotrice</span>
            </div>
            <h2 className="text-3xl font-black text-slate-dark tracking-tight leading-tight md:text-5xl">
              Nassirine SALIFOU
            </h2>
            <div className="text-slate-dark/90 text-base md:text-lg leading-relaxed flex flex-col gap-5 italic font-medium text-justify">
              <p>
                « Chez Warriors Market, notre mission dépasse la simple vente de produits alimentaires. Nous croyons fermement que manger sainement est un droit fondamental et le pilier d'une vie équilibrée. »
              </p>
              <p>
                « C'est pourquoi nous mettons un point d'honneur à sélectionner avec la plus grande rigueur nos viandes fraîches et à travailler main dans la main avec des coopératives béninoises pour vous offrir des farines locales et des épices naturelles d'une pureté absolue. Consommer local, c'est préserver sa santé tout en bâtissant l'économie de notre cher pays, le Bénin. »
              </p>
            </div>
            <div className="mt-3 border-t border-primary/10 pt-4">
              <span className="block font-black text-primary text-base md:text-lg">Nassirine SALIFOU</span>
              <span className="text-xs text-slate-dark/50 font-bold block uppercase tracking-wider mt-0.5">Fondatrice & Promotrice, Warriors Market</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Story */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mt-24">
        <div className="flex flex-col gap-20">
          
          {/* History */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-5 flex justify-center order-last md:order-first">
              <div className="relative h-72 w-full rounded-3xl overflow-hidden shadow-lg border-4 border-white">
                <Image
                  src="/warriorsmarket.jpg"
                  alt="Épices et ingrédients naturels Warriors Market"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="md:col-span-7 flex flex-col gap-5">
              <span className="text-xs font-bold text-primary uppercase tracking-widest">Héritage & Passion</span>
              <h2 className="text-3xl font-black text-slate-dark md:text-5xl tracking-tight leading-none">Notre Histoire</h2>
              <div className="text-slate-dark/85 text-base md:text-lg leading-relaxed flex flex-col gap-4 font-medium text-justify">
                <p>
                  Fondée par des passionnés de l'agroalimentaire béninois, <strong>Warriors Market</strong> est née d'un constat simple : il est souvent difficile pour les ménages et les professionnels à Cotonou d'accéder facilement à des viandes fraîches découpées dans des conditions d'hygiène rigoureuses, ainsi qu'à des farines et épices locales 100% naturelles.
                </p>
                <p>
                  Pour répondre à ce besoin, nous avons structuré une chaîne d'approvisionnement courte en travaillant en direct avec des éleveurs locaux et des coopératives agricoles du Bénin. Cette proximité nous permet de garantir une fraîcheur absolue et des prix justes, du producteur au consommateur.
                </p>
              </div>
            </div>
          </div>

          <hr className="border-primary/10" />

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-white p-10 md:p-12 rounded-3xl border border-primary/5 shadow-md flex flex-col gap-6">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                <Target className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-black text-slate-dark md:text-3xl tracking-tight">Notre Mission</h3>
              <p className="text-slate-dark/85 text-sm md:text-base leading-relaxed font-medium text-justify">
                Notre slogan, <strong>"Votre alimentation saine, notre priorité"</strong>, résume parfaitement notre but quotidien. Nous voulons faciliter l'accès à une alimentation équilibrée, saine, sans additifs chimiques ni conservateurs, tout en valorisant la production locale béninoise.
              </p>
            </div>

            <div className="bg-white p-10 md:p-12 rounded-3xl border border-primary/5 shadow-md flex flex-col gap-6">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                <Eye className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-black text-slate-dark md:text-3xl tracking-tight">Notre Vision</h3>
              <p className="text-slate-dark/85 text-sm md:text-base leading-relaxed font-medium text-justify">
                Devenir la plateforme e-commerce agroalimentaire de référence au Bénin, reconnue pour la qualité premium de ses produits, son éthique éco-responsable et la rapidité de son service de livraison à domicile.
              </p>
            </div>
          </div>

          <hr className="border-primary/10" />

          {/* Engagement Qualité */}
          <div className="bg-white p-10 md:p-14 rounded-3xl border border-primary/5 shadow-lg flex flex-col gap-8">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <h3 className="text-3xl font-black text-slate-dark md:text-4xl tracking-tight">Nos Engagements Qualité</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
              <div className="flex flex-col gap-3">
                <h4 className="font-bold text-primary text-base md:text-lg">1. Hygiène irréprochable</h4>
                <p className="text-slate-dark/80 text-sm leading-relaxed font-medium text-justify">
                  Tous nos produits (viandes, épices, farines) sont manipulés dans des environnements régulièrement désinfectés, et emballés hermétiquement.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <h4 className="font-bold text-primary text-base md:text-lg">2. Soutien local</h4>
                <p className="text-slate-dark/80 text-sm leading-relaxed font-medium text-justify">
                  En achetant chez nous, vous contribuez directement à soutenir les éleveurs de volailles locales, de bétails et les transformateurs agricoles béninois.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <h4 className="font-bold text-primary text-base md:text-lg">3. Zéro additifs chimiques</h4>
                <p className="text-slate-dark/80 text-sm leading-relaxed font-medium text-justify">
                  Nos épices et nos farines locales sont moulues de manière traditionnelle sans aucun colorant, arôme artificiel ou conservateur chimique.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
