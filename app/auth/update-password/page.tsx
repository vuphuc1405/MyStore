// app/auth/update-password/page.tsx
import UpdatePasswordForm from '@/components/auth/UpdatePasswordForm'; // Component bạn sẽ tạo ở bước 2
import Image from 'next/image';
import { assets } from '@/assets/assets'; // Giả sử bạn dùng file này

export default function UpdatePasswordPage() {
  return (
    <div className="flex min-h-screen flex-col justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Image
          className="mx-auto h-12 w-auto"
          src={assets.logo} // Đường dẫn tới logo
          alt="Logo"
          width={48}
          height={48}
          priority
        />
        <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-gray-900">
          Đặt Lại Mật Khẩu Của Bạn
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
          <UpdatePasswordForm />
        </div>
      </div>
    </div>
  );
}