import { useState } from 'react';
import { Outlet, Navigate, NavLink, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Menu, X, Sparkles } from 'lucide-react';

export const CustomerLayout = () => {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#fcf9f9]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#be8a83]"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#fcf9f9]">
      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <Link to="/" onClick={closeMobileMenu} className="flex items-center gap-2 group">
              <Sparkles className="text-[#be8a83] h-5 w-5 transition-transform group-hover:rotate-12" />
              <span className="font-heading font-semibold text-lg tracking-wide text-[#3b3036] group-hover:text-[#be8a83] transition-colors">
                Salão Cristiane
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              <NavLink 
                to="/my-appointments" 
                className={({ isActive }) => 
                  `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-[#be8a83]/10 text-[#be8a83]' 
                      : 'text-[#3b3036]/70 hover:text-[#3b3036] hover:bg-gray-50'
                  }`
                }
              >
                Meus Agendamentos
              </NavLink>
              <NavLink 
                to="/profile" 
                className={({ isActive }) => 
                  `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-[#be8a83]/10 text-[#be8a83]' 
                      : 'text-[#3b3036]/70 hover:text-[#3b3036] hover:bg-gray-50'
                  }`
                }
              >
                Meu Perfil
              </NavLink>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center">
              <button 
                onClick={logout} 
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-[#3b3036] hover:bg-gray-50 transition-all duration-200"
              >
                Sair da Conta
              </button>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMobileMenu}
                className="p-2 text-[#3b3036] hover:text-[#be8a83] transition-colors focus:outline-none"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white/98 shadow-lg py-4 px-4 space-y-3 animate-fadeIn">
            <div className="space-y-1.5">
              <NavLink 
                to="/my-appointments" 
                onClick={closeMobileMenu}
                className={({ isActive }) => 
                  `block px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-[#be8a83]/10 text-[#be8a83]' 
                      : 'text-[#3b3036]/70 hover:text-[#3b3036] hover:bg-gray-50'
                  }`
                }
              >
                Meus Agendamentos
              </NavLink>
              <NavLink 
                to="/profile" 
                onClick={closeMobileMenu}
                className={({ isActive }) => 
                  `block px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-[#be8a83]/10 text-[#be8a83]' 
                      : 'text-[#3b3036]/70 hover:text-[#3b3036] hover:bg-gray-50'
                  }`
                }
              >
                Meu Perfil
              </NavLink>
            </div>

            <div className="border-t border-gray-100 pt-3">
              <button 
                onClick={() => { logout(); closeMobileMenu(); }} 
                className="w-full text-left px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-[#3b3036] hover:bg-gray-50 transition-all duration-200"
              >
                Sair da Conta
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1 pt-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full py-8 animate-fadeIn">
        <Outlet />
      </main>
    </div>
  );
};
