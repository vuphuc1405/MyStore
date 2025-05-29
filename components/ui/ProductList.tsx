import React from 'react';
import ProductItem from './ProductItem';

// Define the Product interface
interface Product {
  id: number;
  imageUrl: string;
  name: string;
  price: number;
}

// Define the component props interface
interface ProductListProps {
  products?: Product[];
}

const ProductList: React.FC<ProductListProps> = ({ products }) => {
  // Dữ liệu mẫu điện thoại
  const sampleProducts: Product[] = [
    { id: 1, imageUrl: "image-url-iphone14.jpg", name: "iPhone 14 Pro Max", price: 1299.99 },
    { id: 2, imageUrl: "image-url-s23.jpg", name: "Samsung Galaxy S23 Ultra", price: 1199.99 },
    { id: 3, imageUrl: "image-url-pixel7.jpg", name: "Google Pixel 7 Pro", price: 899.99 },
    { id: 4, imageUrl: "image-url-xiaomi13.jpg", name: "Xiaomi 13 Pro", price: 799.99 },
  ];

  const productsToDisplay: Product[] = products || sampleProducts;

  return (
    <section className="container mx-auto p-6">
      <h3 className="text-2xl font-bold mb-8 text-blue-700 text-center">Bán Chạy</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {productsToDisplay.map(product => (
          <ProductItem
            key={product.id}
            imageUrl={product.imageUrl}
            name={product.name}
            price={product.price}
          />
        ))}
      </div>
    </section>
  );
};


export default ProductList;
