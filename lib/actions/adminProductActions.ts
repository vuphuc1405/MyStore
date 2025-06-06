// lib/actions/adminProductActions.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

export interface ProductActionState {
  message: string;
  error: string | null;
  success: boolean;
  fieldErrors?: Record<string, string>;
}

const productSchema = z.object({
  name: z.string().min(3, { message: 'Tên sản phẩm phải có ít nhất 3 ký tự.' }),
  description: z.string().optional(),
  price: z.coerce.number().min(0, { message: 'Giá không hợp lệ.' }),
  stock_quantity: z.coerce.number().int().min(0, { message: 'Số lượng không hợp lệ.' }),
  category_id: z.string().uuid({ message: 'Danh mục không hợp lệ.' }),
  brand_id: z.string().uuid({ message: 'Thương hiệu không hợp lệ.' }),
  image_url_main: z.string().url({ message: 'URL ảnh đại diện không hợp lệ.' }).optional().or(z.literal('')),
  is_active: z.boolean().default(true),
});

function generateSafeFileName(originalName: string): string {
  return `${Date.now()}-${originalName.replace(/\s+/g, '_')}`;
}

async function uploadFileToSupabase(file: File, bucketName: string, filePath: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.storage.from(bucketName).upload(filePath, file, {
    cacheControl: '3600',
    upsert: true,
  });

  if (error) {
    console.error(`Error uploading file ${filePath}:`, error);
    throw error;
  }

  const { data: { publicUrl } } = supabase.storage.from(bucketName).getPublicUrl(data.path);
  return publicUrl;
}

export async function createProductAction(
  _prevState: ProductActionState,
  formData: FormData
): Promise<ProductActionState> {
  const supabase = await createClient();

  const rawFormData = {
    name: formData.get('name'),
    description: formData.get('description'),
    price: formData.get('price'),
    stock_quantity: formData.get('stock_quantity'),
    category_id: formData.get('category_id'),
    brand_id: formData.get('brand_id'),
    image_url_main: formData.get('image_url_main') || undefined,
    is_active: formData.get('is_active') === 'on',
  };

  const specifications: Record<string, string> = {};
  let i = 0;
  while (formData.has(`spec_key_${i}`)) {
    const key = formData.get(`spec_key_${i}`) as string;
    const value = formData.get(`spec_value_${i}`) as string;
    if (key && value) {
      specifications[key] = value;
    }
    i++;
  }

  const validatedFields = productSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of validatedFields.error.issues) {
      fieldErrors[issue.path[0] as string] = issue.message;
    }
    return {
      message: '',
      error: 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại các trường.',
      success: false,
      fieldErrors,
    };
  }

  const productDataToInsert = { ...validatedFields.data, specifications };

  const mainImageFile = formData.get('image_main_file') as File | null;
  if (mainImageFile && mainImageFile.size > 0) {
    try {
      const fileName = generateSafeFileName(mainImageFile.name);
      const publicUrl = await uploadFileToSupabase(mainImageFile, 'product-images', `public/${fileName}`);
      productDataToInsert.image_url_main = publicUrl;
    } catch (uploadError: any) {
      return { message: '', error: `Lỗi tải ảnh đại diện: ${uploadError.message}`, success: false };
    }
  } else if (!productDataToInsert.image_url_main) {
    delete productDataToInsert.image_url_main;
  }

  const { data: newProduct, error } = await supabase
    .from('products')
    .insert({
      name: productDataToInsert.name,
      description: productDataToInsert.description,
      price: productDataToInsert.price,
      stock_quantity: productDataToInsert.stock_quantity,
      category_id: productDataToInsert.category_id,
      brand_id: productDataToInsert.brand_id,
      image_url: productDataToInsert.image_url_main,
      is_active: productDataToInsert.is_active,
      specifications: productDataToInsert.specifications,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating product:', error);
    return { message: '', error: `Thêm sản phẩm thất bại: ${error.message}`, success: false };
  }

  if (newProduct) {
    const productImagesFiles = formData.getAll('product_images_files') as File[];
    const imageUploadPromises = productImagesFiles
      .filter(file => file.size > 0)
      .map(async (file, index) => {
        try {
          const fileName = generateSafeFileName(file.name);
          const publicUrl = await uploadFileToSupabase(file, 'product-images', `public/${newProduct.id}/${fileName}`);
          return { product_id: newProduct.id, image_url: publicUrl, sort_order: index };
        } catch (uploadError: any) {
          console.error(`Lỗi tải ảnh phụ ${file.name}:`, uploadError.message);
          return null;
        }
      });
    const uploadedImages = (await Promise.all(imageUploadPromises)).filter(Boolean);
    if (uploadedImages.length > 0) {
      const { error: imageInsertError } = await supabase.from('product_images').insert(uploadedImages as any);
      if (imageInsertError) {
        console.error('Lỗi thêm ảnh phụ vào CSDL:', imageInsertError);
      }
    }
  }

  revalidatePath('/admin/products');
  revalidatePath('/products');
  revalidatePath('/');

  return { message: 'Thêm sản phẩm thành công!', error: null, success: true };
}

export async function updateProductAction(
  productId: string,
  _prevState: ProductActionState,
  formData: FormData
): Promise<ProductActionState> {
  return { message: 'Chức năng cập nhật đang được phát triển.', error: null, success: false };
}

export async function deleteProductAction(productId: string): Promise<{ error?: string, success?: boolean }> {
  if (!productId) return { error: 'ID sản phẩm không hợp lệ.' };
  const supabase = await createClient();

  const { error: imageDeleteError } = await supabase
    .from('product_images')
    .delete()
    .eq('product_id', productId);

  if (imageDeleteError) {
    console.error('Lỗi xóa ảnh phụ:', imageDeleteError);
  }

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', productId);

  if (error) {
    console.error('Error deleting product:', error);
    return { error: `Xóa sản phẩm thất bại: ${error.message}` };
  }

  revalidatePath('/admin/products');
  revalidatePath('/products');
  revalidatePath('/');
  return { success: true };
}