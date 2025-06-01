// components/auth/UpdatePasswordForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function UpdatePasswordForm() {
  const supabase = createClient();
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isReadyToUpdate, setIsReadyToUpdate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingToken, setIsCheckingToken] = useState(true);

  useEffect(() => {
    const checkResetToken = async () => {
      try {
        // Kiểm tra session hiện tại
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        console.log('Current session:', session);
        console.log('Session error:', sessionError);
        
        if (sessionError) {
          throw sessionError;
        }

        if (session?.user) {
          // User đã được authenticate thông qua reset link
          setIsReadyToUpdate(true);
          setMessage('Bạn có thể đặt mật khẩu mới.');
          setError('');
        } else {
          // Không có session hợp lệ
          setError('Liên kết không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu reset mật khẩu mới.');
        }
      } catch (err: any) {
        console.error('Error checking reset token:', err);
        setError('Có lỗi xảy ra khi xác thực liên kết. Vui lòng thử lại.');
      } finally {
        setIsCheckingToken(false);
      }
    };

    // Kiểm tra ngay khi component mount
    checkResetToken();

    // Cleanup function
    return () => {
      // Cleanup nếu cần
    };
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!isReadyToUpdate) {
      setError('Chưa thể cập nhật mật khẩu. Vui lòng đảm bảo liên kết đã được xác thực.');
      return;
    }

    // Validation
    if (newPassword.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      // Cập nhật mật khẩu
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        throw updateError;
      }

      setMessage('Cập nhật mật khẩu thành công! Đang chuyển đến trang đăng nhập...');
      
      // Sign out user và chuyển đến trang login
      setTimeout(async () => {
        await supabase.auth.signOut();
        router.push('/auth/login');
      }, 2000);

    } catch (error: any) {
      console.error('Password update error:', error);
      setError(`Lỗi cập nhật mật khẩu: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Hiển thị loading state khi đang kiểm tra token
  if (isCheckingToken) {
    return (
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="text-gray-500">Đang xác thực liên kết...</p>
      </div>
    );
  }

  // Hiển thị error state nếu token không hợp lệ
  if (!isReadyToUpdate) {
    return (
      <div className="text-center space-y-4">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700 mb-3">{error}</p>
            <button
              onClick={() => router.push('/auth/forgot-password')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Yêu cầu reset mật khẩu mới
            </button>
          </div>
        )}
      </div>
    );
  }

  // Form cập nhật mật khẩu
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Đặt mật khẩu mới</h2>
        <p className="mt-2 text-sm text-gray-600">
          Vui lòng nhập mật khẩu mới cho tài khoản của bạn
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
            Mật khẩu mới
          </label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            disabled={isLoading}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
            placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Xác nhận mật khẩu mới
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={isLoading}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
            placeholder="Nhập lại mật khẩu mới"
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {message && !error && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-700">{message}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
        </button>
      </form>
    </div>
  );
}