import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import ProductList, { ProductItemForListProps } from '@/components/ui/ProductList';
import { fetchAllProductsWithOptions, getFilterOptions } from '@/lib/data/products';
import Link from 'next/link';

const DEFAULT_PLACEHOLDER_IMAGE = '/images/phone-placeholder.jpg';

// Hàm tạo query string
const buildQueryString = (
  currentSearchParams: { [key: string]: string | string[] | undefined },
  newParams: Record<string, string | number | undefined>
): string => {
  const outputParams = new URLSearchParams();

  for (const [key, value] of Object.entries(currentSearchParams)) {
    if (key === 'page' && newParams.hasOwnProperty('page') && (newParams.page === undefined || newParams.page === '1')) {
        continue;
    }
    if (typeof value === 'string') {
      outputParams.set(key, value);
    } else if (Array.isArray(value) && value.length > 0) {
      outputParams.set(key, value[0]);
    }
  }

  for (const [key, value] of Object.entries(newParams)) {
    if (value !== undefined && String(value).trim() !== '') {
      outputParams.set(key, String(value));
    } else {
      outputParams.delete(key);
    }
  }
  return outputParams.toString();
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    categoryId?: string;
    brandId?: string;
    sortBy?: string;
  }>;
}) {
  const resolvedSearchParams = await searchParams;

  const currentPage = resolvedSearchParams.page ? parseInt(resolvedSearchParams.page, 10) : 1;
  const itemsPerPage = 12;
  const offset = (currentPage - 1) * itemsPerPage;

  const filterOptions = await getFilterOptions();

  const { products: fetchedProductsData, totalCount } = await fetchAllProductsWithOptions({
    limit: itemsPerPage,
    offset,
    categoryId: resolvedSearchParams.categoryId,
    brandId: resolvedSearchParams.brandId,
    sortBy: resolvedSearchParams.sortBy,
  });

  const productsForUI: ProductItemForListProps[] = fetchedProductsData.map(p => ({
    id: p.id,
    imageUrl: p.imageUrl || DEFAULT_PLACEHOLDER_IMAGE,
    name: p.name,
    price: p.price,
    brand: p.brandName || undefined,
  }));

  const totalPages = totalCount ? Math.ceil(totalCount / itemsPerPage) : 1;
  const currentSortByValue = resolvedSearchParams.sortBy || "created_at-desc";

  return (
    <>
      <Header />
      <main className="container mx-auto py-8 px-4">
        <h1 className="text-3xl lg:text-4xl font-bold mb-10 text-center text-gray-800">
          Tất Cả Sản Phẩm
        </h1>

        {/* Filter */}
        <div className="mb-10 p-6 bg-white rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Lọc Sản Phẩm</h3>
          <form method="GET" action="/products" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium text-gray-600 mb-1">Danh mục</label>
              <select
                name="categoryId"
                id="categoryId"
                defaultValue={resolvedSearchParams.categoryId || ""}
                className="mt-1 block w-full pl-3 pr-10 py-2.5 text-base border-gray-300 sm:text-sm rounded-md shadow-sm"
              >
                <option value="">Tất cả</option>
                {filterOptions.categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="brandId" className="block text-sm font-medium text-gray-600 mb-1">Thương hiệu</label>
              <select
                name="brandId"
                id="brandId"
                defaultValue={resolvedSearchParams.brandId || ""}
                className="mt-1 block w-full pl-3 pr-10 py-2.5 text-base border-gray-300 sm:text-sm rounded-md shadow-sm"
              >
                <option value="">Tất cả</option>
                {filterOptions.brands.map(brand => (
                  <option key={brand.id} value={brand.id}>{brand.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="sortBy" className="block text-sm font-medium text-gray-600 mb-1">Sắp xếp</label>
              <select
                name="sortBy"
                id="sortBy"
                defaultValue={currentSortByValue}
                className="mt-1 block w-full pl-3 pr-10 py-2.5 text-base border-gray-300 sm:text-sm rounded-md shadow-sm"
              >
                <option value="created_at-desc">Mới nhất</option>
                <option value="price-asc">Giá: Thấp đến Cao</option>
                <option value="price-desc">Giá: Cao đến Thấp</option>
                <option value="name-asc">Tên: A-Z</option>
              </select>
            </div>

            <div className="flex items-end space-x-2">
              <button
                type="submit"
                className="w-full flex items-center justify-center px-4 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Áp dụng
              </button>
              <Link
                href="/products"
                className="w-auto flex items-center justify-center px-4 py-2.5 border border-gray-300 text-sm rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Reset
              </Link>
            </div>
          </form>
        </div>

        {/* Product List */}
        {productsForUI.length > 0 ? (
          <ProductList products={productsForUI} />
        ) : (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">Không tìm thấy sản phẩm</h3>
            <p className="mt-1 text-sm text-gray-500">Vui lòng thử điều chỉnh bộ lọc hoặc quay lại sau.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <Link
                href={`/products?${buildQueryString(resolvedSearchParams, { page: currentPage > 1 ? String(currentPage - 1) : undefined })}`}
                className={`relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 ${
                  currentPage === 1 ? 'pointer-events-none opacity-60' : ''
                }`}
              >
                Trước
              </Link>

              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                const showPage = Math.abs(pageNum - currentPage) < 3 || pageNum === 1 || pageNum === totalPages;
                const isEllipsis = Math.abs(pageNum - currentPage) === 3 && totalPages > 5;

                if (isEllipsis) {
                  return (
                    <span key={`ellipsis-${pageNum}`} className="px-4 py-2 border border-gray-300 bg-white text-sm text-gray-700">...</span>
                  );
                }

                if (showPage) {
                  return (
                    <Link
                      key={pageNum}
                      href={`/products?${buildQueryString(resolvedSearchParams, { page: String(pageNum) })}`}
                      className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                        currentPage === pageNum
                          ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-700 font-semibold'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </Link>
                  );
                }

                return null;
              })}

              <Link
                href={`/products?${buildQueryString(resolvedSearchParams, { page: currentPage < totalPages ? String(currentPage + 1) : undefined })}`}
                className={`relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 ${
                  currentPage === totalPages ? 'pointer-events-none opacity-60' : ''
                }`}
              >
                Sau
              </Link>
            </nav>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
