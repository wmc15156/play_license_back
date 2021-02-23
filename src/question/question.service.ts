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

  async crateQuestion(createQuestionDto: CreateQuestionDto) {
    const { name, email, title, phone, comment, isChecked } = createQuestionDto;

    try {
      const findUser = await this.userRepository.findOne({
        where: { phone },
      });

      const user = findUser ? findUser : null;

      const result = await this.questionRepository.save({
        name,
        email,
        title,
        phone,
        comment,
        isChecked,
        user,
      });

      return result;

    } catch (err) {
      console.error(err);
      throw err;
    }

  }

  async getQuestion(user: User): Promise<Question[]> {
    const { phone } = user;
    const questionData = await this.questionRepository.find({
      where: {
        phone,
      },
    });
    return questionData;
  }
}
