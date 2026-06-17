'use client';

import React, { use, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ShoppingBag as CartIcon, 
  MessageCircle, 
  ArrowLeft, 
  ChevronRight, 
  Sparkles, 
  Check,
  Package
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { FALLBACK_CATEGORIES, FALLBACK_PRODUCTS, FallbackProduct, FallbackCategory } from '@/lib/fallbacks';
import { useCart } from '@/context/CartContext';
import JsonLd from '@/components/JsonLd';

export default function CatalogPage({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = use(params);
  const categorySlug = resolvedParams.category;

  const { addToCart } = useCart();
  const [category, setCategory] = useState<FallbackCategory | null>(null);
  const [products, setProducts] = useState<FallbackProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [addedItemName, setAddedItemName] = useState<string | null>(null);
  
  // Track selected formats for products: record of productSlug -> selectedFormatIndex
  const [selectedFormats, setSelectedFormats] = useState<Record<string, number>>({});

  useEffect(() => {
    async function loadCategoryData() {
      setLoading(true);
      
      // 1. Get current category
      const fallbackCat = FALLBACK_CATEGORIES.find(c => c.slug === categorySlug);
      
      try {
        const { data: dbCat, error: catError } = await supabase
          .from('warriors_categories')
          .select('*')
          .eq('slug', categorySlug)
          .single();

        if (dbCat && !catError) {
          const updatedCat = { ...dbCat };
          if (updatedCat.image_url && (updatedCat.image_url.startsWith('https://images.unsplash.com') || updatedCat.image_url === '')) {
            const fallback = FALLBACK_CATEGORIES.find(f => f.slug === updatedCat.slug);
            if (fallback) {
              updatedCat.image_url = fallback.image_url;
            }
          }
          setCategory(updatedCat);
        } else {
          setCategory(fallbackCat || null);
        }

        // 2. Get products in category
        const { data: dbProducts, error: prodError } = await supabase
          .from('warriors_products')
          .select('*')
          .eq('status', 'available'); // only show available in public catalog

        if (dbProducts && !prodError && dbProducts.length > 0) {
          // If we got products from database, we need to map them to the correct category ID
          // Find category ID
          const catId = dbCat?.id || (await supabase.from('warriors_categories').select('id').eq('slug', categorySlug).single()).data?.id;
          
          if (catId) {
            const filteredProds = dbProducts.filter(p => p.category_id === catId);
            const mappedProds = filteredProds.map(prod => {
              if (prod.image_url && (prod.image_url.startsWith('https://images.unsplash.com') || prod.image_url === '')) {
                const fallback = Object.values(FALLBACK_PRODUCTS).flat().find(f => f.slug === prod.slug);
                if (fallback) {
                  return { ...prod, image_url: fallback.image_url };
                }
              }
              return prod;
            });
            setProducts(mappedProds);
          } else {
            setProducts(FALLBACK_PRODUCTS[categorySlug] || []);
          }
        } else {
          setProducts(FALLBACK_PRODUCTS[categorySlug] || []);
        }
      } catch (err) {
        console.warn('Failed to load catalog data from Supabase, using fallback static data.', err);
        setCategory(fallbackCat || null);
        setProducts(FALLBACK_PRODUCTS[categorySlug] || []);
      } finally {
        setLoading(false);
      }
    }

    loadCategoryData();
  }, [categorySlug]);

  // Set default format index for products when products load
  useEffect(() => {
    const initialFormats: Record<string, number> = {};
    products.forEach((prod) => {
      if (prod.formats && prod.formats.length > 0) {
        initialFormats[prod.slug] = 0; // default to first format (usually 250g or 500g)
      }
    });
    setSelectedFormats(initialFormats);
  }, [products]);

  const handleFormatChange = (productSlug: string, formatIndex: number) => {
    setSelectedFormats((prev) => ({
      ...prev,
      [productSlug]: formatIndex,
    }));
  };

  const handleAddToCart = (product: FallbackProduct) => {
    const hasFormats = product.formats && product.formats.length > 0;
    const formatIndex = selectedFormats[product.slug] ?? 0;
    
    const formatName = hasFormats && product.formats ? product.formats[formatIndex].name : undefined;
    const formatPrice = hasFormats && product.formats ? product.formats[formatIndex].price : product.price;

    addToCart({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: formatPrice,
      unit: product.unit,
      image_url: product.image_url,
      format: formatName,
    });

    setAddedItemName(`${product.name}${formatName ? ` (${formatName})` : ''}`);
    setTimeout(() => setAddedItemName(null), 2000);
  };

  const handleOrderWhatsApp = (product: FallbackProduct) => {
    const hasFormats = product.formats && product.formats.length > 0;
    const formatIndex = selectedFormats[product.slug] ?? 0;
    
    const formatName = hasFormats && product.formats ? product.formats[formatIndex].name : '';
    const formatPrice = hasFormats && product.formats ? product.formats[formatIndex].price : product.price;
    const unitText = formatName ? `Format ${formatName}` : `1 ${product.unit}`;

    const text = `Bonjour Warriors Market ! Je souhaite commander en express :
- 1x ${product.name} (${unitText}) : ${formatPrice} FCFA
Total : ${formatPrice} FCFA.
Merci de me confirmer la disponibilité et la livraison !`;

    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/2290153302051?text=${encodedText}`, '_blank');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-slate-dark/70">Chargement des produits...</p>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <Package className="h-16 w-16 text-slate-dark/30 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-dark">Catégorie introuvable</h2>
        <p className="text-slate-dark/60 mt-2 mb-8">La catégorie que vous cherchez n'existe pas.</p>
        <Link href="/" className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-dark">
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full pb-20 bg-cream">
      {products.map((product) => (
        <JsonLd
          key={`jsonld-${product.id}`}
          type="Product"
          name={product.name}
          description={product.description}
          image={product.image_url}
          offers={{
            price: product.price,
            priceCurrency: 'XOF',
            availability: !product.status || product.status === 'available' ? 'in_stock' : 'out_of_stock'
          }}
        />
      ))}
      {/* 1. Header Banner */}
      <div className="relative bg-slate-dark text-white py-16 md:py-24 overflow-hidden border-b-4 border-accent">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-dark/95 to-slate-dark/40 z-10"></div>
        {category.image_url && (
          <Image
            src={category.image_url}
            alt={category.name}
            fill
            priority
            className="object-cover object-center"
          />
        )}
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-20 flex flex-col gap-4">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-semibold text-white/60">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-white/80">Rayons</span>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-accent">{category.name}</span>
          </div>

          <div className="inline-flex self-start items-center gap-1.5 rounded-full bg-accent/20 border border-accent/30 px-3.5 py-1 text-xs font-bold text-accent uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5 fill-current" />
            <span>Rayon {category.name}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black">{category.name}</h1>
          <p className="text-gray-300 text-sm md:text-base max-w-2xl leading-relaxed">
            {category.description}
          </p>
        </div>
      </div>

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

      {/* 2. Product Grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-primary/10">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-dark transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span>Tous les rayons</span>
          </Link>
          <span className="text-xs font-bold text-slate-dark/60 bg-cream-dark px-3 py-1.5 rounded-lg">
            {products.length} {products.length > 1 ? 'produits disponibles' : 'produit disponible'}
          </span>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-primary/5 shadow-sm">
            <Package className="h-16 w-16 text-slate-dark/30 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-dark">Rayon bientôt approvisionné</h3>
            <p className="text-slate-dark/60 text-sm mt-2 max-w-sm mx-auto">
              Nous réapprovisionnons actuellement notre stock de {category.name.toLowerCase()}. Contactez-nous par WhatsApp pour toute demande urgente !
            </p>
            <Link 
              href="https://wa.me/2290153302051"
              target="_blank"
              className="mt-6 inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#20ba59] transition-colors"
            >
              <MessageCircle className="h-5 w-5 fill-current" />
              <span>Demande WhatsApp</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => {
              const hasFormats = product.formats && product.formats.length > 0;
              const formatIndex = selectedFormats[product.slug] ?? 0;
              
              const displayPrice = hasFormats && product.formats ? product.formats[formatIndex].price : product.price;
              const displayFormat = hasFormats && product.formats ? product.formats[formatIndex].name : '';

              return (
                <div
                  key={product.id}
                  className="group bg-white rounded-3xl overflow-hidden shadow-md food-card-shadow transition-all duration-300 border border-primary/5 flex flex-col h-full"
                >
                  {/* Image wrapper */}
                  <div className="relative h-60 w-full overflow-hidden bg-white border-b border-primary/5">
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-contain p-4 group-hover:scale-105 transition-all duration-500 ease-out"
                    />
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-lg font-bold text-slate-dark mb-1">
                      {product.name}
                    </h3>
                    <p className="text-slate-dark/70 text-xs leading-relaxed mb-4 line-clamp-2">
                      {product.description}
                    </p>

                    {/* Format Selector if applicable */}
                    {hasFormats && product.formats && (
                      <div className="mb-4">
                        <label className="block text-[10px] font-bold text-slate-dark/60 uppercase mb-1.5">
                          Choisir le format :
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {product.formats.map((fmt, idx) => (
                            <button
                              key={fmt.name}
                              onClick={() => handleFormatChange(product.slug, idx)}
                              className={`px-3 py-1.5 text-center text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                                formatIndex === idx
                                  ? 'bg-primary/15 border-primary text-primary'
                                  : 'bg-cream/50 border-primary/10 text-slate-dark/80 hover:bg-cream-dark'
                              }`}
                            >
                              {fmt.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Price display */}
                    <div className="flex items-baseline gap-1 mt-auto mb-6">
                      <span className="text-2xl font-black text-accent">
                        {displayPrice.toLocaleString('fr-FR')} FCFA
                      </span>
                      <span className="text-xs text-slate-dark/60">
                        / {displayFormat || product.unit}
                      </span>
                    </div>

                    {/* Action buttons */}
                    <div className="grid grid-cols-2 gap-2">
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
    </div>
  );
}
