import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { CurationService } from './curation.service';
import { InjectRepository } from '@nestjs/typeorm';
import { CurationInfo } from './entity/CurationInfo.entity';
import { Repository } from 'typeorm';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../roles/roles.decorator';
import { RolesEnum } from '../auth/enum/Roles.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { User } from '../user/entity/user.entity';
import { GetUser } from '../decorator/create-user.decorator';
import { CreateCurationDto } from './dto/createCuration.dto';
import { RegisterProductQuery } from './queries/registerProduct';
import { ApiImplicitQuery } from '@nestjs/swagger/dist/decorators/api-implicit-query.decorator';

@ApiTags('curation')
@Controller('curation')
export class CurationController {
  constructor(
    private readonly curationService: CurationService,
    
    @InjectRepository(CurationInfo)
    private readonly curationRepository: Repository<CurationInfo>
  ) {}

  @Post('/:curationName')
  @ApiOperation({ summary: '큐레이션 등록'})
  @Roles(RolesEnum.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiResponse( { status: 201, description: 'success'})
  @ApiResponse({ status: 409, description: 'already exist curation'})
  async createCuration(
    @GetUser() user: User,
    @Body(ValidationPipe) createCurationDto: CreateCurationDto,
    @Param() params: RegisterProductQuery,
    @Res() res: Response
  ) {
    const { curationName } = params;
    await this.curationService.createCuration(createCurationDto, curationName);

    return res.status(201).send('success');
  }

  // TODO: curation 모아보기 생성
  // TODO : curation 페이지네이션

  @Get('/')
  @ApiOperation({ summary: '큐레이션 관리'})
  @ApiImplicitQuery({ name: 'page', type: 'string' })
  @Roles(RolesEnum.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiResponse({ status: 200, description: 'success'})
  @ApiResponse({ status: 401, description: 'unauthorized '})
  async sendCurationInfo(@Query('page', ParseIntPipe) page: number, @Res() res: Response) {
    const count: number = await this.curationService.curationCount();
    const curationInfo: CurationInfo[] = await this.curationService.getCurationInfo(page);

    return res.status(200).json({ count, curationInfo })
  }

}
