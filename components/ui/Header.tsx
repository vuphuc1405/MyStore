'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, ShoppingCart} from 'lucide-react';
import { assets } from '@/assets/assets';
import { useRouter } from 'next/navigation';

const Header: React.FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
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

            <Link href="/auth/login">
              <button className="bg-blue-500 text-white px-4 py-2 text-sm rounded-md hover:bg-blue-600 transition-colors">
                Đăng nhập
              </button>
            </Link>
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
    </header>
  );
};

export default Header;
