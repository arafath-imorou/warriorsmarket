'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

export default function WhatsAppButton() {
  const pathname = usePathname();

  // Don't render floating button on admin routes
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const handleWhatsAppClick = () => {
    const phoneNumber = '2290153302051';
    const message = encodeURIComponent(
      'Bonjour Warriors Market ! Je visite votre site et souhaite avoir des renseignements.'
    );
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl hover:scale-110 hover:rotate-6 active:scale-95 transition-all duration-300 group cursor-pointer"
      title="Contactez-nous sur WhatsApp"
      aria-label="Contactez-nous sur WhatsApp"
    >
      {/* Pulse effect */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-40 animate-ping group-hover:animate-none"></span>

      {/* SVG WhatsApp Icon */}
      <svg
        className="relative h-7 w-7 fill-current"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.403.002 9.794-4.382 9.797-9.774.002-2.611-1.012-5.067-2.855-6.912-1.843-1.845-4.296-2.861-6.91-2.863-5.407 0-9.8 4.385-9.802 9.776-.001 1.73.475 3.424 1.378 4.918l-.92 3.364 3.456-.906zM17.432 14.1c-.296-.148-1.753-.865-2.024-.964-.271-.099-.468-.148-.666.148-.198.296-.765.964-.937 1.162-.172.198-.345.222-.641.074-.296-.148-1.25-.461-2.381-1.468-.881-.785-1.475-1.756-1.647-2.052-.172-.296-.018-.456.13-.603.133-.133.296-.345.444-.518.148-.172.197-.296.296-.494.099-.198.05-.37-.025-.518-.074-.148-.666-1.605-.912-2.197-.24-.577-.48-.498-.666-.508-.172-.007-.37-.01-.567-.01-.198 0-.52.074-.79.37-.271.296-1.036 1.012-1.036 2.468 0 1.456 1.06 2.861 1.208 3.058.148.198 2.086 3.186 5.053 4.47.705.305 1.256.488 1.684.624.71.226 1.356.194 1.867.118.57-.085 1.753-.716 2.001-1.407.248-.691.248-1.284.172-1.407-.074-.124-.272-.198-.57-.347z" />
      </svg>
    </button>
  );
}
