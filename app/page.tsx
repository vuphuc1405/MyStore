import Image from "next/image";
import Header from "@/components/ui/Header";
import Banner from "@/components/ui/Banner";
import Footer from "@/components/ui/Footer";
import ProductList from "@/components/ui/ProductList";
import Subscription from "@/components/ui/Subscription";
import ProductItem from "@/components/ui/ProductItem";
import FeaturedProducts from "@/components/ui/FeaturedProducts";
import Link from "next/link";
import { useAuthListener } from "@/components/hook/useAuthListener";

export default function Home() {
  return (
    <><Header />
      <Banner />
      <ProductList />
      <FeaturedProducts />
      <Subscription />
      <Footer />
      </>
  );
}
