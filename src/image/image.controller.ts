import {
  Controller,
  Logger,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileUploadService } from '../file-upload/file-upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AwsService } from '../aws/aws.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiImplicitFile } from '@nestjs/swagger/dist/decorators/api-implicit-file.decorator';
import { ImageResponseURL } from './interface/ImageResponseURL';

@ApiTags('image')
@Controller('image')
export class ImageController {
  private readonly BUCKET_NAME = 'play-license';
  private readonly logger = new Logger(ImageController.name);
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post('/poster')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: '공연포스터 이미지 업로드',
  })
  @ApiImplicitFile({
    name: 'file',
    required: true,
  })
  @ApiResponse({ status: 201, description: 'success' })
  @ApiResponse({ status: 401, description: 'unauthorized' })
  async uploadPosterImage(@UploadedFile() file): Promise<ImageResponseURL> {
    // fieldname: 'file',
    //   originalname: 'received_714476228667331.jpeg',
    //   encoding: '7bit',
    //   mimetype: 'image/jpeg',
    //   buffer: <Buffer ff d8 ff e0 00 10 4a 46 49 46 00 01 01 00 00 01 00 01 00 00 ff ed 00 6c 50 68 6f 74 6f 73 68 6f 70 20 33 2e 30 00 38 42 49 4d 04 04 00 00 00 00 00 4f ... 98283 more bytes>,
    //   size: 98333
    const { originalname } = file;
    const dirName = 'poster';
    try {
      const imageURL = await this.fileUploadService.uploadS3(
        file.buffer,
        this.BUCKET_NAME,
        originalname,
        dirName,
      );
      const { Location, Key } = imageURL;
      const filename = Key.split('/')[1];
      return { url: Location, filename };
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  @Post('/mobile/background')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: '모바일용 배경이미지 업로드',
  })
  @ApiImplicitFile({
    name: 'file',
    required: true,
  })
  @ApiResponse({ status: 201, description: 'success' })
  @ApiResponse({ status: 401, description: 'unauthorized' })
  async uploadImageForMobile(@UploadedFile() file) {
    const { originalname } = file;
    const dirName = 'mobileBackground';
    try {
      const imageURL = await this.fileUploadService.uploadS3(
        file.buffer,
        this.BUCKET_NAME,
        originalname,
        dirName,
      );
      const { Location, Key } = imageURL;
      const filename = Key.split('/')[1];
      return { url: Location, filename };
    } catch (err) {
      console.error(err);
    }
  }

  @Post('/pc/background')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: 'pc용 배경이미지 업로드',
  })
  @ApiImplicitFile({
    name: 'file',
    required: true,
  })
  @ApiResponse({ status: 201, description: 'success' })
  @ApiResponse({ status: 401, description: 'unauthorized' })
  async uploadImageForPC(@UploadedFile() file): Promise<ImageResponseURL> {
    const { orginalname } = file;
    const dirname = 'pcBackground';

    try {
      const imageURL = await this.fileUploadService.uploadS3(
        file.buffer,
        this.BUCKET_NAME,
        orginalname,
        dirname,
      );
      const { Location, Key } = imageURL;
      const filename = Key.split('/')[1];
      return { url: Location, filename };
    } catch (err) {
      console.error(err);
    }
  }
}
