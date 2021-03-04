import {
  Body,
  Controller, Delete,
  Get, HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { BuyerProduct, ProductService } from './product.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoleEnum } from '../roles/typed/role.enum';
import { Roles } from '../roles/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { CreateProductDto } from './dto/createProduct.dto';
import { User } from '../user/entity/user.entity';
import { ProgressEnum, ProviderProductInfo } from './entity/ProductInfo.entity';
import { GetUser } from '../decorator/create-user.decorator';
import { CreateProductByBuyerDto } from './dto/createProductByBuyer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BuyerProductInfo } from './entity/BuyerProductInfo.entity';
import { CreateProductByUserForEducationalDto } from './dto/createProductByUserForEducational.dto';
import { ApiImplicitQuery } from '@nestjs/swagger/dist/decorators/api-implicit-query.decorator';
import { constants } from 'http2';


@ApiTags('product(작품등록)')
@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    @InjectRepository(BuyerProductInfo)
    private readonly buyerRepository: Repository<BuyerProductInfo>,
  ) {}


  @Get('/info/:productId')
  @ApiResponse({ status: HttpStatus.OK })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST })
  @ApiOperation({ summary: '해당 작품 정보전송' })
  getProduct(@Param('productId') title) {
    console.log('here');
    return this.productService.getProduct(title);
  }

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
    const product = await this.productService.createProduct(
      createProductDto,
      user,
    );

    const result = await this.productService.convertProductData(product);
    return res.status(201).json({ result });
  }

  @Post('/buyer')
  @ApiOperation({ summary: '사용자 구매문의 등록(공연목적용)' })
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: 201, description: 'success' })
  @ApiResponse({ status: 401, description: 'unauthorized' })
  async createProductByUser(
    @GetUser() user: User,
    @Res() res: Response,
    @Body(ValidationPipe) creteProductByUserDto: CreateProductByBuyerDto,
  ): Promise<any> {
    const buyerProduct: BuyerProduct = await this.productService.createProductByUser(
      user,
      creteProductByUserDto,
    );
    const convertedData = await this.productService.convertBuyerProductData(
      buyerProduct,
    );
    return res.status(201).json(convertedData);
  }

  @Post('/buyer/educational')
  @ApiOperation({ summary: '사용자 구매문의 등록(교육목적용, 기타목적용)' })
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: 201, description: 'success' })
  @ApiResponse({ status: 401, description: 'unauthorized' })
  async createProductByUserForEducational(
    @GetUser() user: User,
    @Res() res: Response,
    @Body(ValidationPipe)
    createProductByUserForEducationalDto: CreateProductByUserForEducationalDto,
  ) {
    const buyerProduct = await this.productService.createProductByUserForEducational(
      user,
      createProductByUserForEducationalDto,
    );
    const convertedData = await this.productService.convertBuyerProductData(
      buyerProduct,
    );
    return res.status(201).json(convertedData);
  }

  @Get('/buyer/cart')
  @ApiOperation({ summary: 'buyer 문의내역 리스트'})
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: 200, description: 'success'})
  @ApiResponse({ status: 400, description: 'bad request'})
  async getBuyerInquiryDetails(@GetUser() user:User, @Res() res: Response){
    const products = await this.productService.getBuyerInquiryDetails(user);
    return res.status(200).json(products);
  }


  @Get('/cart')

  @ApiOperation({ summary: '사용자가 찜한 데이터 가져오기' })
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: 200, description: 'success' })
  @ApiResponse({ status: 403, description: 'not exist product' })
  async getItem(@GetUser() user: User, @Res() res: Response) {
    const products = await this.productService.getItem(user);
    const result = await this.productService.convertProductsData(products);
    return res.status(200).json(result);
  }

  @Post('/:productId/add-item')
  @ApiOperation({ summary: '사용자 찜하기' })
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

  @Delete('/:productId/cart')
  @ApiOperation({ summary: '찜한 작품삭제'})
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: HttpStatus.OK })
  @ApiResponse({ status: HttpStatus.FORBIDDEN })
  async deleteWishProduct(
    @GetUser() user: User,
    @Res() res: Response,
    @Param('productId', ParseIntPipe) id: number
  ):Promise<any> {
   await this.productService.deleteWishProduct(id, user);
   return res.status(200).send('OK');
  }

  @Get('/search')
  @ApiImplicitQuery({ name: 'q', type: 'string' })
  @ApiImplicitQuery({ name: 'page', type: 'string' })
  @ApiOperation({ summary: '작품 검색' })
  @ApiResponse({ status: 200, description: 'success' })
  @ApiResponse({ status: 400, description: 'BadRequest' })
  async search(
    @Query('q') query: string,
    @Query('page', ParseIntPipe) page: number,
    @Res() res: Response,
  ) {
    const product = await this.productService.searchProduct(query, page);
    if(product.length === 0) {
      return res.status(200).json([]);
    }
    const result = await this.productService.convertProductsData(product);
    return res.status(200).json(result);
  }

  @Get('/admin')
  


  @Post('/')
  async test(@Body() data: string) {
    const comment = '중앙';
    const result = await this.buyerRepository
      .createQueryBuilder('buyer')
      .where('buyer.introduction like :value', { value: `%${comment}%` })
      .andWhere('buyer.spot like :spot', { spot: `%${data['data']}%` })
      .skip(0)
      .take(10)
      .getMany();

    console.log(result);
  }

  @Post('/test')
  async test2(@Body() data:string) {
    await this.productService.test2(data);
    return ;
  }
}
