import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CollegeLogo } from '../common/CollegeLogo';
import { Menu, X } from 'lucide-react';

export const PublicNavbar: React.FC = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-[#D9E0E7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo on Left: Real KITS Ramtek Official Emblem + Title */}
          <Link to="/" className="flex items-center">
            <CollegeLogo size="sm" showSubtitle={true} />
          </Link>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7">
            <Link
              to="/"
              className={`text-xs sm:text-sm font-medium transition-colors ${
                location.pathname === '/' ? 'text-[#123B63] font-semibold' : 'text-[#65758B] hover:text-[#0B2945]'
              }`}
            >
              Home
            </Link>
            <a
              href="#about"
              onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}
              className="text-xs sm:text-sm font-medium text-[#65758B] hover:text-[#0B2945] transition-colors"
            >
              About
            </a>
            <a
              href="#how-it-works"
              onClick={(e) => { e.preventDefault(); scrollToSection('how-it-works'); }}
              className="text-xs sm:text-sm font-medium text-[#65758B] hover:text-[#0B2945] transition-colors"
            >
              How It Works
            </a>
            <a
              href="#activities"
              onClick={(e) => { e.preventDefault(); scrollToSection('activities'); }}
              className="text-xs sm:text-sm font-medium text-[#65758B] hover:text-[#0B2945] transition-colors"
            >
              Activities
            </a>
            <a
              href="#guidelines"
              onClick={(e) => { e.preventDefault(); scrollToSection('guidelines'); }}
              className="text-xs sm:text-sm font-medium text-[#65758B] hover:text-[#0B2945] transition-colors"
            >
              Guidelines
            </a>
            <Link
              to="/login"
              className="text-xs sm:text-sm font-medium text-[#65758B] hover:text-[#0B2945] transition-colors"
            >
              Login
            </Link>
          </nav>

          {/* Action Button: Institutional Login button */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#123B63] hover:bg-[#0B2945] rounded-[5px] transition-colors"
            >
              Login to Portal
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-[4px] border border-[#D9E0E7] text-[#243447] hover:bg-[#F5F7F9]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-[#D9E0E7] space-y-2 bg-white">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-1.5 text-sm font-medium text-[#123B63]"
            >
              Home
            </Link>
            <button
              onClick={() => scrollToSection('about')}
              className="block w-full text-left px-3 py-1.5 text-sm font-medium text-[#65758B] hover:text-[#0B2945]"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="block w-full text-left px-3 py-1.5 text-sm font-medium text-[#65758B] hover:text-[#0B2945]"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('activities')}
              className="block w-full text-left px-3 py-1.5 text-sm font-medium text-[#65758B] hover:text-[#0B2945]"
            >
              Activities
            </button>
            <button
              onClick={() => scrollToSection('guidelines')}
              className="block w-full text-left px-3 py-1.5 text-sm font-medium text-[#65758B] hover:text-[#0B2945]"
            >
              Guidelines
            </button>
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-1.5 text-sm font-medium text-[#123B63] font-semibold"
            >
              Login to Portal
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

