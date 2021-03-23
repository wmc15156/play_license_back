import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { IsNotEmpty, IsObject } from 'class-validator';

export class UpdateRequirementsDto {

  @ApiModelProperty({
    example: { select: [{name: '대본', price: '123원', originalMaterial: 'url', agreement: 'url', etc: '비고사항'}] },
    description: '필수제공자료',
  })
  @IsObject()
  @IsNotEmpty()
  requiredMaterials: object; // // { select: [{}, {}, {}, {}]}
}
