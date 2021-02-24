import { Injectable } from '@nestjs/common';
import { Question } from './entity/question.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateQuestionDto } from './dto/createQuestion.dto';
import { User } from '../user/entity/user.entity';
import changeDateFormat from '../utils/chagneDate';

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
        createdAt: new Date(),
        updatedAt: new Date(),
        user,
      });

      return result;

    } catch (err) {
      console.error(err);
      throw err;
    }

  }

  async getQuestion(user: User): Promise<any> {
    const { phone } = user;
    const questionData = await this.questionRepository.find({
      where: {
        phone,
      },
    });

    const questions = questionData.map((data) => {
      data.createdAt = changeDateFormat(data.createdAt);
      const { updatedAt, deletedAt, ...result } = data;
      return result;
    });



    return questions;
  }

  async getOneQuestion(user: User, id: number): Promise<any> {
    const oneQuestionData = await this.questionRepository.findOne(id);

    const { updatedAt, deletedAt, ...result } = oneQuestionData;
    return result;
  }

  async modifyQuestion(user: User, createQuestionDto: CreateQuestionDto ,id: number) {
    const oneQuestionData = await this.questionRepository.findOne(id);
    oneQuestionData.email = createQuestionDto.email;
    oneQuestionData.phone = createQuestionDto.phone;
    oneQuestionData.name = createQuestionDto.name;
    oneQuestionData.comment = createQuestionDto.comment;
    oneQuestionData.title = createQuestionDto.title;
    oneQuestionData.updatedAt = new Date();
    const changedData = await this.questionRepository.save(oneQuestionData)
    changedData.createdAt = changeDateFormat(changedData.createdAt);
    const { updatedAt, deletedAt, ...result } = changedData;
    return result;
  }
}
