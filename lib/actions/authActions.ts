'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
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
  const fullName = formData.get('fullName') as string;

  if (!email || !password) {
    return {
      message: '',
      error: 'Email và mật khẩu không được để trống.',
      success: false,
    };
  }

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

  // Revalidate để cập nhật cache
  revalidatePath('/');
  
  return {
    message: 'Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản.',
    error: null,
    success: true,
  };
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

  // Revalidate tất cả các route có thể bị ảnh hưởng
  revalidatePath('/', 'layout');
  
  // Có thể redirect về trang chính hoặc dashboard
  redirect('/'); // Hoặc redirect('/');

}
export async function requestPasswordReset(
  _prevState: AuthState, // Trạng thái trước đó từ useFormState
  formData: FormData
): Promise<AuthState> {
  const email = formData.get('email') as string;

  if (!email) {
    return {
      message: 'Vui lòng nhập địa chỉ email của bạn.',
      error: 'Email là bắt buộc.', // Hoặc bạn có thể gộp lỗi này vào message
      success: false,
    };
  }

  const supabase = await createClient(); 
  const origin = (await headers()).get('origin'); 
  const redirectTo = `${origin}/auth/update-password`;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectTo,
  });
  if (error) {
    console.error('Request Password Reset Error:', error.message);
    return {
      message: 'Nếu tài khoản của bạn tồn tại, bạn sẽ nhận được email hướng dẫn đặt lại mật khẩu trong vài phút nữa.',
      error: null, 
      success: true, 
    };
  }

  return {
    message: 'Nếu tài khoản của bạn tồn tại, bạn sẽ nhận được email hướng dẫn đặt lại mật khẩu trong vài phút nữa.',
    error: null,
    success: true,
  };
}

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

export async function signOutUser(): Promise<void> {
  try {
    const supabase = await createClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Sign out error:', error.message);
      throw new Error(`Đăng xuất thất bại: ${error.message}`);
    }

    // Revalidate và redirect sau khi đăng xuất
    revalidatePath('/', 'layout');
    redirect('/auth/login'); // hoặc trang chủ
    
  } catch (error) {
    console.error('Sign out error:', error);
    throw new Error('Có lỗi xảy ra khi đăng xuất.');
  }
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