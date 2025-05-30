// components/auth/RegisterForm.tsx
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { signUpUser } from '@/lib/actions/authActions'; // Server Action của bạn
import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter

// Khai báo initialState
const initialState = {
  message: '',
  error: null as string | null,
  success: false, // success flag để xử lý trong useEffect
};

// Component SubmitButton
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      aria-disabled={pending}
      disabled={pending}
      className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
    >
      {pending ? 'Đang đăng ký...' : 'Đăng ký'}
    </button>
  );
}

// Component RegisterForm
export default function RegisterForm() {
  const router = useRouter(); // Khởi tạo router ở đây
  const [state, formAction] = useActionState(signUpUser, initialState);

  useEffect(() => {
    if (state?.success && !state.error) {
      alert(state.message || 'Đăng ký thành công! Vui lòng đăng nhập.');
      router.push('/auth/login'); // Bây giờ router đã được định nghĩa
    } else if (state?.error) {
      alert(`Lỗi: ${state.error}`);
    }
  }, [state, router]); // Thêm router vào mảng dependency

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <label
          htmlFor="fullName"
          className="block text-sm font-medium text-gray-700"
        >
          Họ và tên
        </label>
        <div className="mt-1">
          <input
            id="fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            required
            className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Nguyễn Văn A"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Địa chỉ Email
        </label>
        <div className="mt-1">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Mật khẩu
        </label>
        <div className="mt-1">
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={6}
            className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="********"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-gray-700"
        >
          Xác nhận Mật khẩu
        </label>
        <div className="mt-1">
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="********"
          />
        </div>
      </div>

      {state?.error && (
        <p className="text-sm text-red-600">{state.error}</p>
      )}
      {state?.message && !state.error && !state.success && (
         <p className="text-sm text-green-600">{state.message}</p>
      )}


      <div>
        <SubmitButton />
      </div>

      <div className="text-sm text-center">
        <p className="text-gray-600">
          Đã có tài khoản?{' '}
          <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
            Đăng nhập
          </Link>
        </p>
      </div>
    </form>
  );
}