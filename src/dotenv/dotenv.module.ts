import { Module } from '@nestjs/common';
import { DotenvController } from './dotenv.controller';
import { DotenvService } from './dotenv.service';

const ENV = process.env.NODE_ENV ? 'production.env' : 'development.env';

@Module({
  controllers: [DotenvController],
  providers: [
    {
      provide: DotenvService,
      useValue: new DotenvService(ENV),
    },
  ],
  exports: [DotenvService],
})
export class DotenvModule {}
