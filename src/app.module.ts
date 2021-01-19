import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DotenvModule } from './dotenv/dotenv.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { SmsModule } from './sms/sms.module';
import { AwsModule } from './aws/aws.module';
import { RolesModule } from './roles/roles.module';
import { EmailModule } from './email/email.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { ImageModule } from './image/image.module';

const ENV = process.env.NODE_ENV ? 'production.env' : 'development.env';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ENV,
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    DotenvModule,
    UserModule,
    AuthModule,
    SmsModule,
    AwsModule,
    RolesModule,
    EmailModule,
    FileUploadModule,
    ImageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
