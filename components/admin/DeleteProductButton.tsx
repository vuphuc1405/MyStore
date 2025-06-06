// components/admin/DeleteProductButton.tsx
'use client';
import { deleteProductAction } from '@/lib/actions/adminProductActions';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function DeleteProductButton({ productId, productName }: { productId: string, productName: string }) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${productName}" không? Hành động này không thể hoàn tác.`)) {
            setIsDeleting(true);
            const result = await deleteProductAction(productId);
            if (result.error) {
                alert(`Lỗi xóa sản phẩm: ${result.error}`);
            } else {
                alert(`Sản phẩm "${productName}" đã được xóa.`);
                // Trang sẽ tự revalidate bởi action
            }
            setIsDeleting(false);
        }
    };

    return (
        <button 
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-600 hover:text-red-900 disabled:opacity-50" 
            title="Xóa sản phẩm"
        >
            {isDeleting ? 'Đang xóa...' : <Trash2 size={18}/>}
        </button>
    );
}