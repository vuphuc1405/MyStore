import React from 'react';

// Định nghĩa kiểu cho props
type ProductItemProps = {
  imageUrl?: string;
  name?: string;
  price?: number;
  storage?: number | string;
  color?: string;
  brand?: string;
};

const ProductItem: React.FC<ProductItemProps> = ({
  imageUrl = "/images/phone-placeholder.jpg",
  name = "Phone Name",
  price,
  storage,
  color,
  brand,
}) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center">
      <div className="relative w-full">
        <img
          src={imageUrl}
          alt={name}
          className="h-48 w-full object-contain rounded-lg mb-3"
        />
        <span className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded-lg text-sm">
          {brand}
        </span>
      </div>
      <h4 className="font-semibold text-lg mb-1 text-blue-800">{name}</h4>
      <div className="text-gray-600 text-sm mb-2">
        <span>{storage} GB</span> • <span>{color}</span>
      </div>
      <p className="text-orange-600 font-bold text-xl mb-3">
        {price !== undefined ? `${price.toLocaleString()}đ` : "Liên hệ"}
      </p>
      <div className="flex gap-2 w-full">
        <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 text-sm font-medium">
          Mua ngay
        </button>
        <button className="flex-1 border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg px-4 py-2 text-sm font-medium">
          Xem chi tiết
        </button>
      </div>
    </div>
  );
};

export default ProductItem;
