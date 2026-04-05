import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: "Dashboard", href: "/admin/analytics", icon: "dashboard", activePaths: ["/admin/analytics"] },
    { label: "Menu Management", href: "/admin/menu", icon: "menu_book", activePaths: ["/admin/menu"] },
    { label: "Order History", href: "/admin/orders", icon: "receipt_long", activePaths: ["/admin/orders"] },
    { label: "Table & QR", href: "/admin/tables", icon: "qr_code_2", activePaths: ["/admin/tables"] },
    { label: "Kitchen Display", href: "/kitchen", icon: "soup_kitchen", activePaths: ["/kitchen"] },
    { label: "Settings", href: "/admin/settings", icon: "settings", activePaths: ["/admin/settings"] },
  ];

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 bg-[#fdf9f2] border-r border-[#ebe8e1] flex flex-col py-8 shadow-lg z-50">
      <div className="px-6 mb-8">
        <h1 className="text-2xl font-bold italic text-[#894d00] font-headline">The Roasted Bean</h1>
        <p className="text-xs font-medium opacity-60 uppercase tracking-widest mt-1 text-[#1c1c18]">Artisan Roast Admin</p>
      </div>
      
      <nav className="flex-grow space-y-1">
        {navItems.map((item) => {
          const isActive = item.activePaths.some(p => pathname?.startsWith(p));
          
          if (isActive) {
            return (
              <div key={item.label} className="bg-[#894d00] text-white rounded-full font-bold px-4 py-3 mx-2 my-1 flex items-center gap-3 shadow-md">
                <span className="material-symbols-outlined">{item.icon}</span>
                <span className="text-sm">{item.label}</span>
              </div>
            );
          }

          return (
            <Link key={item.label} href={item.href} className="text-[#1c1c18] px-4 py-3 mx-2 my-1 flex items-center gap-3 hover:bg-[#f7f3ec] rounded-full transition-colors group">
              <span className="material-symbols-outlined opacity-70 group-hover:opacity-100">{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="mt-auto px-6 border-t border-[#ebe8e1] pt-6">
        <div className="flex items-center gap-3">
          <img 
            alt="Manager Profile" 
            className="w-10 h-10 rounded-full object-cover border-2 border-[#894d00]/20" 
            src="https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=200&auto=format&fit=crop" 
          />
          <div>
            <p className="text-sm font-bold text-[#1c1c18]">James Miller</p>
            <p className="text-[10px] text-[#534437] opacity-80 uppercase">Senior Manager</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
