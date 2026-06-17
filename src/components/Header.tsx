'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Menu, X, Phone } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { cartCount } = useCart();

  const isLinkActive = (path: string) => pathname === path;

  // Don't render global header on admin routes
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const navLinks = [
    { label: 'Accueil', path: '/' },
    { label: 'Viandes', path: '/catalog/viandes' },
    { label: 'Épices', path: '/catalog/epices' },
    { label: 'Farines', path: '/catalog/farines' },
    { label: 'Transformés', path: '/catalog/transformes' },
    { label: 'Vente en Gros', path: '/gros' },
    { label: 'Livraison', path: '/livraison' },
    { label: 'À propos', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-100 transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 md:h-[88px] items-center justify-between transition-all duration-300">
          {/* Logo */}
          <div className="flex items-center ml-4 md:ml-[45px] transition-all duration-300">
            <Link href="/" className="flex items-center group">
              <div className="relative w-[130px] h-[42px] md:w-[190px] md:h-[60px] shrink-0 group-hover:scale-105 transition-transform duration-300">
                <Image
                  src="/logo.png"
                  alt="Warriors Market Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Action Buttons & Mobile Menu */}
          <div className="flex items-center gap-3.5 mr-4 md:mr-[45px] transition-all duration-300">
            {/* Phone (visible on desktop md and up) */}
            <Link
              href="tel:+2290153302051"
              className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 px-3.5 py-2 rounded-xl hover:bg-primary/20 transition-all duration-200"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>+229 0153302051</span>
            </Link>

            {/* Cart (always visible) */}
            <Link
              href="/cart"
              className="relative p-2.5 text-slate-dark hover:text-primary transition-colors duration-200 bg-cream-dark/50 rounded-xl"
            >
              <ShoppingCart className="h-5.5 w-5.5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white ring-2 ring-cream animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Hamburger Menu (always visible) */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 text-slate-dark hover:text-primary bg-cream-dark/50 rounded-xl transition-all duration-200 focus:outline-none cursor-pointer"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Drawer Navigation (Desktop grid, Mobile stack) */}
      {isOpen && (
        <div className="bg-cream border-b border-primary/10 py-8 animate-fadeIn shadow-lg border-t border-primary/5">
          <div className="mx-auto max-w-7xl px-8 md:px-[45px]">
            <nav className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`text-xs xs:text-sm md:text-base font-semibold px-2 py-3 md:px-4 md:py-3.5 rounded-2xl text-center transition-all duration-200 border ${
                    isLinkActive(link.path)
                      ? 'bg-primary text-white border-primary shadow-md shadow-primary/20'
                      : 'text-slate-dark bg-cream-dark/30 border-primary/5 hover:bg-cream-dark hover:border-primary/20'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            
            {/* Phone link inside drawer for mobile only */}
            <div className="mt-8 pt-6 border-t border-primary/10 flex md:hidden justify-center">
              <Link
                href="tel:+2290153302051"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 text-sm font-semibold text-white bg-primary py-3 rounded-xl hover:bg-primary-dark transition-all duration-200 w-full max-w-md"
              >
                <Phone className="h-4 w-4" />
                <span>Appeler : +229 0153302051</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
