import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, ParseUUIDPipe } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ChildcareService } from './childcare.service';
import { UpdateChildcareDto } from './dto/update-childcare.dto';

@Controller('childcare')
export class ChildcareController {
  constructor(private readonly childcareService: ChildcareService) {}

  @Patch('/childcare/:loan_id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change amount' })
  update(
    @Param('loan_id', ParseUUIDPipe) loan_id: string, 
    @Body() updateChildcareDto: UpdateChildcareDto
    ) {
    return this.childcareService.update(loan_id, updateChildcareDto);
  }
  @Get('/aplication_flow/review_offer/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Review Offer' })
  get(
    @Param('id') id: string, 
    ) {
    return this.childcareService.get_review_ofert(id);
  }
}
