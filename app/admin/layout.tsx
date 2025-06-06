// app/admin/layout.tsx
import { ReactNode } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server'; //
import { redirect } from 'next/navigation';
import Header from '@/components/ui/Header'; //
import Footer from '@/components/ui/Footer'; //

// Hàm lấy thông tin user và kiểm tra vai trò admin
// Bạn cần đảm bảo trường is_admin có trong bảng public.users và được đồng bộ/cập nhật đúng
async function getUserWithAdminRole() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // Lấy thông tin từ bảng public.users
  const { data: profileData, error: profileError } = await supabase
    .from('users') // Giả sử bảng người dùng public của bạn là 'users'
    .select('is_admin')
    .eq('id', user.id)
    .single();

  if (profileError && profileError.code !== 'PGRST116') {
    console.error('Error fetching user profile for admin check:', profileError);
    return { ...user, isAdmin: false };
  }

  return {
    ...user,
    isAdmin: profileData?.is_admin || false,
  };
}


export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const userData = await getUserWithAdminRole();

  if (!userData) {
    redirect('/auth/login?message=Bạn cần đăng nhập để truy cập trang này.');
  }

  if (!userData.isAdmin) {
    // Hoặc redirect về trang chủ với thông báo không có quyền
    redirect('/?error=Bạn không có quyền truy cập vào khu vực quản trị.');
  }

  // Nếu là admin, hiển thị layout admin
  return (
    <>
      <Header /> {/* Có thể bạn muốn một Header khác cho admin */}
      <div className="flex min-h-screen">
        <aside className="w-64 bg-gray-800 text-white p-4 space-y-2">
          <h2 className="text-xl font-semibold mb-4">Admin Panel</h2>
          <nav>
            <ul>
              <li><Link href="/admin/dashboard" className="block py-2 px-3 hover:bg-gray-700 rounded">Dashboard</Link></li>
              <li><Link href="/admin/products" className="block py-2 px-3 hover:bg-gray-700 rounded">Quản lý Sản phẩm</Link></li>
              <li><Link href="/admin/categories" className="block py-2 px-3 hover:bg-gray-700 rounded">Quản lý Danh mục</Link></li>
              <li><Link href="/admin/brands" className="block py-2 px-3 hover:bg-gray-700 rounded">Quản lý Thương hiệu</Link></li>
              <li><Link href="/admin/orders" className="block py-2 px-3 hover:bg-gray-700 rounded">Quản lý Đơn hàng</Link></li>
              {/* Thêm các link quản trị khác */}
            </ul>
          </nav>
        </aside>
        <main className="flex-1 p-6 bg-gray-100">
          {children}
        </main>
      </div>
      <Footer />
    </>
  );
}