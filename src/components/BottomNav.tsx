"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  // Hide nav on certain routes (like login, checkout, admin, kitchen)
  if (
    pathname === "/login" || 
    pathname.startsWith("/admin") || 
    pathname.startsWith("/kitchen") ||
    pathname.includes("checkout")
  ) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 w-full flex justify-between items-end px-4 pb-6 pt-3 bg-[#1c1c18] backdrop-blur-md z-50 rounded-t-[2rem] shadow-[0_-10px_30px_rgba(28,28,24,0.15)] border-t border-[#31302c]">
      
      <Link href="/menu" className={`flex-1 flex flex-col items-center justify-center transition-opacity ${pathname === '/menu' ? 'opacity-100 text-[#ffb874]' : 'opacity-60 hover:opacity-100 text-[#fdf9f2]'}`}>
        <span className="material-symbols-outlined">local_cafe</span>
        <span className="font-label text-[9px] uppercase tracking-widest font-medium mt-1">Explore</span>
      </Link>

      <Link href="/orders" className={`flex-1 flex flex-col items-center justify-center transition-opacity ${pathname === '/orders' ? 'opacity-100 text-[#ffb874]' : 'opacity-60 hover:opacity-100 text-[#fdf9f2]'}`}>
        <span className="material-symbols-outlined">receipt_long</span>
        <span className="font-label text-[9px] uppercase tracking-widest font-medium mt-1">Orders</span>
      </Link>

      {/* Prominent Scan Button */}
      <Link href="/" className="flex-1 flex flex-col items-center justify-center relative -top-6">
        <div className="w-16 h-16 bg-[#894d00] text-white rounded-full flex items-center justify-center shadow-xl shadow-[#894d00]/30 border-4 border-[#fdf9f2] dark:border-[#1c1c18] active:scale-90 transition-transform">
          <span className="material-symbols-outlined text-3xl">qr_code_scanner</span>
        </div>
        <span className="font-label text-[10px] uppercase tracking-[0.15em] font-bold text-[#894d00] mt-2">Scan</span>
      </Link>

      <Link href="/cart" className={`flex-1 flex flex-col items-center justify-center transition-opacity ${pathname === '/cart' ? 'opacity-100 text-[#ffb874]' : 'opacity-60 hover:opacity-100 text-[#fdf9f2]'}`}>
        <span className="material-symbols-outlined">shopping_cart</span>
        <span className="font-label text-[9px] uppercase tracking-widest font-medium mt-1">Cart</span>
      </Link>

      <Link href="/profile" className={`flex-1 flex flex-col items-center justify-center transition-opacity ${pathname === '/profile' ? 'opacity-100 text-[#ffb874]' : 'opacity-60 hover:opacity-100 text-[#fdf9f2]'}`}>
        <span className="material-symbols-outlined">person</span>
        <span className="font-label text-[9px] uppercase tracking-widest font-medium mt-1">Profile</span>
      </Link>
      
    </nav>
  );
}
