'use client';

import React, { useState } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Folder, 
  X, 
  AlertCircle,
  Check
} from 'lucide-react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { FallbackCategory } from '@/lib/fallbacks';

interface CategoryManagerProps {
  initialCategories: FallbackCategory[];
}

export default function CategoryManager({ initialCategories }: CategoryManagerProps) {
  const [categories, setCategories] = useState<any[]>(initialCategories);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image_url: ''
  });

  const [notification, setNotification] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      image_url: ''
    });
    setErrorMsg('');
    setModalOpen(true);
  };

  const handleOpenEdit = (category: any) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      image_url: category.image_url || ''
    });
    setErrorMsg('');
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ? Cela supprimera également tous les produits associés.')) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('warriors_categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setCategories(categories.filter(c => c.id !== id));
      showNotification('Catégorie supprimée avec succès !');
    } catch (err: any) {
      setErrorMsg(err.message || 'Erreur lors de la suppression.');
      setCategories(categories.filter(c => c.id !== id));
      showNotification('Catégorie supprimée localement.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const payload = {
      name: formData.name,
      slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      description: formData.description,
      image_url: formData.image_url || '/warriorsmarket.jpg'
    };

    try {
      if (editingCategory) {
        // Edit mode
        const { data, error } = await supabase
          .from('warriors_categories')
          .update(payload)
          .eq('id', editingCategory.id)
          .select()
          .single();

        if (error) throw error;
        
        setCategories(categories.map(c => c.id === editingCategory.id ? data : c));
        showNotification('Catégorie mise à jour avec succès !');
      } else {
        // Add mode
        const { data, error } = await supabase
          .from('warriors_categories')
          .insert([payload])
          .select()
          .single();

        if (error) throw error;

        setCategories([...categories, data]);
        showNotification('Catégorie créée avec succès !');
      }
      setModalOpen(false);
    } catch (err: any) {
      console.warn('Supabase DB error, performing local state edit simulation', err);
      const mockCategory = {
        id: editingCategory?.id || `mock-${Date.now()}`,
        ...payload
      };
      if (editingCategory) {
        setCategories(categories.map(c => c.id === editingCategory.id ? mockCategory : c));
      } else {
        setCategories([...categories, mockCategory]);
      }
      setModalOpen(false);
      showNotification('Opération simulée localement (base hors ligne).');
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-dark">Gestion des Catégories</h2>
          <p className="text-xs text-slate-dark/60 mt-0.5">Créer, modifier ou supprimer des rayons de la boutique.</p>
        </div>
        
        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-1.5 bg-primary hover:bg-primary-dark text-white px-5 py-3 rounded-xl text-xs font-bold shadow-md transition-colors cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Ajouter une catégorie</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md w-full">
        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-dark/40">
          <Search className="h-4 w-4" />
        </span>
        <input
          type="text"
          placeholder="Rechercher une catégorie..."
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

      {/* Grid Table */}
      <div className="bg-white rounded-3xl border border-primary/5 shadow-sm overflow-hidden">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-16 text-slate-dark/50 text-xs flex flex-col items-center gap-3">
            <Folder className="h-10 w-10 text-slate-dark/30" />
            <span>Aucune catégorie trouvée.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-primary/5 text-slate-dark/50 font-bold uppercase bg-cream-dark/20">
                  <th className="py-4 px-6">Couverture</th>
                  <th className="py-4 px-4">Nom</th>
                  <th className="py-4 px-4">Description</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/5">
                {filteredCategories.map((c) => (
                  <tr key={c.id} className="hover:bg-cream/20">
                    <td className="py-3 px-6">
                      <div className="relative h-12 w-20 rounded-lg overflow-hidden bg-cream border border-primary/10">
                        <Image
                          src={c.image_url || '/warriorsmarket.jpg'}
                          alt={c.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-dark">{c.name}</td>
                    <td className="py-3 px-4 text-slate-dark/80 max-w-xs truncate">{c.description}</td>
                    <td className="py-3 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(c)}
                          className="p-2 text-primary hover:bg-primary/10 rounded-xl transition-colors cursor-pointer"
                          title="Modifier"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                          title="Supprimer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CRUD Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl my-8">
            <div className="bg-slate-dark text-white p-6 flex justify-between items-center border-b border-white/5">
              <h3 className="font-bold text-base">{editingCategory ? 'Modifier la catégorie' : 'Ajouter une catégorie'}</h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 flex flex-col gap-4">
              {errorMsg && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <p className="font-semibold">{errorMsg}</p>
                </div>
              )}

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-dark/80">Nom de la catégorie *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Ex: Épices Aromatiques"
                  className="bg-cream border border-primary/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-dark/80">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  placeholder="Présentation rapide du rayon..."
                  className="bg-cream border border-primary/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-primary resize-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-dark/80">URL de l'image de couverture</label>
                <input
                  type="text"
                  value={formData.image_url}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  placeholder="https://images.unsplash.com/..."
                  className="bg-cream border border-primary/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary"
                />
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
