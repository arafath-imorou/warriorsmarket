'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowRight, 
  CheckCircle, 
  Truck, 
  ShieldCheck, 
  Flame, 
  ShoppingBag, 
  MessageCircle, 
  Users, 
  MapPin, 
  Sparkles, 
  ShoppingBag as CartIcon,
  Check
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { FALLBACK_CATEGORIES, FALLBACK_PRODUCTS, FallbackProduct, FallbackCategory } from '@/lib/fallbacks';
import { useCart } from '@/context/CartContext';
import JsonLd from '@/components/JsonLd';

export default function Home() {
  const { addToCart } = useCart();
  const [categories, setCategories] = useState<FallbackCategory[]>(FALLBACK_CATEGORIES);
  const [featuredProducts, setFeaturedProducts] = useState<FallbackProduct[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [addedItemName, setAddedItemName] = useState<string | null>(null);

  useEffect(() => {
    // Fetch categories and featured products from Supabase
    async function loadData() {
      try {
        const { data: dbCategories, error: catError } = await supabase
          .from('warriors_categories')
          .select('*')
          .order('name');
        
        if (dbCategories && !catError && dbCategories.length > 0) {
          const updatedCategories = dbCategories.map(cat => {
            if (cat.image_url && (cat.image_url.startsWith('https://images.unsplash.com') || cat.image_url === '')) {
              const fallback = FALLBACK_CATEGORIES.find(f => f.slug === cat.slug);
              if (fallback) {
                return { ...cat, image_url: fallback.image_url };
              }
            }
            return cat;
          });
          setCategories(updatedCategories);
        }

        const { data: dbProducts, error: prodError } = await supabase
          .from('warriors_products')
          .select('*')
          .eq('status', 'available');

        if (dbProducts && !prodError && dbProducts.length > 0) {
          const updatedProducts = dbProducts.map(prod => {
            if (prod.image_url && (prod.image_url.startsWith('https://images.unsplash.com') || prod.image_url === '')) {
              const fallback = Object.values(FALLBACK_PRODUCTS).flat().find(f => f.slug === prod.slug);
              if (fallback) {
                return { ...prod, image_url: fallback.image_url };
              }
            }
            return prod;
          });
          setFeaturedProducts(updatedProducts);
        } else {
          // Flatten fallback products to load all of them
          const allFallbacks = Object.values(FALLBACK_PRODUCTS).flat();
          setFeaturedProducts(allFallbacks);
        }
      } catch (err) {
        console.warn('Failed to load data from Supabase, using fallback static data.', err);
        const allFallbacks = Object.values(FALLBACK_PRODUCTS).flat();
        setFeaturedProducts(allFallbacks);
      }
    }

    loadData();
  }, []);

  const handleAddToCart = (product: FallbackProduct) => {
    // If it has formats, we take the first format by default
    const formatName = product.formats && product.formats.length > 0 ? product.formats[0].name : undefined;
    const formatPrice = product.formats && product.formats.length > 0 ? product.formats[0].price : product.price;

    addToCart({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: formatPrice,
      unit: product.unit,
      image_url: product.image_url,
      format: formatName,
    });

    setAddedItemName(product.name);
    setTimeout(() => setAddedItemName(null), 2000);
  };

  const handleOrderWhatsApp = (product: FallbackProduct) => {
    const formatName = product.formats && product.formats.length > 0 ? product.formats[0].name : '';
    const formatPrice = product.formats && product.formats.length > 0 ? product.formats[0].price : product.price;
    const unitText = formatName ? `Format ${formatName}` : `1 ${product.unit}`;

    const text = `Bonjour Warriors Market ! Je souhaite commander en express :
- 1x ${product.name} (${unitText}) : ${formatPrice} FCFA
Total : ${formatPrice} FCFA.
Merci de me confirmer la disponibilité et la livraison !`;

    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/2290153302051?text=${encodedText}`, '_blank');
  };

  const categoryOrder = ['epices', 'viandes', 'farines', 'transformes'];

  const getProductCategorySlug = (product: FallbackProduct) => {
    if (product.category_id) {
      const cat = categories.find(c => c.id === product.category_id);
      if (cat) return cat.slug;
    }
    const entries = Object.entries(FALLBACK_PRODUCTS);
    for (const [catSlug, prods] of entries) {
      if (prods.some(pr => pr.slug === product.slug || pr.name === product.name)) {
        return catSlug;
      }
    }
    return '';
  };

  const getSortedProducts = (productsList: FallbackProduct[]) => {
    return [...productsList].sort((a, b) => {
      const slugA = getProductCategorySlug(a);
      const slugB = getProductCategorySlug(b);
      const indexA = categoryOrder.indexOf(slugA);
      const indexB = categoryOrder.indexOf(slugB);
      
      const orderA = indexA === -1 ? 999 : indexA;
      const orderB = indexB === -1 ? 999 : indexB;
      
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      
      return a.name.localeCompare(b.name);
    });
  };

  const filteredProducts = activeCategory === 'all' 
    ? getSortedProducts(featuredProducts)
    : getSortedProducts(featuredProducts.filter(p => getProductCategorySlug(p) === activeCategory));

  return (
    <div className="w-full">
      <JsonLd
        type="LocalBusiness"
        name="Warriors Market"
        description="Votre alimentation saine, notre priorité. Vente de viandes fraîches, farines locales, épices et produits agroalimentaires transformés au Bénin. Livraison rapide à domicile."
        url="https://ampktfwcpopkomrsckjm.supabase.co"
        logo="/logo.png"
        telephone="+2290153302051"
        priceRange="$$"
        address={{
          streetAddress: "Quartier Fidjrossè, Rue de la plage",
          addressLocality: "Cotonou",
          addressCountry: "BJ"
        }}
      />
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-cream via-cream to-primary/10 pt-3 pb-12 md:pt-8 md:pb-20">
        {/* Background decorative blobs */}
        <div className="absolute top-0 right-0 -z-10 h-72 w-72 rounded-full bg-primary/5 blur-3xl md:h-[450px] md:w-[450px]"></div>
        <div className="absolute bottom-0 left-0 -z-10 h-72 w-72 rounded-full bg-accent/5 blur-3xl md:h-[400px] md:w-[400px]"></div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[55fr_45fr] gap-8 xl:gap-12 items-center">
            {/* Text content */}
            <div className="flex flex-col gap-4 text-center lg:text-left">
              <div className="inline-flex self-center lg:self-start items-center gap-1.5 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary tracking-wide uppercase">
                <Sparkles className="h-3.5 w-3.5 fill-current" />
                <span>100% Naturel & Qualité Béninoise</span>
              </div>
              <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-slate-dark leading-[1.05]">
                Votre alimentation saine,<br />
                <span className="text-primary">notre priorité.</span>
              </h1>
              <p className="text-lg text-slate-dark/85 max-w-2xl mx-auto lg:mx-0 md:text-xl font-medium leading-relaxed">
                Découvrez des viandes fraîches découpées avec soin, des farines locales hautement nutritives, des épices naturelles parfumées et des produits agroalimentaires transformés au Bénin.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mt-2">
                <Link
                  href="/about"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white border-2 border-primary/20 px-8 py-4 text-base font-bold text-slate-dark shadow-md hover:bg-cream-dark/50 hover:border-primary/40 hover:-translate-y-0.5 hover:scale-[1.01] active:translate-y-0 transition-all duration-300"
                >
                  <Users className="h-5 w-5 text-primary" />
                  <span>Qui sommes-nous ?</span>
                </Link>
                <Link
                  href="#categories"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-bold text-white shadow-lg shadow-primary/20 hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 hover:scale-[1.01] active:translate-y-0 transition-all duration-300"
                >
                  <span>Commandez maintenant</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>

              {/* Barre de réassurance */}
              <div className="mt-6 pt-6 border-t border-primary/10">
                <div className="flex flex-col sm:flex-row flex-wrap gap-y-3.5 gap-x-6 justify-center lg:justify-start">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#25D366]/10 text-[#25D366]">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="text-xs font-bold text-slate-dark/80 tracking-wide">Livraison rapide à Cotonou</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#25D366]/10 text-[#25D366]">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="text-xs font-bold text-slate-dark/80 tracking-wide">Produits 100% naturels</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#25D366]/10 text-[#25D366]">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="text-xs font-bold text-slate-dark/80 tracking-wide">Paiement à la livraison</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#25D366]/10 text-[#25D366]">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="text-xs font-bold text-slate-dark/80 tracking-wide">Service client réactif</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative w-full aspect-square max-w-[480px] lg:max-w-none mx-auto lg:mx-0">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-primary/20 to-accent/20 rotate-3 -z-10 scale-[1.02] blur-sm"></div>
              <div className="w-full h-full rounded-3xl overflow-hidden shadow-2xl relative border-4 border-white transition-all duration-300 hover:scale-[1.01] hover:shadow-primary/15">
                <Image
                  src="/warriorsmarket.jpg"
                  alt="Épices naturelles Warriors Market"
                  fill
                  priority
                  className="object-cover contrast-[1.05] saturate-[1.08]"
                />
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm p-4 rounded-2xl flex items-center justify-between shadow-md">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-green-500 animate-ping"></div>
                    <span className="text-xs font-bold text-slate-dark">Service de livraison actif à Cotonou</span>
                  </div>
                  <Link href="/livraison" className="text-xs font-bold text-primary hover:underline">
                    Détails
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Notification Toast */}
      {addedItemName && (
        <div className="fixed bottom-24 left-6 z-50 bg-slate-dark text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 animate-slideIn">
          <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-white">
            <Check className="h-4 w-4" />
          </div>
          <p className="text-sm font-semibold">
            {addedItemName} ajouté au panier !
          </p>
        </div>
      )}

      {/* 2. Catégories Section */}
      <section id="categories" className="py-20 bg-cream-dark/30 scroll-mt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-black text-slate-dark sm:text-5xl tracking-tight leading-none">
              Nos Catégories de Produits
            </h2>
            <p className="text-slate-dark/70 mt-3">
              Explorez nos rayons soigneusement approvisionnés pour vos repas du quotidien et événements.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category) => (
              <Link 
                key={category.id} 
                href={`/catalog/${category.slug}`}
                className="group bg-white rounded-3xl overflow-hidden shadow-md food-card-shadow transition-all duration-300 hover:-translate-y-1.5 flex flex-col h-full border border-primary/5"
              >
                <div className="relative aspect-square w-full overflow-hidden shrink-0">
                  <Image
                    src={category.image_url}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-slate-dark group-hover:text-primary transition-colors mb-2">
                    {category.name}
                  </h3>
                  <p className="text-slate-dark/70 text-sm leading-relaxed mb-4 flex-grow">
                    {category.description}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-bold text-accent mt-auto group-hover:text-accent-dark transition-colors">
                    <span>Parcourir</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Pourquoi nous choisir */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-3.5 py-1.5 rounded-full">
              Engagements Qualité
            </span>
            <h2 className="text-4xl font-black text-slate-dark sm:text-5xl tracking-tight leading-none mt-4">
              Pourquoi nous faire confiance ?
            </h2>
            <p className="text-slate-dark/70 mt-3">
              Chez Warriors Market, nous défendons des valeurs fortes pour vous fournir le meilleur de l'agroalimentaire béninois.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            <div className="bg-cream rounded-3xl p-8 flex flex-col items-center text-center shadow-sm border border-primary/5 hover:border-primary/20 transition-colors">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 shadow-inner">
                <Sparkles className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-dark mb-2">Produits Locaux</h3>
              <p className="text-slate-dark/70 text-xs leading-relaxed">
                Valorisation et promotion du terroir agroalimentaire béninois à 100%.
              </p>
            </div>

            <div className="bg-cream rounded-3xl p-8 flex flex-col items-center text-center shadow-sm border border-primary/5 hover:border-primary/20 transition-colors">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 shadow-inner">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-dark mb-2">Produits Bio</h3>
              <p className="text-slate-dark/70 text-xs leading-relaxed">
                Épices naturelles et farines pures sans conservateurs chimiques.
              </p>
            </div>

            <div className="bg-cream rounded-3xl p-8 flex flex-col items-center text-center shadow-sm border border-primary/5 hover:border-primary/20 transition-colors">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 shadow-inner">
                <Flame className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-dark mb-2">Fraîcheur Garantie</h3>
              <p className="text-slate-dark/70 text-xs leading-relaxed">
                Chaîne du froid stricte et viandes découpées fraîches chaque matin.
              </p>
            </div>

            <div className="bg-cream rounded-3xl p-8 flex flex-col items-center text-center shadow-sm border border-primary/5 hover:border-primary/20 transition-colors">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 shadow-inner">
                <Truck className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-dark mb-2">Livraison Rapide</h3>
              <p className="text-slate-dark/70 text-xs leading-relaxed">
                Livraison à domicile à Cotonou et ses environs dans les meilleurs délais.
              </p>
            </div>

            <div className="bg-cream rounded-3xl p-8 flex flex-col items-center text-center shadow-sm border border-primary/5 hover:border-primary/20 transition-colors">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 shadow-inner">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-dark mb-2">Gros & Détail</h3>
              <p className="text-slate-dark/70 text-xs leading-relaxed">
                Des offres flexibles et des tarifs dégressifs adaptés aux professionnels.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Nos Produits Section */}
      <section className="py-20 bg-cream-dark/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-4xl font-black text-slate-dark sm:text-5xl tracking-tight leading-none">
                Nos Produits
              </h2>
              <p className="text-slate-dark/70 mt-2">
                Découvrez toute notre sélection de produits de qualité, prêts à être livrés chez vous.
              </p>
            </div>
            {/* Category tabs */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all uppercase tracking-wide ${
                  activeCategory === 'all'
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-white text-slate-dark hover:bg-cream-dark'
                }`}
              >
                Tout
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveCategory(c.slug)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all uppercase tracking-wide ${
                    activeCategory === c.slug
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-white text-slate-dark hover:bg-cream-dark'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-primary/5">
              <ShoppingBag className="h-12 w-12 text-slate-dark/30 mx-auto mb-4" />
              <p className="text-slate-dark/60 font-semibold">Aucun produit dans cette catégorie pour le moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredProducts.map((product) => {
                const hasFormats = product.formats && product.formats.length > 0;
                const displayPrice = hasFormats && product.formats ? product.formats[0].price : product.price;
                const displayFormat = hasFormats && product.formats ? product.formats[0].name : '';

                return (
                  <div
                    key={product.id}
                    className="group bg-white rounded-3xl overflow-hidden shadow-md food-card-shadow transition-all duration-300 border border-primary/5 flex flex-col h-full"
                  >
                    <div className="relative h-60 w-full overflow-hidden bg-white border-b border-primary/5">
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-contain p-4 group-hover:scale-105 transition-all duration-500 ease-out"
                      />
                      {hasFormats && (
                        <div className="absolute top-4 left-4">
                          <span className="bg-accent text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                            Formats disponibles
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-6 flex flex-col flex-grow">
                      <span className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1.5 block">
                        {product.is_featured ? '⭐ Produit Vedette' : (categories.find(c => c.slug === getProductCategorySlug(product))?.name || 'Produit')}
                      </span>
                      <h3 className="text-lg font-bold text-slate-dark mb-1">
                        {product.name}
                      </h3>
                      <p className="text-slate-dark/70 text-xs line-clamp-2 leading-relaxed mb-4 flex-grow">
                        {product.description}
                      </p>

                      {/* Price & Unit */}
                      <div className="flex items-baseline gap-1 mb-6">
                        <span className="text-xl font-black text-accent">
                          {displayPrice.toLocaleString('fr-FR')} FCFA
                        </span>
                        <span className="text-xs text-slate-dark/60">
                          / {displayFormat || product.unit}
                        </span>
                      </div>

                      {/* Action buttons */}
                      <div className="grid grid-cols-2 gap-2 mt-auto">
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="w-full flex items-center justify-center gap-1.5 bg-cream hover:bg-cream-dark text-slate-dark border border-primary/10 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                        >
                          <CartIcon className="h-3.5 w-3.5" />
                          <span>+ Panier</span>
                        </button>
                        <button
                          onClick={() => handleOrderWhatsApp(product)}
                          className="w-full flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                        >
                          <MessageCircle className="h-3.5 w-3.5 fill-current" />
                          <span>WhatsApp</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 5. Témoignages Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-accent uppercase tracking-widest bg-accent/10 px-3.5 py-1.5 rounded-full">
              Retours Expérience
            </span>
            <h2 className="text-4xl font-black text-slate-dark sm:text-5xl tracking-tight leading-none mt-4">
              Ce que disent nos clients
            </h2>
            <p className="text-slate-dark/70 mt-3">
              Découvrez les témoignages de clients et professionnels de la restauration satisfaits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-cream rounded-3xl p-8 border border-primary/5 flex flex-col justify-between shadow-sm relative">
              <span className="absolute top-6 right-8 text-6xl text-primary/10 font-serif">“</span>
              <p className="text-slate-dark/80 text-sm leading-relaxed mb-6 italic relative z-10">
                "La viande de bœuf est d'une fraîcheur incroyable, très propre et découpée exactement comme je l'avais demandé. Et la livraison à Fidjrossè a été super rapide !"
              </p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                  AD
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-dark">Amina D.</h4>
                  <span className="text-xs text-slate-dark/60">Particulier (Cotonou)</span>
                </div>
              </div>
            </div>

            <div className="bg-cream rounded-3xl p-8 border border-primary/5 flex flex-col justify-between shadow-sm relative">
              <span className="absolute top-6 right-8 text-6xl text-primary/10 font-serif">“</span>
              <p className="text-slate-dark/80 text-sm leading-relaxed mb-6 italic relative z-10">
                "Nous commandons nos farines locales (Baobab et Soja) chez Warriors Market en gros pour notre boulangerie diététique. La qualité est constante et le service client irréprochable."
              </p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                  MK
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-dark">Michel K.</h4>
                  <span className="text-xs text-slate-dark/60">Gérant de Boulangerie</span>
                </div>
              </div>
            </div>

            <div className="bg-cream rounded-3xl p-8 border border-primary/5 flex flex-col justify-between shadow-sm relative">
              <span className="absolute top-6 right-8 text-6xl text-primary/10 font-serif">“</span>
              <p className="text-slate-dark/80 text-sm leading-relaxed mb-6 italic relative z-10">
                "Leurs épices naturelles comme le curcuma et le poivre noir ont transformé le goût des plats dans notre restaurant. De plus, commander par WhatsApp est ultra pratique."
              </p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                  ST
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-dark">Sandra T.</h4>
                  <span className="text-xs text-slate-dark/60">Chef de Cuisine</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Zone de Livraison Section */}
      <section className="py-20 bg-cream-dark/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-md border border-primary/5 flex flex-col lg:flex-row gap-10 items-center">
            <div className="lg:w-1/2 flex flex-col gap-5">
              <div className="inline-flex self-start items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1.5 text-xs font-bold text-accent uppercase">
                <MapPin className="h-3.5 w-3.5" />
                <span>Zone de Service</span>
              </div>
              <h2 className="text-4xl font-black text-slate-dark tracking-tight leading-tight">
                Nous livrons chez vous au Bénin
              </h2>
              <p className="text-slate-dark/85 text-sm leading-relaxed">
                Warriors Market assure la livraison à domicile et au bureau de vos commandes de viandes, farines et épices à Cotonou et ses environs.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                <div className="flex gap-2.5 items-start">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-dark">Cotonou (Intra Muros)</h4>
                    <p className="text-xs text-slate-dark/60">Frais: 1000 - 1500 FCFA | Délai: &lt; 24h</p>
                  </div>
                </div>
                <div className="flex gap-2.5 items-start">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-dark">Calavi & Akpakpa</h4>
                    <p className="text-xs text-slate-dark/60">Frais: 1500 - 2000 FCFA | Délai: &lt; 24h</p>
                  </div>
                </div>
                <div className="flex gap-2.5 items-start">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-dark">Porto-Novo & Ouidah</h4>
                    <p className="text-xs text-slate-dark/60">Frais sur devis | Délai: 24h - 48h</p>
                  </div>
                </div>
                <div className="flex gap-2.5 items-start">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-dark">Autres villes (Bénin)</h4>
                    <p className="text-xs text-slate-dark/60">Envoi par transport terrestre</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <Link
                  href="/livraison"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary-dark"
                >
                  <span>Voir toutes les conditions de livraison</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="lg:w-1/2 w-full relative aspect-video rounded-2xl overflow-hidden shadow-inner bg-cream-dark border border-primary/10">
              {/* Abstract layout representing Benin mapping or delivery visual */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 flex flex-col items-center justify-center p-6 text-center">
                <Truck className="h-16 w-16 text-primary animate-bounce mb-3" />
                <span className="text-base font-bold text-slate-dark">Service de Livraison Express</span>
                <span className="text-xs text-slate-dark/75 mt-1 max-w-sm">Vos produits sont emballés sous vide ou dans des conteneurs isothermes pour garantir une fraîcheur absolue lors du transport.</span>
                <Link 
                  href="tel:+2290153302051"
                  className="mt-4 text-xs font-bold text-white bg-primary hover:bg-primary-dark px-4 py-2 rounded-xl transition-all"
                >
                  Appeler un livreur
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Call-to-action final */}
      <section className="py-20 bg-primary text-white relative overflow-hidden">
        {/* Background decorative ring */}
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full border-8 border-white/10 opacity-20"></div>
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full border-8 border-white/10 opacity-20"></div>

        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8 flex flex-col gap-6 relative z-10">
          <h2 className="text-4xl font-black sm:text-5xl tracking-tight leading-tight">
            Prêt à savourer une alimentation saine ?
          </h2>
          <p className="text-white/80 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Parcourez notre catalogue complet, ajoutez vos produits au panier et validez votre commande en un clic sur WhatsApp.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
            <Link
              href="#categories"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-8 py-4 text-base font-bold text-white shadow-lg shadow-accent/20 hover:bg-accent-dark hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              <span>Voir le Catalogue</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white text-primary px-8 py-4 text-base font-bold hover:bg-cream hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              <span>Nous Contacter</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
