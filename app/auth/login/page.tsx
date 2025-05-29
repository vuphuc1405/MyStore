// app/auth/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase'; // Đảm bảo đường dẫn này đúng

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false); // Thêm state cho Google login

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    // ... (code đăng nhập bằng email/password giữ nguyên)
  };

  const handleGoogleLogin = async () => {
    setLoadingGoogle(true);
    setError(null);
    try {
      const { error: googleError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // Bạn có thể thêm redirectTo ở đây nếu muốn chuyển hướng sau khi callback
          // redirectTo: `${window.location.origin}/auth/callback` // Ví dụ
        },
      });

      if (googleError) {
        setError(googleError.message);
        setLoadingGoogle(false);
      }
      // Supabase sẽ tự động chuyển hướng người dùng đến trang đăng nhập Google
      // và sau đó quay lại callback URL đã cấu hình.
      // Việc xử lý session sẽ được thực hiện bởi Supabase.
    } catch (err) {
      console.error('Google login error:', err);
      setError('Đã xảy ra lỗi khi đăng nhập bằng Google.');
      setLoadingGoogle(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="p-6 bg-white shadow-md rounded-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">Đăng Nhập</h1>
        {error && (
          <p className="mb-4 text-center text-red-500 bg-red-100 p-2 rounded">
            {error}
          </p>
        )}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* ... (các input email, password và nút submit cho email/password) ... */}
           <div>
             <label
               htmlFor="email"
               className="block text-sm font-medium text-gray-700"
             >
               Email
             </label>
             <input
               id="email"
               type="email"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               required
               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
               placeholder="you@example.com"
             />
           </div>
           <div>
             <label
               htmlFor="password"
               className="block text-sm font-medium text-gray-700"
             >
               Mật khẩu
             </label>
             <input
               id="password"
               type="password"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               required
               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
               placeholder="••••••••"
             />
           </div>
           <div>
             <button
               type="submit"
               disabled={loading}
               className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
             >
               {loading ? 'Đang xử lý...' : 'Đăng nhập'}
             </button>
           </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Hoặc tiếp tục với</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3">
            <div>
              <button
                onClick={handleGoogleLogin}
                disabled={loadingGoogle}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                <span className="sr-only">Đăng nhập bằng Google</span>
                {/* Bạn có thể thêm icon Google ở đây */}
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0zM8.28 15.243l5.303-3.046c.273-.16.48-.445.48-.77s-.207-.61-.48-.77L8.28 7.61c-.43-.243-.96.054-.96.537v6.558c0 .483.53.78.96.538z" clipRule="evenodd" /> {/* Đây là một icon placeholder, bạn nên thay bằng icon Google SVG thật */}
                </svg>
                {loadingGoogle ? 'Đang xử lý...' : 'Đăng nhập bằng Google'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}