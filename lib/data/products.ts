// lib/data/products.ts
import { createClient } from '@/lib/supabase/server';

// Ảnh mặc định nếu sản phẩm không có ảnh
const DEFAULT_PLACEHOLDER_IMAGE = '/images/phone-placeholder.jpg'; // Đảm bảo bạn có file này trong public/images

// Type cho dữ liệu tóm tắt sản phẩm (dùng cho danh sách, item trên trang chủ, trang /products)
export interface ProductSummary {
  id: string;
  name: string;
  imageUrl: string; // Sẽ luôn có giá trị (fallback nếu null)
  price: number;
  brandName?: string | null; // Tên thương hiệu, có thể không có
}

// Type cho dữ liệu chi tiết sản phẩm (dùng cho trang /products/[productId])
export interface ProductDetail extends ProductSummary {
  description: string | null;
  specifications: Record<string, any> | null; // JSONB từ CSDL
  stock_quantity: number | null;
  categoryName?: string | null;
  additionalImages?: string[]; // Danh sách URL ảnh phụ
  reviews?: ProductReview[]; // Danh sách đánh giá
}

// Type cho một đánh giá sản phẩm
export interface ProductReview {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string; // Hoặc Date nếu bạn chuyển đổi
  userFullName: string | null; // Tên người dùng đã đánh giá
  // userAvatarUrl?: string | null; // Tùy chọn, nếu bạn lưu avatar trong bảng users
}

// Type cho các tùy chọn filter (danh mục, thương hiệu)
export interface FilterOption {
  id: string;
  name: string;
}

// --- HÀM FETCH SẢN PHẨM ---

/**
 * Fetch sản phẩm bán chạy nhất bằng cách gọi RPC 'get_best_selling_products' từ Supabase.
 * @param limit Số lượng sản phẩm tối đa cần lấy.
 * @returns Promise chứa mảng các sản phẩm bán chạy (ProductSummary).
 */
export async function fetchBestSellingProducts(limit: number = 8): Promise<ProductSummary[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('get_best_selling_products', {
    limit_count: limit,
  });

  if (error) {
    console.error('Lỗi fetch sản phẩm bán chạy (RPC):', error.message);
    return [];
  }
  return (data || []).map((p: { id: any; name: any; image_url: any; price: any; brand_name: any; }) => ({
    id: p.id,
    name: p.name,
    imageUrl: p.image_url || DEFAULT_PLACEHOLDER_IMAGE,
    price: p.price,
    brandName: p.brand_name,
  }));
}

/**
 * Fetch sản phẩm được đánh giá cao nhất bằng cách gọi RPC 'get_top_rated_products' từ Supabase.
 * @param limit Số lượng sản phẩm tối đa cần lấy.
 * @returns Promise chứa mảng các sản phẩm đánh giá cao (ProductSummary).
 */
export async function fetchTopRatedProducts(limit: number = 4): Promise<ProductSummary[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('get_top_rated_products', {
    limit_count: limit,
  });

  if (error) {
    console.error('Lỗi fetch sản phẩm đánh giá cao (RPC):', error.message);
    return [];
  }
  return (data || []).map((p: { id: any; name: any; image_url: any; price: any; brand_name: any; }) => ({
    id: p.id,
    name: p.name,
    imageUrl: p.image_url || DEFAULT_PLACEHOLDER_IMAGE,
    price: p.price,
    brandName: p.brand_name,
  }));
}

export async function fetchAllProductsWithOptions(options: {
  limit?: number;
  offset?: number;
  categoryId?: string;
  brandId?: string;
  sortBy?: string; // ví dụ: 'price-asc', 'created_at-desc'
  // Thêm minPrice, maxPrice nếu cần
}): Promise<{ products: ProductSummary[], totalCount: number | null }> {
  const supabase = await createClient();
  const {
    limit = 12,
    offset = 0,
    categoryId,
    brandId,
    sortBy,
  } = options;

  let query = supabase
    .from('products')
    .select(`
      id,
      name,
      price,
      image_url,
      brands ( name )
    `, { count: 'exact' }) // Yêu cầu Supabase trả về tổng số bản ghi khớp
    .eq('is_active', true)
    .range(offset, offset + limit - 1);

  // Áp dụng bộ lọc
  if (categoryId) query = query.eq('category_id', categoryId);
  if (brandId) query = query.eq('brand_id', brandId);
  // Thêm các bộ lọc khác nếu cần (ví dụ: minPrice, maxPrice)
  // if (minPrice) query = query.gte('price', minPrice);
  // if (maxPrice) query = query.lte('price', maxPrice);

  // Áp dụng sắp xếp
  if (sortBy) {
    const [field, order] = sortBy.split('-');
    // Kiểm tra xem field có hợp lệ để tránh lỗi SQL injection tiềm ẩn nếu sortBy từ user input không được validate
    if (['price', 'name', 'created_at'].includes(field)) {
      query = query.order(field as 'price' | 'name' | 'created_at', { ascending: order === 'asc' });
    }
  } else {
    query = query.order('created_at', { ascending: false }); // Mặc định sắp xếp theo mới nhất
  }

  const { data, error, count } = await query;

  if (error) {
    console.error('Lỗi fetch tất cả sản phẩm:', error.message);
    return { products: [], totalCount: 0 };
  }
  
  const products = (data || []).map(p => ({
    id: p.id,
    name: p.name,
    imageUrl: p.image_url || DEFAULT_PLACEHOLDER_IMAGE,
    price: p.price,
    brandName: (p.brands as any)?.name || null, // brands có thể là null nếu không join được hoặc sản phẩm không có brand
  }));

  return { products, totalCount: count };
}

/**
 * Fetch thông tin chi tiết của một sản phẩm bằng ID.
 * Bao gồm thông tin cơ bản, mô tả, thông số, ảnh phụ, danh mục, thương hiệu và đánh giá.
 * @param productId ID của sản phẩm cần fetch.
 * @returns Promise chứa đối tượng ProductDetail hoặc null nếu không tìm thấy hoặc lỗi.
 */
export async function fetchProductById(productId: string): Promise<ProductDetail | null> {
  if (!productId) {
    console.warn('fetchProductById được gọi với productId rỗng.');
    return null;
  }
  const supabase = await createClient();

  const { data: productData, error: productError } = await supabase
    .from('products')
    .select(`
      id,
      name,
      description,
      specifications,
      image_url,
      price,
      stock_quantity,
      categories ( name ),
      brands ( name ),
      product_images ( image_url, sort_order ),
      product_reviews (id, rating, comment, created_at, users (full_name))
    `)
    .eq('id', productId)
    .eq('is_active', true) // Chỉ lấy sản phẩm đang hoạt động
    .single(); // Lấy một bản ghi duy nhất

  if (productError) {
    // PGRST116 là lỗi "No rows found", không phải là lỗi nghiêm trọng nếu sản phẩm không tồn tại.
    if (productError.code !== 'PGRST116') {
        console.error(`Lỗi fetch chi tiết sản phẩm ID ${productId}:`, productError.message);
    }
    return null; // Trả về null nếu không tìm thấy sản phẩm hoặc có lỗi khác
  }
  if (!productData) {
    return null; // Đảm bảo trả về null nếu không có dữ liệu
  }
  
  // Ép kiểu tạm thời để dễ truy cập các thuộc tính lồng nhau
  const pd = productData as any;

  // Sắp xếp ảnh phụ theo sort_order (nếu có)
  const sortedAdditionalImages = (pd.product_images || [])
    .filter((img: any) => img.image_url) // Loại bỏ các ảnh không có URL
    .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
    .map((img: any) => img.image_url as string);
  
  // Sắp xếp reviews theo ngày tạo mới nhất
  const sortedReviews = (pd.product_reviews || [])
    .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .map((r: any) => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        created_at: r.created_at,
        userFullName: r.users?.full_name || "Người dùng ẩn danh"
    }));

  return {
    id: pd.id,
    name: pd.name,
    description: pd.description,
    specifications: pd.specifications,
    imageUrl: pd.image_url || DEFAULT_PLACEHOLDER_IMAGE,
    price: pd.price,
    stock_quantity: pd.stock_quantity,
    categoryName: pd.categories?.name,
    brandName: pd.brands?.name,
    additionalImages: sortedAdditionalImages,
    reviews: sortedReviews,
  };
}

/**
 * Fetch danh sách các danh mục và thương hiệu để dùng cho bộ lọc.
 * @returns Promise chứa một object với mảng categories và mảng brands.
 */
export async function getFilterOptions(): Promise<{
  categories: FilterOption[];
  brands: FilterOption[];
}> {
  const supabase = await createClient();
  try {
    // Chạy song song hai query để tăng tốc độ
    const [categoriesRes, brandsRes] = await Promise.all([
        supabase.from('categories').select('id, name').order('name', { ascending: true }),
        supabase.from('brands').select('id, name').order('name', { ascending: true })
    ]);

    // Kiểm tra lỗi cho từng query
    if (categoriesRes.error) throw categoriesRes.error;
    if (brandsRes.error) throw brandsRes.error;

    return {
        categories: (categoriesRes.data || []).map(c => ({ id: c.id, name: c.name })),
        brands: (brandsRes.data || []).map(b => ({ id: b.id, name: b.name })),
    };
  } catch (error: any) { // Bắt lỗi chung từ Promise.all hoặc các lỗi riêng lẻ
      console.error("Lỗi fetch filter options:", error.message);
      return { categories: [], brands: [] }; // Trả về mảng rỗng nếu có lỗi
  }
}

export async function fetchSearchResults(keyword: string, limit: number = 20): Promise<ProductSummary[]> {
  if (!keyword || keyword.trim() === '') {
    return []; // Trả về mảng rỗng nếu không có từ khóa
  }

  const supabase = await createClient();
  const searchTerm = `%${keyword.trim()}%`; // Chuẩn bị từ khóa cho truy vấn 'ilike'
  const { data, error } = await supabase
    .from('products')
    .select(`
      id,
      name,
      price,
      image_url,
      brands ( name ) 
    `)
    .eq('is_active', true) // Chỉ tìm sản phẩm đang hoạt động
    .or(`name.ilike.${searchTerm},description.ilike.${searchTerm}`) // Tìm trong tên HOẶC mô tả
    .order('created_at', { ascending: false }) // Sắp xếp theo sự liên quan hoặc ngày tạo
    .limit(limit);

  if (error) {
    console.error('Lỗi fetch kết quả tìm kiếm:', error.message);
    return [];
  }

  return (data || []).map(p => ({
    id: p.id,
    name: p.name,
    imageUrl: p.image_url || DEFAULT_PLACEHOLDER_IMAGE,
    price: p.price,
    brandName: (p.brands as any)?.name || null,
  }));
}