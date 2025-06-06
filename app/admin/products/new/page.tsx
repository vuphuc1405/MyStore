// app/admin/products/new/page.tsx
import ProductForm from '@/components/admin/ProductForm'; // Component form bạn sẽ tạo
import { createClient } from '@/lib/supabase/server'; //

async function getCategoriesAndBrands() {
    const supabase = await createClient();
    const [categoriesRes, brandsRes] = await Promise.all([
        supabase.from('categories').select('id, name').order('name'),
        supabase.from('brands').select('id, name').order('name')
    ]);

    if (categoriesRes.error) console.error('Error fetching categories:', categoriesRes.error);
    if (brandsRes.error) console.error('Error fetching brands:', brandsRes.error);

    return {
        categories: categoriesRes.data || [],
        brands: brandsRes.data || [],
    };
}

export default async function NewProductPage() {
  const { categories, brands } = await getCategoriesAndBrands();

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Thêm sản phẩm mới</h1>
      <ProductForm categories={categories} brands={brands} />
    </div>
  );
}