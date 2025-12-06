
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Dumbbell, User, LogOut, Settings, ChevronDown, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, signOut, isAdmin } = useAuth();

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Facilities', path: '/facilities' },
    { name: 'Events', path: '/events' },
    { name: 'Memberships', path: '/memberships' },
    { name: 'About', path: '/about' },
  ];

  // Get the display letter: Username -> Email -> 'U'
  const getAvatarLetter = () => {
    if (!user) return '';
    const metadataName = user.user_metadata?.username;
    if (metadataName && metadataName.length > 0) {
      return metadataName[0].toUpperCase();
    }
    return user.email?.[0]?.toUpperCase() || 'U';
  };

  return (
    <nav className="fixed w-full z-50 glass py-3 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2 group">
              <div className="bg-primary/20 p-2 rounded-lg group-hover:bg-primary transition-colors duration-300">
                <Dumbbell className="h-6 w-6 text-primary group-hover:text-black transition-colors duration-300" />
              </div>
              <span className="font-display font-bold text-2xl tracking-tight text-white">GRIT <span className="text-primary">X</span></span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === link.path
                    ? 'text-primary'
                    : 'text-gray-300'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            <div className="h-6 w-px bg-white/10 mx-2"></div>

            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-black text-sm font-bold hover:bg-white transition-all shadow-neon transform hover:scale-105"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Admin</span>
              </Link>
            )}
            
            {user ? (
               <div className="relative group">
                 <button className="flex items-center gap-2 text-white focus:outline-none py-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm border border-primary/20 shadow-[0_0_10px_rgba(14,169,95,0.2)]">
                        {getAvatarLetter()}
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" />
                 </button>

                 {/* Dropdown Menu */}
                 <div className="absolute right-0 mt-2 w-48 bg-surface border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50 overflow-hidden">
                    <div className="py-1">
                      <Link 
                        to="/profile" 
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                      >
                        <Settings className="h-4 w-4 text-primary" />
                        My Account
                      </Link>
                      <button
                        onClick={signOut}
                        className="flex w-full items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-red-400 transition-colors border-t border-white/5"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                 </div>
               </div>
            ) : (
                <Link
                to="/signin"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-surface border border-white/10 hover:border-primary/50 text-white text-sm font-medium transition-all hover:shadow-neon"
                >
                <User className="h-4 w-4" />
                <span>Sign In</span>
                </Link>
            )}
            
            <Link
              to="/facilities"
              className="px-5 py-2.5 rounded-full bg-primary hover:bg-primary-hover text-black text-sm font-bold transition-all transform hover:scale-105"
            >
              Book Now
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10 focus:outline-none"
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden glass absolute top-full w-full border-t border-white/10">
          <div className="px-4 pt-4 pb-6 space-y-2">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-3 rounded-lg text-base font-medium ${
                  location.pathname === link.path
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 grid grid-cols-2 gap-4">
              {user ? (
                 <>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-black font-bold col-span-2 shadow-neon"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Admin Dashboard
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-surface border border-white/10 text-white font-medium"
                  >
                    My Account
                  </Link>
                  <button
                    onClick={() => { signOut(); setIsOpen(false); }}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-surface border border-white/10 text-white font-medium"
                  >
                    Sign Out
                  </button>
                 </>
              ) : (
                <Link
                    to="/signin"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-surface border border-white/10 text-white font-medium"
                >
                    Sign In
                </Link>
              )}
              
              <Link
                to="/facilities"
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-black font-bold ${user ? 'col-span-2' : ''}`}
              >
                Book Now
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
