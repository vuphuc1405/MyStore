import Link from 'next/link';
import { Eye, Edit, PlusCircle } from 'lucide-react';
import DeleteProductButton from '@/components/admin/DeleteProductButton';

// Hàm fetch sản phẩm dành cho admin
async function fetchAdminProductsList(options?: { limit?: number; offset?: number; }) {
  const supabase = (await import('@/lib/supabase/server')).createClient();
  const { limit = 20, offset = 0 } = options || {};
  const { data, error } = await (await supabase)
    .from('products')
    .select('id, name, price, stock_quantity, is_active, brands(name)')
    .range(offset, offset + limit - 1)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching admin products list:", error);
    return [];
  }

  return data.map(p => ({
    id: p.id,
    name: p.name,
    price: p.price,
    stock_quantity: p.stock_quantity,
    is_active: p.is_active,
    brandName: (p.brands as any)?.name || 'N/A',
  }));
}

export default async function AdminProductsPage() {
  const products = await fetchAdminProductsList();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Quản lý Sản phẩm</h1>
        <Link href="/admin/products/new" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center">
          <PlusCircle size={20} className="mr-2" /> Thêm sản phẩm mới
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên sản phẩm</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thương hiệu</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tồn kho</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                  Chưa có sản phẩm nào.
                </td>
              </tr>
            ) : (
              products.map(product => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {product.brandName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {typeof product.price === 'number' ? `${product.price.toLocaleString('vi-VN')}₫` : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {product.stock_quantity ?? 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      product.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {product.is_active ? 'Đang bán' : 'Ngừng bán'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <Link
                      href={`/products/${product.id}`}
                      target="_blank"
                      className="text-indigo-600 hover:text-indigo-900"
                      title="Xem sản phẩm"
                    >
                      <Eye size={18} />
                    </Link>
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="text-blue-600 hover:text-blue-900"
                      title="Chỉnh sửa"
                    >
                      <Edit size={18} />
                    </Link>
                    <DeleteProductButton
                      productId={product.id}
                      productName={product.name}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
