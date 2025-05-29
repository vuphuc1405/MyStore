// hooks/useAuthListener.ts (hoặc components/hooks/useAuthListener.ts)
'use client'; // Custom hook này sẽ chạy ở client

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation'; // Thêm usePathname
import { supabase } from '@/lib/supabase'; // Điều chỉnh đường dẫn nếu cần

export function useAuthListener() {
  const router = useRouter();
  const pathname = usePathname(); // Lấy đường dẫn hiện tại

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      const currentUser = session?.user;

      // Nếu người dùng đã đăng nhập và đang ở trang login/register, chuyển hướng họ đi
      if (currentUser && (pathname === '/auth/login' || pathname === '/auth/register')) {
        router.push('/'); // Chuyển về trang chủ
        router.refresh(); // Refresh để Server Components cập nhật
      }
      // Bạn có thể thêm logic khác ở đây, ví dụ:
      // Nếu người dùng chưa đăng nhập và đang cố truy cập trang cần bảo vệ
      // else if (!currentUser && pathname.startsWith('/dashboard')) { // Ví dụ trang dashboard cần login
      //   router.push('/auth/login');
      // }
    });

    // Cleanup listener khi component unmount
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [router, pathname]); // Thêm pathname vào dependency array

  // Hook này không cần trả về gì nếu nó chỉ thực hiện side effects
  // Hoặc bạn có thể trả về trạng thái người dùng hiện tại nếu muốn
  // return { currentUser: supabase.auth.getUser() }; // Ví dụ
}