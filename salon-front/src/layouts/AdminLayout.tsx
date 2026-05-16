import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogOut, Menu, X, BarChart3, Users, Briefcase, Zap, ShoppingCart, Calendar, TrendingUp, FileText } from 'lucide-react';
import { useState } from 'react';
import './AdminLayout.css';

export const AdminLayout = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  if (isLoading) return <div className="loading-screen">Carregando...</div>;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'ADMIN' && user?.role !== 'GERENTE_DE_ATENDIMENTO') {
    return <Navigate to="/" replace />;
  }

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/admin/users', label: 'Clientes', icon: Users },
    { path: '/admin/employees', label: 'Funcionárias', icon: Briefcase },
    { path: '/admin/services', label: 'Serviços', icon: Zap },
    { path: '/admin/products', label: 'Produtos', icon: ShoppingCart },
    { path: '/admin/appointments', label: 'Agendamentos', icon: Calendar },
    { path: '/admin/cashflow', label: 'Fluxo de Caixa', icon: TrendingUp },
    { path: '/admin/reports', label: 'Relatórios', icon: FileText },
    { path: '/admin/audit', label: 'Auditoria', icon: FileText },
  ];

  return (
    <div className="admin-layout">
      <button 
        className="sidebar-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h1 className="sidebar-title">💇‍♀️ Cristiane</h1>
          <span className="admin-badge">Admin</span>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="user-details">
              <div className="user-name">{user?.email?.split('@')[0]}</div>
              <div className="user-role">{user?.role}</div>
            </div>
          </div>
          <button className="logout-btn" onClick={logout} title="Sair">
            <LogOut size={20} />
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
};
