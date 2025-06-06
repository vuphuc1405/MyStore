import React from 'react';
import ProductItem from './ProductItem';

// Định nghĩa lại props cho ProductItem để khớp với dữ liệu truyền vào
export interface ProductItemForListProps {
  id: string; // Dùng cho key
  imageUrl?: string;
  name?: string;
  price?: number;
  brand?: string;
  storage?: number | string;
  color?: string;
}

interface ProductListProps {
  products?: ProductItemForListProps[];
}

const ProductList: React.FC<ProductListProps> = ({ products }) => {
  const productsToDisplay = products && products.length > 0 ? products : [];

  if (productsToDisplay.length === 0) {
    return (
      <section className="container mx-auto p-6">
        {/* <h3 className="text-2xl font-bold mb-8 text-blue-700 text-center">Bán Chạy</h3> */}
        <p className="text-center text-gray-500">Hiện chưa có sản phẩm nào.</p>
      </section>
    );
  }

  return (
    <section className="container mx-auto p-6">
      {/* <h3 className="text-2xl font-bold mb-8 text-blue-700 text-center">Bán Chạy</h3> */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {productsToDisplay.map(product => (
          <ProductItem
            key={product.id}
            imageUrl={product.imageUrl}
            name={product.name}
            price={product.price}
            brand={product.brand}
            storage={product.storage}
            color={product.color}
          />
        ))}
      </div>
    </section>
  );
};

export default ProductList;
