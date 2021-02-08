import { Injectable } from '@nestjs/common';
import { Question } from './entity/question.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateQuestionDto } from './dto/createQuestion.dto';
import { User } from '../user/entity/user.entity';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
  }

  async crateQuestion(createQuestionDto: CreateQuestionDto): Promise<void> {
    const { name, email, title, phone, comment, isChecked } = createQuestionDto;

    try {
      const findUser = await this.userRepository.findOne({
        where: { phone },
      });

      await this.questionRepository.save({
        name,
        email,
        title,
        phone,
        comment,
        isChecked,
        user: findUser ? findUser : null,
      });

      return;

    } catch (err) {
      console.error(err);
      throw err;
    }

  }
}
