import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { MinioService } from './minio.service';

@Module({
  controllers: [UploadController],
  providers: [UploadService, MinioService],
  exports: [UploadService, MinioService],  // 👈 只导出 Service，不要导出 Controller
})
export class UploadModule {}