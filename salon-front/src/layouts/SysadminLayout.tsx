import { useState } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Menu, X, ToggleLeft, ShieldAlert, LogOut } from 'lucide-react';

export const SysadminLayout = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [showSidebar, setShowSidebar] = useState(false);
  const location = useLocation();

  if (isLoading) return (
    <div className="flex justify-center items-center h-screen bg-[#fcf9f9]">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#be8a83]"></div>
    </div>
  );

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'SYSADMIN') {
    return <Navigate to="/" replace />;
  }

  const toggleSidebar = () => setShowSidebar(!showSidebar);
  const closeSidebar = () => setShowSidebar(false);

  const menuItems = [
    { to: '/sysadmin/feature-flags', label: 'Feature Flags', icon: ToggleLeft },
    { to: '/sysadmin/audit', label: 'Auditoria', icon: ShieldAlert },
  ];

  return (
    <div className="min-h-screen bg-[#fcf9f9] flex flex-col md:flex-row">
      {/* Mobile Top Navbar */}
      <div className="md:hidden bg-[#3b3036] text-white flex justify-between items-center p-4 shadow-md z-40 sticky top-0">
        <h5 className="m-0 font-heading font-semibold text-lg tracking-wide text-[#e5a49c]">SysAdmin Painel</h5>
        <button 
          onClick={toggleSidebar} 
          className="p-1 hover:text-[#be8a83] focus:outline-none transition-colors"
          aria-label="Toggle navigation"
        >
          {showSidebar ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Overlay when sidebar is open on mobile */}
      {showSidebar && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden transition-opacity" 
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`w-[260px] bg-gradient-to-b from-[#3b3036] to-[#261f23] text-white flex flex-col fixed md:sticky top-0 h-screen z-50 transition-transform duration-300 md:translate-x-0 ${
          showSidebar ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center px-6 py-5 border-b border-white/10">
          <h4 className="font-heading font-bold text-xl tracking-wide text-white">
            SysAdmin <span className="text-[#be8a83]">Painel</span>
          </h4>
          <button 
            className="md:hidden text-white/80 hover:text-white focus:outline-none" 
            onClick={closeSidebar}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={closeSidebar}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group text-sm font-medium ${
                  isActive
                    ? 'bg-[#be8a83] text-white shadow-md shadow-[#be8a83]/10'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-white' : 'text-white/60 group-hover:text-white transition-colors'} />
                {item.label}
              </Link>
            );
          })}

          <button
            onClick={() => { logout(); closeSidebar(); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 text-sm font-semibold mt-8 text-left"
          >
            <LogOut size={18} />
            Sair
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 max-w-full overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
};
