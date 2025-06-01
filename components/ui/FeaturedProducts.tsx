import React from 'react';

// Định nghĩa kiểu props cho FeaturedItem
type FeaturedItemProps = {
  imageUrl?: string;
  title?: string;
  price?: string | number;
  callToAction?: string;
};

// Component FeaturedItem
const FeaturedItem: React.FC<FeaturedItemProps> = ({
  imageUrl = "/images/phone-placeholder.jpg",
  title = "Smartphone",
  price,
  callToAction = "Mua ngay",
}) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center">
      <img
        src={imageUrl}
        alt={title}
        className="h-48 w-full object-contain rounded-lg mb-4"
      />
      <h4 className="font-semibold text-lg mb-2">{title}</h4>
      <p className="text-xl font-bold text-blue-600 mb-3">{price}đ</p>
      <button className="mt-auto bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700 transition">
        {callToAction}
      </button>
    </div>
  );
};

// Định nghĩa kiểu cho từng sản phẩm nổi bật
type FeaturedProductItem = {
  id: number;
  imageUrl: string;
  title: string;
  price: string | number;
  callToAction: string;
};

// Props cho FeaturedProducts component
type FeaturedProductsProps = {
  featured?: FeaturedProductItem[];
};

// Component FeaturedProducts
const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ featured }) => {
  const sampleFeatured: FeaturedProductItem[] = [
    {
      id: 1,
      imageUrl: "/images/iphone-14.jpg",
      title: "iPhone 14 Pro Max",
      price: "1299",
      callToAction: "Mua ngay",
    },
    {
      id: 2,
      imageUrl: "/images/samsung-s23.jpg",
      title: "Samsung Galaxy S23 Ultra",
      price: "1199",
      callToAction: "Xem chi tiết",
    },
    {
      id: 3,
      imageUrl: "/images/xiaomi-13.jpg",
      title: "Xiaomi 13 Pro",
      price: "999",
      callToAction: "Đặt hàng",
    },
  ];

  const featuredToDisplay = featured || sampleFeatured;

  return (
    <section className="container mx-auto p-6 text-center">
      <h3 className="text-2xl font-bold mb-8 text-blue-700">Điện Thoại Nổi Bật</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {featuredToDisplay.map((item) => (
          <FeaturedItem
            key={item.id}
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
