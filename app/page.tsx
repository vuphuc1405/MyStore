// app/page.tsx
import Header from "@/components/ui/Header";
import Banner from "@/components/ui/Banner";
import Footer from "@/components/ui/Footer";
import ProductList from "@/components/ui/ProductList";
import type { ProductItemForListProps } from "@/components/ui/ProductList"; // Import type này
import Subscription from "@/components/ui/Subscription";
import FeaturedProducts from "@/components/ui/FeaturedProducts";
import type { FeaturedItemForDisplayProps } from "@/components/ui/FeaturedProducts"; // Import type này
import { fetchBestSellingProducts, fetchTopRatedProducts } from '@/lib/data/products';

export default async function Home() {
  const [bestSellingProductsData, topRatedProductsData] = await Promise.all([
    fetchBestSellingProducts(8),
    fetchTopRatedProducts(4)
  ]);

  // Map dữ liệu cho ProductList (props của ProductItem)
  const bestSellingItemsForUI: ProductItemForListProps[] = bestSellingProductsData.map(p => ({
    id: p.id,
    imageUrl: p.imageUrl,
    name: p.name,
    price: p.price,
    brand: p.brandName || undefined, // ProductItem nhận prop 'brand'
  }));

  // Map dữ liệu cho FeaturedProducts (props của FeaturedItem)
  const topRatedItemsForUI: FeaturedItemForDisplayProps[] = topRatedProductsData.map(p => ({
    id: p.id,
    imageUrl: p.imageUrl,
    title: p.name, // FeaturedItem nhận prop 'title'
    price: p.price,
    callToAction: "Xem Ngay",
  }));

  return (
    <>
      <Header />
      <Banner />
      {/* Truyền dữ liệu đã fetch và map vào props */}
      <ProductList products={bestSellingItemsForUI} />
      <FeaturedProducts featured={topRatedItemsForUI} />
      <Subscription />
      <Footer />
    </>
  );
}