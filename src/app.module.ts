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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
