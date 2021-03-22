import { Injectable, Logger } from '@nestjs/common';
import { AwsService } from '../aws/aws.service';
import { Readable } from 'stream';

@Injectable()
export class FileUploadService {
  private readonly logger = new Logger(FileUploadService.name);
  constructor(private readonly awsService: AwsService) {}

  async uploadS3(
    file: Buffer,
    bucket: string,
    name: string,
    dirName: string,
    mimetype: string,
  ): Promise<any> {
    const s3 = this.awsService.getS3();

    let stream = new Readable();
    stream.push(file);
    stream.push(null);
    const params = {
      Bucket: bucket,
      Key: `${dirName}/${String(name)}`,
      Body: file,
      ContentType: mimetype,
      ACL: 'public-read',
    };


    return new Promise((resolve, reject) => {
      s3.upload(params, (err, data) => {
        if (err) {
          this.logger.error(err.name);
          console.log(err);

          reject(err.message);
        }
        console.log(data);
        resolve(data);
      });
    });
  }
}
