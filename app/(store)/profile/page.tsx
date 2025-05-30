// app/(store)/profile/page.tsx
import { createClient } from '@/lib/supabase/server'; // Server client
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import UpdateProfileForm from '@/components/profile/UpdateProfileForm'; // Component form sẽ tạo ở bước 2

// Interface cho dữ liệu profile từ bảng public.users
interface UserProfileData {
  id: string;
  email: string | undefined; // Email từ auth.user
  full_name: string | null;
  phone: string | null;
  // Thêm các trường khác từ bảng users nếu cần
}


async function getUserProfile(userId: string): Promise<UserProfileData | null> {
  const supabase = await createClient(); // Server client

  // Lấy thông tin từ bảng public.users
  const { data: profileData, error: profileError } = await supabase
    .from('users')
    .select('id, full_name, phone') // Chỉ lấy các trường cần thiết
    .eq('id', userId)
    .single();
  if (profileError && profileError.code !== 'PGRST116') { // PGRST116: no rows found, không phải lỗi nghiêm trọng nếu user mới
    console.error('Lỗi lấy thông tin hồ sơ:', profileError);
    // Có thể throw error hoặc trả về null tùy theo cách xử lý
    return null;
  }

  // Lấy email từ auth.user (vì bảng public.users có thể không có email nếu user đăng ký qua OAuth mà không có email)
  const { data: { user: authUser } } = await supabase.auth.getUser();


  return {
    id: userId,
    email: authUser?.email, // Lấy email từ auth user
    full_name: profileData?.full_name || null,
    phone: profileData?.phone || null,
  };
}

export default async function ProfilePage() {
  const supabase = await createClient(); // Server client
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login'); // Nếu chưa đăng nhập, chuyển về trang login
  }

  const userProfile = await getUserProfile(user.id);

  if (!userProfile) {
    // Xử lý trường hợp không lấy được profile, ví dụ:
    // return <p>Không thể tải thông tin hồ sơ. Vui lòng thử lại.</p>;
    // Hoặc nếu profile có thể chưa tồn tại, hiển thị form để tạo mới
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-6">Hồ sơ của bạn</h1>

      {userProfile ? (
        <div>
          <div className="mb-4 p-4 border rounded-md bg-gray-50">
            <p className="mb-2">
              <span className="font-semibold">Email:</span> {userProfile.email || 'N/A'}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Họ và tên:</span> {userProfile.full_name || 'Chưa cập nhật'}
            </p>
            <p>
              <span className="font-semibold">Số điện thoại:</span> {userProfile.phone || 'Chưa cập nhật'}
            </p>
          </div>

          <h2 className="text-xl font-semibold mb-4">Cập nhật thông tin</h2>
          <UpdateProfileForm userProfile={userProfile} />
        </div>
      ) : (
        <p>Đang tải thông tin hồ sơ hoặc hồ sơ chưa được tạo...</p>
        // Có thể hiển thị form tạo profile nếu userProfile là null và user mới đăng ký
      )}
    </div>
  );
}