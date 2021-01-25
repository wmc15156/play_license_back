import { Module } from '@nestjs/common';
import { ImageController } from './image.controller';
import { FileUploadModule } from '../file-upload/file-upload.module';
import { AwsService } from '../aws/aws.service';
import { AwsModule } from '../aws/aws.module';

@Module({
  imports: [FileUploadModule, AwsModule],
  controllers: [ImageController],
})
export class ImageModule {}
