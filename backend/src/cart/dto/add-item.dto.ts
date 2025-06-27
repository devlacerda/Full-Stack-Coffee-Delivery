// dto/add-item.dto.ts
import { IsInt, IsString, Min } from 'class-validator';

export class AddItemDto {
  @IsString()
  coffeeId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}
