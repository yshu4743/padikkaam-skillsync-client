import React from 'react';
import { useApp } from '../context/AppContext';
import { Coins, Wallet, Plus, User, LogOut, Map, Compass, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { user, view, setView, logout, setShowCreateModal } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { id: 'discover', label: 'Discover', icon: Compass },
    { id: 'map', label: 'Map', icon: Map },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'earnings', label: 'Earnings', icon: Wallet },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('discover')}>
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="font-bold text-xl text-gray-900 hidden sm:block">SkillSync</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setView(id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  view === id ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {user && (
              <>
                {/* Credit Balance */}
                <button
                  onClick={() => setView('earnings')}
                  className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full text-sm font-semibold hover:bg-amber-100 transition-colors"
                  title="Your credit balance"
                >
                  <Coins size={16} />
                  {user.creditBalance}
                </button>

                {/* Create Workshop */}
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="btn-primary flex items-center gap-1.5 text-sm"
                >
                  <Plus size={16} />
                  <span className="hidden sm:inline">Create</span>
                </button>

                {/* User Avatar */}
                <button onClick={() => setView('profile')} className="flex items-center gap-2">
                  <img
                    src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=3b82f6&color=fff`}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                </button>

                {/* Logout */}
                <button onClick={logout} className="text-gray-400 hover:text-red-500 transition-colors" title="Logout">
                  <LogOut size={18} />
                </button>
              </>
            )}

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 text-gray-600"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100 pt-2">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => { setView(id); setMobileOpen(false); }}
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium ${
                  view === id ? 'bg-primary-50 text-primary-700' : 'text-gray-600'
                }`}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
