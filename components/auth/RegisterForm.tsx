// components/auth/RegisterForm.tsx
'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { signUpUser } from '@/lib/actions/authActions'; // Server Action
import Link from 'next/link';

const initialState = {
  message: '',
  error: null as string | null,
  // success: false, // Có thể thêm trường này nếu muốn xử lý thành công cụ thể hơn trước khi redirect
};

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

export default function RegisterForm() {
  const [state, formAction] = useFormState(signUpUser, initialState);

  // useEffect(() => {
  //   if (state?.success && !state.error) {
  //     // Không cần thiết nếu Server Action đã redirect
  //     // alert(state.message || 'Đăng ký thành công! Vui lòng đăng nhập.');
  //     // router.push('/auth/login');
  //   } else if (state?.error) {
  //     // alert(`Lỗi: ${state.error}`);
  //   }
  // }, [state, router]);

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
            minLength={6} // Supabase yêu cầu mật khẩu tối thiểu 6 ký tự
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

      {/* Hiển thị thông báo lỗi hoặc thành công từ Server Action */}
      {state?.error && (
        <p className="text-sm text-red-600">{state.error}</p>
      )}
      {state?.message && !state.error && ( // Thông báo chung (ví dụ: "Vui lòng kiểm tra email để xác thực")
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