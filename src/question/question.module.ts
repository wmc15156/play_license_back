import { Module } from '@nestjs/common';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './entity/question.entity';
import { User } from '../user/entity/user.entity';
import { ProviderAccount } from '../auth/entity/providerAccount.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Question,
      User,
      ProviderAccount
    ])
  ],
  controllers: [QuestionController],
  providers: [QuestionService],
  exports: [QuestionService],
})
export class QuestionModule {}
