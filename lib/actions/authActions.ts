'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export type AuthState = {
  message: string;
  error: string | null;
  success: boolean;
};

export type User = {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
};

export async function signUpUser(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const fullName = formData.get('fullName') as string; // Lấy fullName từ form

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
      success: false,
    };
  }

  // Đăng ký thành công → chuyển sang trang đăng nhập
  redirect('/auth/login');
}

export async function signInUser(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return {
      message: '',
      error: 'Email và mật khẩu không được để trống.',
      success: false,
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
      success: false,
    };
  }

  // Đăng nhập thành công → chuyển về trang chủ
  redirect('/');
}

/**
 * Lấy thông tin user hiện tại
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email!,
      name: user.user_metadata?.full_name || user.user_metadata?.name || undefined,
      avatar: user.user_metadata?.avatar_url || user.user_metadata?.picture || undefined,
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

/**
 * Xử lý đăng xuất
 */
export async function signOutUser(): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Sign out error:', error.message);
    throw new Error(`Đăng xuất thất bại: ${error.message}`);
  }

  // Đăng xuất thành công → quay về trang đăng nhập
  redirect('/auth/login');
}

/**
 * Kiểm tra session hiện tại
 */
export async function getSession() {
  try {
    const supabase = await createClient();
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error getting session:', error);
      return null;
    }

    return session;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

/**
 * Refresh session
 */
export async function refreshSession() {
  try {
    const supabase = await createClient();
    const { data: { session }, error } = await supabase.auth.refreshSession();
    
    if (error) {
      console.error('Error refreshing session:', error);
      return null;
    }

    return session;
  } catch (error) {
    console.error('Error refreshing session:', error);
    return null;
  }
}