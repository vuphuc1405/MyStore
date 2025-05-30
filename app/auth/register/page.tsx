// app/auth/register/page.tsx
import RegisterForm from '@/components/auth/RegisterForm';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function RegisterPage() {
  const supabase = await createClient();

  const { data: { session } } = await supabase.auth.getSession();

  // Nếu đã có session (người dùng đã đăng nhập), chuyển hướng về trang chủ
  if (session) {
    redirect('/');
  }

  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Thay bằng logo của bạn nếu có */}
        <img
          className="mx-auto h-10 w-auto"
          src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
          alt="MyStore Logo"
        />
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Tạo tài khoản mới
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}