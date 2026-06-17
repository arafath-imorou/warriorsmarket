'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  FolderKanban, 
  Receipt, 
  Users, 
  LogOut,
  Menu,
  X,
  Sparkles
} from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/admin/auth', {
        method: 'DELETE'
      });

      if (response.ok) {
        router.push('/admin/login');
        router.refresh();
      }
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const navItems = [
    { label: 'Tableau de bord', path: '/admin', icon: LayoutDashboard },
    { label: 'Produits', path: '/admin/products', icon: ShoppingBag },
    { label: 'Catégories', path: '/admin/categories', icon: FolderKanban },
    { label: 'Commandes', path: '/admin/orders', icon: Receipt },
    { label: 'Clients', path: '/admin/customers', icon: Users },
  ];

  return (
    <>
      {/* Mobile Top Navbar for Admin */}
      <div className="lg:hidden bg-slate-dark text-white flex items-center justify-between px-6 py-4 sticky top-0 z-30">
        <Link href="/admin" className="flex items-center">
          <div className="relative h-10 w-36 shrink-0">
            <Image
              src="/logo.png"
              alt="Warriors Market Logo"
              fill
              className="object-contain object-left"
            />
          </div>
        </Link>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-white hover:text-primary transition-colors focus:outline-none"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Main Sidebar */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-dark text-white flex flex-col justify-between border-r border-white/5 transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:sticky lg:h-screen lg:top-0`}
      >
        <div className="flex flex-col gap-8 py-8 px-6">
          {/* Logo */}
          <div className="flex items-center justify-between">
            <Link href="/admin" className="flex items-center">
              <div className="relative h-14 w-44 shrink-0">
                <Image
                  src="/logo.png"
                  alt="Warriors Market Logo"
                  fill
                  className="object-contain object-left"
                />
              </div>
            </Link>
            <button onClick={() => setIsOpen(false)} className="lg:hidden p-1 hover:text-primary">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-xs font-bold transition-all ${
                    active 
                      ? 'bg-primary text-white shadow-md shadow-primary/20' 
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className="h-4.5 w-4.5 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom actions (Logout) */}
        <div className="p-6 border-t border-white/5 flex flex-col gap-4">
          <Link
            href="/"
            className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-accent bg-accent/10 py-2.5 rounded-xl hover:bg-accent/20 transition-all uppercase tracking-wider"
          >
            <span>Retour sur le site</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors w-full text-left cursor-pointer"
          >
            <LogOut className="h-4.5 w-4.5 shrink-0" />
            <span>Se déconnecter</span>
          </button>
        </div>
      </aside>
    </>
  );
}
