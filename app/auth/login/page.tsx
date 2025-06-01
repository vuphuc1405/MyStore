import LoginForm from '@/components/auth/LoginForm';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import { assets } from '@/assets/assets';

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Nếu đã đăng nhập, chuyển hướng về trang chủ
  if (session) {
    redirect('/');
  }

  return (
    <div className="flex min-h-screen flex-col justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Image
          className="mx-auto h-12 w-auto"
          src={assets.logo}
          alt="Logo"
          width={48}
          height={48}
          priority
        />
        <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-gray-900">
          Đăng nhập vào tài khoản
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}