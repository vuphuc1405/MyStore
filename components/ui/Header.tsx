'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, ShoppingCart, User, LogOut, Settings } from 'lucide-react';
import { assets } from '@/assets/assets';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
const Header: React.FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const { user, isLoading, signOut } = useAuth();

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  // Hàm đăng xuất
  const handleSignOut = async () => {
    try {
      await signOut();
      setShowDropdown(false);
      router.push('/');
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error);
    }
  };

  // Hàm lấy ký tự đầu của tên hoặc email để làm avatar
  const getInitials = (name?: string, email?: string) => {
    if (name) {
      return name.charAt(0).toUpperCase();
    }
    if (email) {
      return email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
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

          <nav className="hidden md:flex flex-grow justify-center">
            <ul className="flex space-x-6">
              <li><Link href="/" className="text-gray-700 hover:text-blue-600 font-medium transition">Trang chủ</Link></li>
              <li><Link href="/products" className="text-gray-700 hover:text-blue-600 font-medium transition">Sản phẩm</Link></li>
              <li><Link href="/accessories" className="text-gray-700 hover:text-blue-600 font-medium transition">Phụ kiện</Link></li>
              <li><Link href="/promotions" className="text-gray-700 hover:text-blue-600 font-medium transition">Khuyến mãi</Link></li>
            </ul>
          </nav>

          <div className="flex items-center space-x-4">
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

            <Link href="/cart" className="text-gray-600 hover:text-blue-600">
              <ShoppingCart className="w-6 h-6" />
            </Link>

            {/* User Authentication Section */}
            {isLoading ? (
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            ) : user ? (
              // Hiển thị avatar và dropdown menu khi đã đăng nhập
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Avatar"
                      className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {getInitials(user.name, user.email)}
                    </div>
                  )}
                  <span className="hidden md:block text-sm font-medium max-w-20 truncate">
                    {user.name || user.email.split('@')[0]}
                  </span>
                  <svg
                    className={`w-4 h-4 transition-transform hidden md:block ${showDropdown ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                    <div className="px-4 py-2 border-b">
                      <p className="text-sm font-medium text-gray-900 truncate">{user.name || 'Người dùng'}</p>
                      <p className="text-sm text-gray-500 truncate">{user.email}</p>
                    </div>
                    <Link
                      href="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowDropdown(false)}
                    >
                      <User className="w-4 h-4 mr-2" />
                      Hồ sơ cá nhân
                    </Link>
                    <Link
                      href="/orders"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowDropdown(false)}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Đơn hàng của tôi
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowDropdown(false)}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Cài đặt
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Hiển thị nút đăng nhập khi chưa đăng nhập
              <Link href="/auth/login">
                <button className="bg-blue-500 text-white px-4 py-2 text-sm rounded-md hover:bg-blue-600 transition-colors">
                  Đăng nhập
                </button>
              </Link>
            )}
          </div>
        </div>

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

      {/* Overlay để đóng dropdown khi click bên ngoài */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        ></div>
      )}
    </header>
  );
};

export default Header;