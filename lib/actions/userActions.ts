// lib/actions/userActions.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

interface FormState {
  message: string;
  error: string | null;
}

export async function updateUserProfile(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { message: '', error: 'Bạn cần đăng nhập để thực hiện hành động này.' };
  }

  const fullName = formData.get('fullName') as string | null;
  const phone = formData.get('phone') as string | null;
  // const userId = formData.get('userId') as string; // Không cần thiết nếu lấy user.id từ session

  // Validate dữ liệu đầu vào (có thể dùng Zod ở đây)
  // if (!userId) {
  //   return { message: '', error: 'User ID không hợp lệ.' };
  // }

  const updates = {
    full_name: fullName,
    phone: phone,
    updated_at: new Date().toISOString(), // Trigger đã được định nghĩa trong DB sẽ tự động cập nhật trường này
  };

  const { error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', user.id); // Đảm bảo user chỉ cập nhật profile của chính họ

  if (error) {
    console.error('Lỗi cập nhật hồ sơ:', error);
    return { message: '', error: `Cập nhật hồ sơ thất bại: ${error.message}` };
  }

  revalidatePath('/profile'); // Làm mới dữ liệu trên trang profile
  // revalidatePath('/(store)/profile'); // Nếu bạn có route group
  return { message: 'Cập nhật hồ sơ thành công!', error: null };
}