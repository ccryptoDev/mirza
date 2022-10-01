import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { CreateChildcareDto } from './create-childcare.dto';

export class UpdateChildcareDto extends PartialType(CreateChildcareDto) {
    @IsNotEmpty()
    @IsNumber()
    amount: number;
}
