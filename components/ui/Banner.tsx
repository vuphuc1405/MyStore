import React from 'react'

const Banner : React.FC = () => {
  return (
    <section className="bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100 text-center py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-blue-800 drop-shadow">
          Khám Phá Điện Thoại Mới Nhất - Chất Lượng Hàng Đầu!
        </h2>
        <p className="text-gray-600 text-lg mb-8">
          Đa dạng mẫu mã, giá cả hợp lý, bảo hành chính hãng
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
          <a
            href="#products"
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-semibold text-lg shadow transition"
          >
            Mua Ngay
          </a>
          <a
            href="#promotions"
            className="text-blue-600 hover:text-blue-800 underline font-medium text-lg transition"
          >
            Xem Khuyến Mãi &gt;
          </a>
        </div>
      </div>
    </section>
  );
};

export default Banner