'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export type AuthState = {
  message: string;
  error: string | null;
  success: boolean;
  
};

/**
 * Xử lý đăng ký tài khoản người dùng
 */
export async function signUpUser(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const fullName = formData.get('fullName') as string;

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    console.error('Sign up error:', error.message);
    return {
      message: '',
      error: `Đăng ký thất bại: ${error.message}`,
    };
  }

  // Đăng ký thành công → chuyển sang trang đăng nhập
  redirect('/auth/login');
}

/**
 * Xử lý đăng nhập người dùng
 */
export async function signInUser(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return {
      message: '',
      error: 'Email và mật khẩu không được để trống.',
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Sign in error:', error.message);
    return {
      message: '',
      error: `Đăng nhập thất bại: ${error.message}`,
    };
  }

  // Đăng nhập thành công → chuyển về trang chủ
  redirect('/');
}

/**
 * Xử lý đăng xuất
 */
export async function signOutUser(): Promise<AuthState> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Sign out error:', error.message);
    return {
      message: '',
      error: `Đăng xuất thất bại: ${error.message}`,
    };
  }

  // Đăng xuất thành công → quay về trang đăng nhập
  redirect('/auth/login');
}
