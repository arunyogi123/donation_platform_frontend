import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useRouter } from '../../router';
import { Search, Menu, X, ChevronDown, User, Heart, RefreshCw, LogOut } from 'lucide-react';
import { GiveHopeLogo } from '../brand/GiveHopeLogo';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { label: 'Discover', href: '/campaigns' },
    { label: 'Categories', href: '/categories' },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'About', href: '/about' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F6]/95 backdrop-blur-md border-b border-[#E7E5E0] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Brand Wordmark & Logo */}
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center hover:opacity-90 transition-opacity"
            >
              <GiveHopeLogo size="md" />
            </Link>
          </div>


          {/* Zone 2: Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => {
              const isActive = router.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm tracking-normal transition-colors whitespace-nowrap ${
                    isActive
                      ? 'text-[#0D5C3A] font-semibold'
                      : 'text-[#44403C] hover:text-[#1C1917]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Zone 3: Actions (Search, Auth/Profile, Start a Campaign) */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Search Trigger */}
            <button
              type="button"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search campaigns"
              className="p-2 text-[#57534E] hover:text-[#1C1917] rounded-md transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Authenticated vs Guest State */}
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1 text-sm rounded-full hover:bg-[#EFECE6] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0D5C3A]"
                  aria-expanded={profileDropdownOpen}
                >
                  <div className="w-8 h-8 rounded-full bg-[#0D5C3A] text-white flex items-center justify-center font-medium text-xs">
                    {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-[#78716C] hidden sm:block" />
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-[#E7E5E0] shadow-md rounded-md py-1.5 z-50 animate-in fade-in duration-150">
                    <div className="px-4 py-2 border-b border-[#F5F4F0]">
                      <p className="text-xs text-[#78716C]">Signed in as</p>
                      <p className="text-sm font-medium text-[#1C1917] truncate">{user?.email}</p>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-[#44403C] hover:bg-[#FAF9F6] hover:text-[#1C1917]"
                    >
                      <User className="w-4 h-4 text-[#78716C]" />
                      Profile
                    </Link>
                    <Link
                      href="/my-donations"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-[#44403C] hover:bg-[#FAF9F6] hover:text-[#1C1917]"
                    >
                      <Heart className="w-4 h-4 text-[#78716C]" />
                      My Donations
                    </Link>
                    <Link
                      href="/my-recurring-donations"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-[#44403C] hover:bg-[#FAF9F6] hover:text-[#1C1917]"
                    >
                      <RefreshCw className="w-4 h-4 text-[#78716C]" />
                      Recurring Donations
                    </Link>
                    <div className="border-t border-[#F5F4F0] mt-1 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          setProfileDropdownOpen(false);
                          router.push('/');
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left"
                      >
                        <LogOut className="w-4 h-4 text-red-500" />
                        Log out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden sm:inline-block text-sm font-medium text-[#44403C] hover:text-[#1C1917] px-2 py-1 transition-colors"
              >
                Login
              </Link>
            )}

            {/* Primary Action Button */}
            <Link
              href="/start-a-campaign"
              className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold tracking-wide text-white bg-[#0D5C3A] hover:bg-[#0A472C] transition-colors rounded-md shadow-xs whitespace-nowrap"
            >
              Start a Campaign
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#57534E] hover:text-[#1C1917] rounded-md"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Collapsible Search Bar Overlay */}
        {searchOpen && (
          <div className="py-3 border-t border-[#E7E5E0] bg-[#FAF9F6] animate-in fade-in duration-150">
            <form onSubmit={handleSearchSubmit} className="relative max-w-xl mx-auto">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by medical cause, school, community, disaster..."
                className="w-full pl-10 pr-20 py-2.5 bg-white border border-[#D6D3D1] rounded-md text-sm text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:ring-1 focus:ring-[#0D5C3A] focus:border-[#0D5C3A]"
                autoFocus
              />
              <Search className="w-4 h-4 text-[#A8A29E] absolute left-3.5 top-3.5" />
              <button
                type="submit"
                className="absolute right-2 top-2 px-3 py-1 bg-[#0D5C3A] text-white text-xs font-medium rounded hover:bg-[#0A472C]"
              >
                Search
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E7E5E0] bg-white px-4 pt-3 pb-6 space-y-3">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-base font-medium text-[#292524] hover:bg-[#FAF9F6] rounded-md"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="border-t border-[#E7E5E0] pt-3">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="px-3 py-1 text-xs text-[#78716C]">
                  Account: <span className="text-[#1C1917] font-medium">{user?.email}</span>
                </div>
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm text-[#44403C] hover:bg-[#FAF9F6] rounded-md"
                >
                  Profile
                </Link>
                <Link
                  href="/my-donations"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm text-[#44403C] hover:bg-[#FAF9F6] rounded-md"
                >
                  My Donations
                </Link>
                <Link
                  href="/my-recurring-donations"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm text-[#44403C] hover:bg-[#FAF9F6] rounded-md"
                >
                  Recurring Donations
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                    router.push('/');
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
                >
                  Log out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-1">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-sm font-medium text-[#1C1917] border border-[#D6D3D1] rounded-md hover:bg-[#FAF9F6]"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-sm font-medium text-white bg-[#0D5C3A] rounded-md hover:bg-[#0A472C]"
                >
                  Create an Account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
