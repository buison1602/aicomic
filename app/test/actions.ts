'use server'

import { r2 } from '@/lib/r2'; // Import client R2 bạn đã tạo ở bước trước
import { ListObjectsV2Command } from '@aws-sdk/client-s3';

export async function testR2Connection() {
  const bucketName = process.env.R2_BUCKET_NAME;

  if (!bucketName) {
    return { success: false, message: "Lỗi: R2_BUCKET_NAME chưa được cấu hình trong .env.local." };
  }

  try {
    // 1. Gửi lệnh ListObjectsV2Command (lệnh nhẹ nhất để kiểm tra xác thực)
    const data = await r2.send(new ListObjectsV2Command({
      Bucket: bucketName,
      MaxKeys: 1, // Chỉ kiểm tra 1 khóa để giảm thiểu tài nguyên
    }));

    // 2. Kiểm tra mã trạng thái HTTP
    if (data.$metadata.httpStatusCode === 200) {
      return { success: true, message: "🎉 Kết nối R2 thành công! Key và Endpoint đã đúng." };
    }

    return { success: false, message: "Lỗi kết nối R2 không xác định." };

  } catch (error: any) {
    // 3. Xử lý lỗi xác thực
    console.error("Lỗi kết nối R2:", error.name, error.message);
    
    let userMessage = "Lỗi kết nối hoặc quyền hạn.";
    if (error.name === 'InvalidAccessKeyId') {
      userMessage = "Access Key ID hoặc Secret Key không hợp lệ. Vui lòng kiểm tra lại.";
    } else if (error.name === 'AuthorizationError') {
      userMessage = "Lỗi quyền hạn. Kiểm tra lại Token có quyền 'Object Read & Write' cho Bucket này chưa.";
    } else if (error.name === 'NoSuchBucket') {
      userMessage = "Bucket Name sai. Kiểm tra lại R2_BUCKET_NAME.";
    }
    
    return { success: false, message: `Kết nối R2 thất bại (${error.name}): ${userMessage}` };
  }
}