import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { Request, Response } from 'express';
import * as moment from 'moment';

import { ProductService } from './product.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RoleEnum } from '../roles/typed/role.enum';
import { Roles } from '../roles/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { CreateProductDto } from './dto/createProduct.dto';
import { User } from '../user/entity/user.entity';
import { ProductInfoEntity } from './entity/ProductInfo.entity';

class Product extends ProductInfoEntity {
  requiredMaterials?: Array<string>;
  selectMaterials?: Array<string>;
}
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('/create')
  @ApiOperation({ summary: '공급자 작품등록' })
  @Roles(RoleEnum.PROVIDER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiResponse({ status: 201, description: 'success' })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  async createProduct(
    @Body(ValidationPipe) createProductDto: CreateProductDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    const user = req.user as User;
    const product: Product = await this.productService.createProduct(
      createProductDto,
      user,
    );
    console.log(
      product.requiredMaterial.split(' '),
      product.selectMaterial.split(' '),
    );
    // TODO: 서비스로 분리
    product.requiredMaterials = product.requiredMaterial.split(' ');
    product.selectMaterials = product.selectMaterial.split(' ');
    const {
      updatedAt,
      deletedAt,
      selectMaterial,
      requiredMaterial,
      isCheckInformation,
      productId,
      ...result
    } = product;
    result.createdAt = moment(product.createdAt).format('YYYY-MM-DD');

    return res.status(201).json(result);
  }
}
