import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { IsNotEmpty, IsObject } from 'class-validator';

export class UpdateSelectsDto {

  @ApiModelProperty({
    example: { select: [{name: '연습MR', price: '123원', originalMaterial: 'url', agreement: 'url', etc: '비고사항'}], input: '기타' },
    description: '선택제공자료'
  })
  @IsObject()
  @IsNotEmpty()
  selectMaterials: object;
}
