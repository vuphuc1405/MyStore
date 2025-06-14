// app/auth/forgot-password/page.tsx
import ForgotPasswordForm from '@/components/auth/ForgetPasswordForm';
import Image from 'next/image';
import { assets } from '@/assets/assets'; // Giả sử bạn có file này để quản lý assets

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Image
          className="mx-auto h-12 w-auto"
          src={assets.logo} // Đường dẫn tới logo của bạn
          alt="Logo"
          width={48}
          height={48}
          priority
        />
        <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-gray-900">
          Khôi phục mật khẩu
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu.
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  );
}