import { Injectable } from '@nestjs/common';
import { MinioService } from './minio.service';

@Injectable()
export class UploadService {
  constructor(private minioService: MinioService) {}

  // 上传用户头像（存到 user-avatars 桶）
  async uploadAvatar(file: Express.Multer.File) {
    return await this.minioService.uploadFile(file, 'userAvatar', 'avatars');
  }

  // 上传文档（存到 documents 桶）
  async uploadDocument(file: Express.Multer.File) {
    return await this.minioService.uploadFile(file, 'document', 'files');
  }

  // 上传压缩包（存到 archives 桶）
  async uploadArchive(file: Express.Multer.File) {
    return await this.minioService.uploadFile(file, 'archive', 'packages');
  }

  // 通用文件上传（存到 common-files 桶）
  async uploadFile(file: Express.Multer.File) {
    return await this.minioService.uploadFile(file, 'common', 'files');
  }

  // 删除文件
  async deleteFile(fileName: string, bucketType: 'userAvatar' | 'product' | 'document' | 'archive' | 'common') {
    return await this.minioService.deleteFile(fileName, bucketType);
  }

  // 获取文件 URL
  async getFileUrl(fileName: string, bucketType: 'userAvatar' | 'product' | 'document' | 'archive' | 'common') {
    return await this.minioService.getFileUrl(fileName, bucketType);
  }
}