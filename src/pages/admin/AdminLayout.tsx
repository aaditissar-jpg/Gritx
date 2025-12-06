
import React, { useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Calendar, Users, Settings, LogOut, Dumbbell, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAdmin, loading, signOut } = useAuth();

  useEffect(() => {
    // Only redirect once loading is complete
    if (!loading) {
      if (!user) {
        navigate('/signin');
        return;
      }
      
      // FAIL-SAFE: Check specific email directly here as well
      const isSuperAdmin = user.email?.trim().toLowerCase() === 'aadit.issar@gmail.com';
      
      if (!isAdmin && !isSuperAdmin) {
        navigate('/');
      }
    }
  }, [user, isAdmin, loading, navigate]);

  const handleLogout = async () => {
    await signOut();
    navigate('/signin');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  // Allow render if admin OR super admin email match
  const isSuperAdmin = user?.email?.trim().toLowerCase() === 'aadit.issar@gmail.com';
  if (!user || (!isAdmin && !isSuperAdmin)) return null;

  return (
    <div className="flex h-screen bg-bg text-white font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-surface border-r border-white/5 flex flex-col">
        <div className="p-6 flex items-center gap-2">
           <Dumbbell className="h-6 w-6 text-primary" />
           <span className="font-display font-bold text-xl tracking-tight">GRIT <span className="text-primary">ADMIN</span></span>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <p className="px-4 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Main Menu</p>
          <NavLink 
            to="/admin" end
            className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-primary/10 text-primary border border-primary/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
          >
            <LayoutDashboard className="h-5 w-5" />
            Dashboard
          </NavLink>
          <NavLink 
            to="/admin/bookings" 
            className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-primary/10 text-primary border border-primary/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
          >
            <Calendar className="h-5 w-5" />
            Bookings
          </NavLink>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all">
            <Users className="h-5 w-5" />
            Members
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all">
            <Settings className="h-5 w-5" />
            Settings
          </a>
        </nav>
        
        <div className="p-4 border-t border-white/5">
          <button onClick={handleLogout} className="flex items-center gap-3 text-gray-400 hover:text-white hover:bg-white/5 w-full px-4 py-3 rounded-xl transition-colors">
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8 bg-bg">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
