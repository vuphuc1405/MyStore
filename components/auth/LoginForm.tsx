'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom'; // Import from react-dom instead
import { signInUser } from '@/lib/actions/authActions';
import Link from 'next/link';

type AuthState = {
  message: string;
  error: string | null;
  success: boolean;
};

const initialState: AuthState = {
  message: '',
  error: null,
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
    >
      {pending ? 'Đang đăng nhập...' : 'Đăng nhập'}
    </button>
  );
}

export default function LoginForm() {
  // Thay đổi ở đây: useFormState -> useActionState
  const [state, formAction] = useActionState<AuthState, FormData>(signInUser, initialState);

  return (
    <form action={formAction} className="space-y-6">
      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Địa chỉ Email
        </label>
        <div className="mt-1">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="you@example.com"
          />
        </div>
      </div>

      {/* Mật khẩu */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Mật khẩu
        </label>
        <div className="mt-1">
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="********"
          />
        </div>
      </div>

      {/* Thông báo lỗi */}
      {state && state.error && (
        <p className="text-sm text-red-600">{state.error}</p>
      )}

      {/* Thông báo thành công */}
      {state && state.message && !state.error && (
        <p className="text-sm text-green-600">{state.message}</p>
      )}

      {/* Nút đăng nhập */}
      <div>
        <SubmitButton />
      </div>

      {/* Liên kết đăng ký và quên mật khẩu */}
      <div className="text-sm text-center">
        <p className="text-gray-600">
          Chưa có tài khoản?{' '}
          <Link href="/auth/register" className="font-medium text-blue-600 hover:text-blue-500">
            Đăng ký ngay
          </Link>
        </p>
        <p className="mt-2">
          <Link href="/auth/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
            Quên mật khẩu?
          </Link>
        </p>
      </div>
    </form>
  );
}