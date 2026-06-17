'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, User, ArrowLeft, ShieldAlert } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la connexion.');
      }

      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8">
      {/* Top back button */}
      <div className="max-w-md w-full mx-auto">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:text-primary-dark transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Retour sur le site</span>
        </Link>
      </div>

      {/* Main card */}
      <div className="max-w-md w-full mx-auto bg-white rounded-3xl p-8 md:p-10 border border-primary/5 shadow-xl">
        <div className="text-center flex flex-col items-center gap-4 mb-8">
          <div className="h-16 w-16 rounded-2xl bg-primary/15 flex items-center justify-center text-primary shadow-inner">
            <Lock className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-dark">Espace Admin</h1>
            <p className="text-xs text-slate-dark/65 mt-1">Connectez-vous pour gérer le catalogue et les commandes</p>
          </div>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-3 rounded-xl flex items-center gap-2.5 mb-6">
            <ShieldAlert className="h-4.5 w-4.5 shrink-0" />
            <p className="font-semibold">{errorMsg}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="username" className="text-xs font-bold text-slate-dark/80">Identifiant</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-dark/40">
                <User className="h-4 w-4" />
              </span>
              <input
                type="text"
                id="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Identifiant administrateur"
                className="bg-cream border border-primary/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-primary w-full"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-xs font-bold text-slate-dark/80">Mot de passe</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-dark/40">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type="password"
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="bg-cream border border-primary/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-primary w-full"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white py-4 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 transition-all disabled:opacity-50 mt-2 cursor-pointer"
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <span>Se connecter</span>
            )}
          </button>
        </form>
      </div>

      {/* Footer copyright */}
      <div className="text-center text-[10px] text-slate-dark/45 max-w-md w-full mx-auto">
        <p>© {new Date().getFullYear()} Warriors Market. Tous droits réservés.</p>
      </div>
    </div>
  );
}
