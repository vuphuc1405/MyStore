// app/(store)/search/page.tsx
export const dynamic = 'force-dynamic';

import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import ProductList, { ProductItemForListProps } from '@/components/ui/ProductList';
import { fetchSearchResults } from '@/lib/data/products';
import type { ProductSummary } from '@/lib/data/products';

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: { q?: string };
}) {
  const params = await searchParams;
  const keyword = typeof params?.q === 'string' ? params.q.trim() : '';

  let searchResultsData: ProductSummary[] = [];

  if (keyword) {
    searchResultsData = await fetchSearchResults(keyword);
  }


  const searchResultsForUI: ProductItemForListProps[] = searchResultsData.map(p => ({
    id: p.id,
    imageUrl: p.imageUrl ,
    name: p.name,
    price: p.price,
    brand: p.brandName || undefined,
  }));

  return (
    <>
      <Header />
      <main className="container mx-auto py-8 px-4 min-h-[calc(100vh-200px)]">
        {/* phần hiển thị không đổi */}
        {keyword ? (
          <>
            <h1 className="text-2xl lg:text-3xl font-bold mb-2 text-center text-gray-800">
              Kết quả tìm kiếm cho: "{keyword}"
            </h1>
            {searchResultsForUI.length > 0 && (
              <p className="text-center text-gray-600 mb-8">
                Tìm thấy {searchResultsForUI.length} sản phẩm.
              </p>
            )}
          </>
        ) : (
          <h1 className="text-2xl lg:text-3xl font-bold mb-8 text-center text-gray-800">
            Tìm kiếm sản phẩm
          </h1>
        )}

        {keyword && searchResultsForUI.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">Không tìm thấy sản phẩm</h3>
            <p className="mt-1 text-sm text-gray-500">
              Không có sản phẩm nào khớp với từ khóa "{keyword}". Vui lòng thử lại.
            </p>
          </div>
        )}

        {!keyword && (
          <p className="text-center text-gray-500 mt-10">
            Vui lòng nhập từ khóa vào ô tìm kiếm ở phía trên để tìm sản phẩm.
          </p>
        )}

        {searchResultsForUI.length > 0 && (
          <ProductList products={searchResultsForUI} />
        )}
      </main>
      <Footer />
    </>
  );
}
