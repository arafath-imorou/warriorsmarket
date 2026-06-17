'use client';

import React, { useState } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Package, 
  X, 
  AlertCircle,
  Eye,
  Check
} from 'lucide-react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { FallbackProduct, FallbackCategory } from '@/lib/fallbacks';

interface ProductManagerProps {
  initialProducts: FallbackProduct[];
  categories: FallbackCategory[];
}

export default function ProductManager({ initialProducts, categories }: ProductManagerProps) {
  const [products, setProducts] = useState<any[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    unit: 'kg',
    category_id: categories[0]?.id || '',
    image_url: '',
    status: 'available',
    is_featured: false,
    formatsText: '' // JSON text for formats
  });

  const [notification, setNotification] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      unit: 'kg',
      category_id: categories[0]?.id || '',
      image_url: '',
      status: 'available',
      is_featured: false,
      formatsText: '[]'
    });
    setErrorMsg('');
    setModalOpen(true);
  };

  const handleOpenEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      unit: product.unit,
      category_id: product.category_id || '',
      image_url: product.image_url || '',
      status: product.status || 'available',
      is_featured: !!product.is_featured,
      formatsText: product.formats ? JSON.stringify(product.formats, null, 2) : '[]'
    });
    setErrorMsg('');
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('warriors_products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setProducts(products.filter(p => p.id !== id));
      showNotification('Produit supprimé avec succès !');
    } catch (err: any) {
      setErrorMsg(err.message || 'Erreur lors de la suppression.');
      // Local state fallback if offline
      setProducts(products.filter(p => p.id !== id));
      showNotification('Produit supprimé localement.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    let parsedFormats = [];
    try {
      if (formData.formatsText) {
        parsedFormats = JSON.parse(formData.formatsText);
        if (!Array.isArray(parsedFormats)) {
          throw new Error('Les formats doivent être un tableau JSON.');
        }
      }
    } catch (err: any) {
      setErrorMsg('Format JSON invalide pour les formats. Exemple: [{"name": "250g", "price": 1500}]');
      setLoading(false);
      return;
    }

    const payload = {
      name: formData.name,
      slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      description: formData.description,
      price: Number(formData.price),
      unit: formData.unit,
      category_id: formData.category_id || null,
      image_url: formData.image_url || '/warriorsmarket.jpg',
      status: formData.status,
      is_featured: formData.is_featured,
      formats: parsedFormats
    };

    try {
      if (editingProduct) {
        // Edit mode
        const { data, error } = await supabase
          .from('warriors_products')
          .update(payload)
          .eq('id', editingProduct.id)
          .select()
          .single();

        if (error) throw error;
        
        setProducts(products.map(p => p.id === editingProduct.id ? data : p));
        showNotification('Produit mis à jour avec succès !');
      } else {
        // Add mode
        const { data, error } = await supabase
          .from('warriors_products')
          .insert([payload])
          .select()
          .single();

        if (error) throw error;

        setProducts([data, ...products]);
        showNotification('Produit créé avec succès !');
      }
      setModalOpen(false);
    } catch (err: any) {
      console.warn('Supabase DB error, performing local state edit simulation', err);
      // Simulate locally if offline/network error
      const mockProduct = {
        id: editingProduct?.id || `mock-${Date.now()}`,
        ...payload
      };
      if (editingProduct) {
        setProducts(products.map(p => p.id === editingProduct.id ? mockProduct : p));
      } else {
        setProducts([mockProduct, ...products]);
      }
      setModalOpen(false);
      showNotification('Opération simulée localement (base hors ligne).');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header and Add button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-dark">Gestion des Produits</h2>
          <p className="text-xs text-slate-dark/60 mt-0.5">Ajouter, modifier ou retirer des articles du site.</p>
        </div>
        
        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-1.5 bg-primary hover:bg-primary-dark text-white px-5 py-3 rounded-xl text-xs font-bold shadow-md transition-colors cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Ajouter un produit</span>
        </button>
      </div>

      {/* Search filter bar */}
      <div className="relative max-w-md w-full">
        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-dark/40">
          <Search className="h-4 w-4" />
        </span>
        <input
          type="text"
          placeholder="Rechercher un produit par nom..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-white border border-primary/5 rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none focus:border-primary w-full shadow-sm"
        />
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

      {/* Table grid */}
      <div className="bg-white rounded-3xl border border-primary/5 shadow-sm overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 text-slate-dark/50 text-xs flex flex-col items-center gap-3">
            <Package className="h-10 w-10 text-slate-dark/30" />
            <span>Aucun produit trouvé.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-primary/5 text-slate-dark/50 font-bold uppercase bg-cream-dark/20">
                  <th className="py-4 px-6">Image</th>
                  <th className="py-4 px-4">Nom</th>
                  <th className="py-4 px-4">Catégorie</th>
                  <th className="py-4 px-4">Prix de base</th>
                  <th className="py-4 px-4">Unité</th>
                  <th className="py-4 px-4">Statut</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/5">
                {filteredProducts.map((p) => {
                  const categoryName = categories.find(c => c.id === p.category_id)?.name || 'Non classé';
                  return (
                    <tr key={p.id} className="hover:bg-cream/20">
                      <td className="py-3 px-6">
                        <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-cream border border-primary/10">
                          <Image
                            src={p.image_url || '/warriorsmarket.jpg'}
                            alt={p.name}
                            fill
                            className="object-contain p-1"
                          />
                        </div>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-dark">
                        <div className="flex flex-col">
                          <span>{p.name}</span>
                          {p.is_featured && (
                            <span className="text-[9px] text-accent font-extrabold uppercase mt-0.5">★ Vedette</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-dark/80 font-semibold">{categoryName}</td>
                      <td className="py-3 px-4 font-bold text-primary">{Number(p.price).toLocaleString('fr-FR')} FCFA</td>
                      <td className="py-3 px-4 text-slate-dark/60">{p.unit}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          p.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {p.status === 'available' ? 'En stock' : 'Rupture'}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="p-2 text-primary hover:bg-primary/10 rounded-xl transition-colors cursor-pointer"
                            title="Modifier"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                            title="Supprimer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CRUD Modal (Add / Edit) */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl my-8">
            <div className="bg-slate-dark text-white p-6 flex justify-between items-center border-b border-white/5">
              <h3 className="font-bold text-base">{editingProduct ? 'Modifier le produit' : 'Ajouter un produit'}</h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 flex flex-col gap-4 overflow-y-auto max-h-[70vh]">
              {errorMsg && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <p className="font-semibold">{errorMsg}</p>
                </div>
              )}

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-dark/80">Nom du produit *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Ex: Viande de Bœuf hachée"
                  className="bg-cream border border-primary/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-dark/80">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={2}
                  placeholder="Description du produit..."
                  className="bg-cream border border-primary/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-primary resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-dark/80">Prix de base (FCFA) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    placeholder="Ex: 3500"
                    className="bg-cream border border-primary/10 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-dark/80">Unité *</label>
                  <input
                    type="text"
                    required
                    value={formData.unit}
                    onChange={(e) => setFormData({...formData, unit: e.target.value})}
                    placeholder="Ex: kg, pièce, pot"
                    className="bg-cream border border-primary/10 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-dark/80">Catégorie *</label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                    className="bg-cream border border-primary/10 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-primary cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-dark/80">URL de la photo (Optionnel)</label>
                <input
                  type="text"
                  value={formData.image_url}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  placeholder="https://images.unsplash.com/..."
                  className="bg-cream border border-primary/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary"
                />
              </div>

              {/* Formats text (JSON array) */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-dark/80">
                  Formats spécifiques (JSON optionnel)
                </label>
                <textarea
                  value={formData.formatsText}
                  onChange={(e) => setFormData({...formData, formatsText: e.target.value})}
                  rows={2}
                  placeholder='Ex: [{"name": "250g", "price": 1500}, {"name": "500g", "price": 2800}]'
                  className="bg-cream border border-primary/10 rounded-xl px-4 py-2 text-[10px] font-mono focus:outline-none focus:border-primary resize-none"
                />
              </div>

              <div className="flex gap-6 mt-2">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-dark/80 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({...formData, is_featured: e.target.checked})}
                    className="rounded text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                  />
                  <span>Produit Vedette (Featured)</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-slate-dark/80 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.status === 'available'}
                    onChange={(e) => setFormData({...formData, status: e.target.checked ? 'available' : 'out_of_stock'})}
                    className="rounded text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                  />
                  <span>En Stock / Actif</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-primary/5 pt-4 mt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="bg-cream hover:bg-cream-dark text-slate-dark px-4 py-2.5 rounded-xl text-xs font-bold border border-primary/10 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl text-xs font-bold disabled:opacity-50 cursor-pointer"
                >
                  {loading ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
