// components/admin/ProductForm.tsx
'use client';

import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { createProductAction, updateProductAction, ProductActionState } from '@/lib/actions/adminProductActions'; // Server Action bạn sẽ tạo
import type { ProductDetail } from '@/lib/data/products'; // Type cho sản phẩm hiện tại (nếu là edit)
import Image from 'next/image';

interface Category { id: string; name: string; }
interface Brand { id: string; name: string; }

interface ProductFormProps {
  categories: Category[];
  brands: Brand[];
  product?: ProductDetail | null; // Dùng cho form edit
}

const initialState: ProductActionState = {
  message: '',
  error: null,
  success: false,
  fieldErrors: {},
};

function SubmitButton({ isEditMode }: { isEditMode?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
    >
      {pending ? (isEditMode ? 'Đang cập nhật...' : 'Đang lưu...') : (isEditMode ? 'Cập nhật sản phẩm' : 'Lưu sản phẩm')}
    </button>
  );
}

export default function ProductForm({ categories, brands, product }: ProductFormProps) {
  const actionToCall = product?.id ? updateProductAction.bind(null, product.id) : createProductAction;
  const [state, formAction] = useActionState(actionToCall, initialState);
  const [previewImageUrls, setPreviewImageUrls] = useState<string[]>(
    Array.isArray(product?.imageUrl) 
      ? product.imageUrl.map((img: { image_url: any; }) => img.image_url || '').filter(Boolean)
      : product?.imageUrl ? [product.imageUrl] : []
  );
  const [specifications, setSpecifications] = useState<Array<{key: string, value: string}>>(
    product?.specifications ? Object.entries(product.specifications).map(([key, value]) => ({ key, value: String(value) })) : [{key: '', value: ''}]
  );


  useEffect(() => {
    if (state.success) {
      alert(state.message || (product?.id ? 'Cập nhật thành công!' : 'Thêm sản phẩm thành công!'));
      // Reset form hoặc redirect (redirect nên xử lý trong action)
    } else if (state.error) {
      alert(`Lỗi: ${state.error}`);
    }
  }, [state, product?.id]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      const newPreviews = filesArray.map(file => URL.createObjectURL(file));
      setPreviewImageUrls(prev => [...prev, ...newPreviews]);
    }
  };

  const handleAddSpec = () => setSpecifications([...specifications, { key: '', value: '' }]);
  const handleSpecChange = (index: number, field: 'key' | 'value', value: string) => {
    const newSpecs = [...specifications];
    newSpecs[index][field] = value;
    setSpecifications(newSpecs);
  };
  const handleRemoveSpec = (index: number) => {
    setSpecifications(specifications.filter((_, i) => i !== index));
  };


  return (
    <form action={formAction} className="space-y-6 bg-white p-8 rounded-lg shadow">
      {/* Tên sản phẩm */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Tên sản phẩm</label>
        <input type="text" name="name" id="name" defaultValue={product?.name} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
        {state.fieldErrors?.name && <p className="text-xs text-red-500 mt-1">{state.fieldErrors.name}</p>}
      </div>

      {/* Mô tả */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
        <textarea name="description" id="description" rows={4} defaultValue={product?.description || ''} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
      </div>

      {/* Giá */}
      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Giá (VNĐ)</label>
        <input type="number" name="price" id="price" step="1000" defaultValue={product?.price} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
        {state.fieldErrors?.price && <p className="text-xs text-red-500 mt-1">{state.fieldErrors.price}</p>}
      </div>

      {/* Số lượng tồn kho */}
      <div>
        <label htmlFor="stock_quantity" className="block text-sm font-medium text-gray-700 mb-1">Số lượng tồn kho</label>
        <input type="number" name="stock_quantity" id="stock_quantity" defaultValue={product?.stock_quantity || 0} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
      </div>

      {/* Danh mục */}
      <div>
        <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
        <select name="category_id" id="category_id" defaultValue={product?.categoryName ? categories.find(c=>c.name === product.categoryName)?.id : ""} required className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
          <option value="">Chọn danh mục</option>
          {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
        </select>
        {state.fieldErrors?.category_id && <p className="text-xs text-red-500 mt-1">{state.fieldErrors.category_id}</p>}
      </div>

      {/* Thương hiệu */}
      <div>
        <label htmlFor="brand_id" className="block text-sm font-medium text-gray-700 mb-1">Thương hiệu</label>
        <select name="brand_id" id="brand_id" defaultValue={product?.brandName ? brands.find(b=>b.name === product.brandName)?.id : ""} required className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
          <option value="">Chọn thương hiệu</option>
          {brands.map(brand => <option key={brand.id} value={brand.id}>{brand.name}</option>)}
        </select>
        {state.fieldErrors?.brand_id && <p className="text-xs text-red-500 mt-1">{state.fieldErrors.brand_id}</p>}
      </div>

      {/* Ảnh đại diện chính (image_url) - Nếu muốn tải mới thì dùng input file */}
      <div>
        <label htmlFor="image_url_main" className="block text-sm font-medium text-gray-700 mb-1">Ảnh đại diện chính (URL hoặc tải lên)</label>
        <input type="text" name="image_url_main" id="image_url_main" placeholder="Nhập URL hoặc để trống nếu tải lên" defaultValue={product?.imageUrl && !product.imageUrl.startsWith('blob:') ? product.imageUrl : ''} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mb-2"/>
        <input type="file" name="image_main_file" id="image_main_file" accept="image/*" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
        {product?.imageUrl && <Image src={product.imageUrl} alt="Ảnh đại diện hiện tại" width={100} height={100} className="mt-2 rounded"/>}
      </div>

      {/* Ảnh sản phẩm phụ (product_images) */}
      <div>
        <label htmlFor="product_images_files" className="block text-sm font-medium text-gray-700 mb-1">Ảnh sản phẩm phụ (có thể chọn nhiều ảnh)</label>
        <input type="file" name="product_images_files" id="product_images_files" multiple accept="image/*" onChange={handleImageChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
         <div className="mt-2 flex flex-wrap gap-2">
            {previewImageUrls.map((url, index) => (
                <div key={index} className="relative w-24 h-24">
                    <Image src={url} alt={`Preview ${index}`} layout="fill" objectFit="cover" className="rounded" />
                </div>
            ))}
        </div>
        {/* TODO: Hiển thị các ảnh đã có và cho phép xóa */}
      </div>

      {/* Thông số kỹ thuật (JSONB) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Thông số kỹ thuật</label>
        {specifications.map((spec, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
                <input 
                    type="text" 
                    name={`spec_key_${index}`} 
                    placeholder="Tên thông số (VD: Màn hình)" 
                    value={spec.key}
                    onChange={(e) => handleSpecChange(index, 'key', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm" />
                <input 
                    type="text" 
                    name={`spec_value_${index}`} 
                    placeholder="Giá trị (VD: 6.1 inch, OLED)" 
                    value={spec.value}
                    onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm" />
                <button type="button" onClick={() => handleRemoveSpec(index)} className="text-red-500 hover:text-red-700">Xóa</button>
            </div>
        ))}
        <button type="button" onClick={handleAddSpec} className="text-sm text-blue-600 hover:text-blue-800">+ Thêm thông số</button>
      </div>

      {/* Trạng thái */}
      <div className="flex items-center">
        <input type="checkbox" name="is_active" id="is_active" defaultChecked={product ? product.is_active !== false : true} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"/>
        <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">Đang hoạt động (cho phép bán)</label>
      </div>

      <div>
        <SubmitButton isEditMode={!!product?.id} />
      </div>
      {state.message && !state.success && !state.error && <p className="text-sm text-yellow-600 mt-2">{state.message}</p>}
      {state.message && state.success && <p className="text-sm text-green-600 mt-2">{state.message}</p>}
      {state.error && <p className="text-sm text-red-600 mt-2">{state.error}</p>}
    </form>
  );
}