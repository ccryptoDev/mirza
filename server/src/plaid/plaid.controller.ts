import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { TokenDto } from './dto/token.dto';
import { PlaidService } from './plaid.service';

@Controller('plaid')
export class PlaidController {
  constructor(private readonly plaidService: PlaidService) {

  }
  @Get('/plaidLinkToken/:loan_id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get temp link token for user" })
  async plaidlogin(
    @Param('loan_id', ParseUUIDPipe) loan_id: string,
  ){
    return await this.plaidService.plaidLinkToken(loan_id);
  }
  @Post('/access_token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Save Token" })
  async savetoken(
    @Body() tokenDto: TokenDto,
  ){
    return this.plaidService.access_token(tokenDto.public_token)
  }

  @Get('/public_token/:institution_id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "public_token" })
  async public_token(
    @Param('institution_id') institution_id: string,
  ){
    return this.plaidService.public_sandbox_token(institution_id)
  }
  @Post('/auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Auth" })
  async auth_plaid(
    @Body() access_token: TokenDto,
  ){
    return this.plaidService.auth_plaid(access_token.public_token)
  }

  @Post('/indentity')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Identity" })
  async get_identity(
    @Body() access_token :TokenDto,
  ){
    return this.plaidService.identity(access_token.public_token)
  }
}
