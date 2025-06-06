// components/ui/FeaturedProducts.tsx
import React from 'react';

// Props mà FeaturedItem thực sự cần để hiển thị
export interface FeaturedItemForDisplayProps {
  id: string; // Quan trọng cho key
  imageUrl?: string;
  title?: string;
  price?: number;
  callToAction?: string;
}

// Component FeaturedItem (sử dụng props đã định nghĩa)
const FeaturedItem: React.FC<FeaturedItemForDisplayProps> = ({ imageUrl, title, price, callToAction }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center">
      <img
        src={imageUrl || "/images/phone-placeholder.jpg"}
        alt={title || "Sản phẩm nổi bật"}
        className="h-48 w-full object-contain rounded-lg mb-4"
      />
      <h4 className="font-semibold text-lg mb-2">{title || "Sản phẩm"}</h4>
      <p className="text-xl font-bold text-blue-600 mb-3">{price ? `${price.toLocaleString()}đ` : "Liên hệ"}</p>
      <button className="mt-auto bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700 transition">
        {callToAction || "Mua ngay"}
      </button>
    </div>
  );
};    

interface FeaturedProductsProps {
  featured?: FeaturedItemForDisplayProps[];
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ featured }) => {
  const featuredToDisplay = featured && featured.length > 0 ? featured : [];

  if (featuredToDisplay.length === 0) {
     return (
        <section className="container mx-auto p-6 text-center">
            <h3 className="text-2xl font-bold mb-8 text-blue-700">Điện Thoại Nổi Bật</h3>
            <p className="text-center text-gray-500">Hiện chưa có sản phẩm nổi bật nào.</p>
      </section>
    );
  }

  return (
    <section className="container mx-auto p-6 text-center">
      <h3 className="text-2xl font-bold mb-8 text-blue-700">Điện Thoại Nổi Bật</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {featuredToDisplay.map((item) => (
          <FeaturedItem
            key={item.id} // Rất quan trọng
            id={item.id} // Truyền id nếu FeaturedItem cần
            imageUrl={item.imageUrl}
            title={item.title}
            price={item.price}
            callToAction={item.callToAction}
          />
        ))}
      </div>
    </section>
  );
};
export default FeaturedProducts;