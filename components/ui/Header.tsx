'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, ShoppingCart, UserCircle, RefreshCw, AlertCircle } from 'lucide-react';
import { assets } from '@/assets/assets';
import { useAuth } from '@/components/hook/useAuth';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

const Header: React.FC = () => {
  const { currentUser, loading, refreshUser } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Force component to re-render when user changes
  const [renderKey, setRenderKey] = useState(0);

  useEffect(() => {
    setRenderKey(prev => prev + 1);
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      console.log('Logging out...');
      setAuthError(null);
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
        setAuthError(error.message);
      } else {
        console.log('Logged out successfully');
        // Force refresh after logout
        setTimeout(() => {
          refreshUser();
          router.push('/');
          router.refresh();
        }, 100);
      }
    } catch (error: any) {
      console.error('Logout failed:', error);
      setAuthError(error.message || 'Logout failed');
    }
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  // Enhanced debug function
  const handleDebugAuth = async () => {
    try {
      console.log('=== DEBUG AUTH ===');
      console.log('Current user from hook:', currentUser?.email || 'null');
      console.log('Loading:', loading);
      
      // Check session first
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      console.log('Session:', session?.user?.email || 'null');
      console.log('Session error:', sessionError?.message || 'none');
      
      // Try to get user only if we have session
      if (session) {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        console.log('User from Supabase:', user?.email || 'null');
        console.log('User error:', userError?.message || 'none');
      }
      
      await refreshUser();
      console.log('=== END DEBUG ===');
      
      setAuthError(null); // Clear any previous errors
    } catch (error: any) {
      console.error('Debug failed:', error);
      setAuthError(error.message);
    }
  };

  // Clear session and retry
  const handleClearSession = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('supabase.auth.token');
      sessionStorage.clear();
      setAuthError(null);
      
      // Force page reload
      window.location.reload();
    } catch (error: any) {
      console.error('Clear session failed:', error);
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50" key={renderKey}>
      {/* Error Banner */}
      {authError && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-red-700">
              <AlertCircle className="w-4 h-4 mr-2" />
              <span>Auth Error: {authError}</span>
            </div>
            <button
              onClick={handleClearSession}
              className="text-red-600 hover:text-red-800 underline"
            >
              Clear Session
            </button>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" passHref>
              <Image
                src={assets.logo}
                alt="Phone Store Logo"
                width={140}
                height={40}
                priority
                className="cursor-pointer"
              />
            </Link>
          </div>

          {/* Menu - Ẩn trên mobile, hiển thị trên desktop */}
          <nav className="hidden md:flex flex-grow justify-center">
            <ul className="flex space-x-6">
              <li><Link href="/" className="text-gray-700 hover:text-blue-600 font-medium transition">Trang chủ</Link></li>
              <li><Link href="/products" className="text-gray-700 hover:text-blue-600 font-medium transition">Sản phẩm</Link></li>
              <li><Link href="/accessories" className="text-gray-700 hover:text-blue-600 font-medium transition">Phụ kiện</Link></li>
              <li><Link href="/promotions" className="text-gray-700 hover:text-blue-600 font-medium transition">Khuyến mãi</Link></li>
            </ul>
          </nav>

          {/* Icons và Đăng nhập/Avatar */}
          <div className="flex items-center space-x-4">
            {/* Thanh tìm kiếm */}
            <form onSubmit={handleSearchSubmit} className="hidden sm:flex items-center">
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 rounded-l-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-3 py-2 rounded-r-md hover:bg-blue-600 transition flex items-center"
              >
                <Search className="w-5 h-5" />
              </button>
            </form>

            {/* Giỏ hàng Icon */}
            <Link href="/cart" className="text-gray-600 hover:text-blue-600">
              <ShoppingCart className="w-6 h-6" />
            </Link>

            {/* Debug Button */}
            <button
              onClick={handleDebugAuth}
              className="text-gray-400 hover:text-gray-600 transition"
              title="Debug Auth State"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* Nút đăng nhập / Avatar người dùng */}
            <div className="relative">
              {loading ? (
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
              ) : currentUser ? (
                <div className="relative group">
                  {currentUser.user_metadata?.avatar_url ? (
                    <Image
                      src={currentUser.user_metadata.avatar_url}
                      alt="User avatar"
                      width={32}
                      height={32}
                      className="rounded-full cursor-pointer ring-2 ring-green-400 ring-offset-1"
                    />
                  ) : (
                    <UserCircle className="w-8 h-8 text-green-600 cursor-pointer" />
                  )}
                  
                  {/* Dropdown menu */}
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {currentUser.user_metadata?.full_name || 'User'}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {currentUser.email}
                      </p>
                    </div>
                    
                    <div className="py-1">
                      <Link 
                        href="/profile" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Tài khoản của tôi
                      </Link>
                      <Link 
                        href="/orders" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Đơn hàng
                      </Link>
                    </div>
                    
                    <div className="border-t border-gray-100 pt-1">
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link href="/auth/login">
                  <button className="bg-blue-500 text-white px-4 py-2 text-sm rounded-md hover:bg-blue-600 transition-colors">
                    Đăng nhập
                  </button>
                </Link>
              )}
            </div>
          </div>  
        </div>
        
        {/* Thanh tìm kiếm cho mobile */}
        <div className="sm:hidden py-2 px-4">
          <form onSubmit={handleSearchSubmit} className="flex items-center w-full">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-l-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-3 py-2 rounded-r-md hover:bg-blue-600 transition flex items-center"
            >
              <Search className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </header>
  );
};

export default Header;