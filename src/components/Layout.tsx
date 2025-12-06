
import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { LayoutDashboard } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAuth } from '../context/AuthContext';

const Layout: React.FC = () => {
  const { user, isAdmin } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-100 bg-bg relative">
      {/* Cinematic Noise Texture Overlay - Lowered Z-Index */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      
      <Navbar />
      
      <main className="flex-grow relative z-10">
        <Outlet />
      </main>
      
      <Footer />

      {/* FAILSAFE: Floating Admin Button (Bottom Right) */}
      {isAdmin && (
        <Link 
          to="/admin" 
          className="fixed bottom-8 right-8 z-[10000] bg-primary text-black font-bold px-6 py-4 rounded-full shadow-[0_0_30px_rgba(14,169,95,0.6)] flex items-center gap-3 hover:scale-110 transition-transform animate-pulse-slow border-2 border-white"
        >
          <LayoutDashboard className="h-6 w-6" />
          <span className="hidden md:inline">Command Center</span>
        </Link>
      )}

      {/* DEBUG BAR (Bottom Left) */}
      {user && (
        <div className="fixed bottom-4 left-4 z-[10000] bg-black/80 backdrop-blur border border-white/10 px-4 py-2 rounded-lg text-xs text-gray-400 font-mono pointer-events-none">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isAdmin ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span>{user.email}</span>
          </div>
          <div className="mt-1 opacity-75">
            Role: {isAdmin ? 'ADMIN' : 'USER'}
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
