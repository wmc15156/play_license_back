import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { Request, Response } from 'express';
import * as moment from 'moment';

import { BuyerProduct, ProductService } from './product.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RoleEnum } from '../roles/typed/role.enum';
import { Roles } from '../roles/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { CreateProductDto } from './dto/createProduct.dto';
import { User } from '../user/entity/user.entity';
import { ProviderProductInfo } from './entity/ProductInfo.entity';
import { GetUser } from '../decorator/create-user.decorator';
import { DataPipeline } from 'aws-sdk';
import { CreateProductByBuyerDto } from './dto/createProductByBuyer.dto';
import { BuyerProductInfo } from './entity/BuyerProductInfo.entity';

export class Product extends ProviderProductInfo {
  requiredMaterials?: Array<string>;
  selectMaterials?: Array<string>;
}
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('/provider')
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

    const result = await this.productService.convertProductData(product);
    return res.status(201).json({ result });
  }

  @Post('/buyer')
  @ApiOperation({ summary: '사용자 구매문의 등록' })
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: 201, description: 'success' })
  @ApiResponse({ status: 403, description: 'not exist product' })
  async createProductByUser(
    @GetUser() user: User,
    @Res() res: Response,
    @Body(ValidationPipe) creteProductByUserDto: CreateProductByBuyerDto,
  ): Promise<any> {
    console.log(creteProductByUserDto);
    const buyerProduct: BuyerProduct = await this.productService.createProductByUser(
      user,
      creteProductByUserDto,
    );
    const convertedData = await this.productService.convertBuyerProductData(
      buyerProduct,
    );
    return res.status(201).json(convertedData);
  }

  @Get('/cart')
  @ApiOperation({ summary: '사용자가 찜한 데이터 가져오기' })
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: 200, description: 'success' })
  @ApiResponse({ status: 403, description: 'not exist product' })
  async getItem(@GetUser() user: User, @Res() res: Response) {
    const products = await this.productService.getItem(user);
    return res.status(200).json(products);
  }

  @Post('/:productId/add-item')
  @ApiOperation({ summary: '사용자 찜하기 ' })
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: 200, description: 'success' })
  @ApiResponse({ status: 403, description: 'not exist product' })
  async addItem(
    @Param('productId', ParseIntPipe) id: number,
    @GetUser() user: User,
    @Res() res: Response,
  ): Promise<any> {
    await this.productService.addItem(user, id);
    return res.status(200).send('success');
  }

  // TODO: 배열로 받은데이터 다시 한번 어떻게 해볼지 생각해보기
  // TODO: buyer 문의내역 모아보기 userService 구현
  // TODO: 전체적인 API 점검
}
