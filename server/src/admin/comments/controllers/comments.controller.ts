import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';
import { LoggerService } from '../../../logger/services/logger.service';

import { JwtAuthGuard } from '../../../authentication/strategies/jwt-auth.guard';
import { Role } from '../../../authentication/roles/role.enum';
import { Roles } from '../../../authentication/roles/roles.decorator';
import { RolesGuard } from '../../../authentication/roles/guards/roles.guard';
import { AdminJwtPayload } from '../../../authentication/types/jwt-payload.types';
import {
  LogActivityService,
  logActivityModuleNames,
} from '../../log-activity/services/log-activity.service';
import { CommentsService } from '../services/comments.service';
import { AddCommentDto } from '../validation/add-comment.dto';
import { BadRequestResponse } from '../../../types/bad-request-response';
import { ErrorResponse } from '../../../types/error-response';
import { AddCommentResponse } from '../types/add-comment-response';
import { GetAllCommentsResponse } from '../types/get-all-comments-response';

@ApiBearerAuth()
@Controller('/api/admin/dashboard/comments')
export class CommentsController {
  constructor(
    private readonly logActivityService: LogActivityService,
    private readonly commentsService: CommentsService,
    private readonly logger: LoggerService,
  ) {}

  @ApiCreatedResponse({ type: AddCommentResponse })
  @ApiBadRequestResponse({ type: BadRequestResponse })
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse({ type: ErrorResponse })
  @Roles(Role.SuperAdmin, Role.Manager, Role.MerchantStaff, Role.Merchant)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post(':screenTrackingId')
  async addComment(
    @Param('screenTrackingId') screenTrackingId: string,
    @Body() addCommentDto: AddCommentDto,
    @Req() request: Request & { user: AdminJwtPayload },
  ) {
    addCommentDto.screenTrackingId = screenTrackingId;
    addCommentDto.createdBy = request.user.email;

    try {
      const response: {
        commentId: string;
      } = await this.commentsService.addComment(addCommentDto, request.id);
      const { id, userName, email, role, merchant } = request.user;
      await this.logActivityService.createLogActivity(
        request,
        logActivityModuleNames.ACCOUNTS,
        `${request.user.email} - ${role} Added comment id ${response.commentId}`,
        {
          id,
          email,
          role,
          userName,
          merchantId: merchant,
          screenTrackingId,
          subject: addCommentDto.subject,
          comment: addCommentDto.comment,
          createdBy: addCommentDto.createdBy,
        },
        undefined,
        undefined,
        screenTrackingId,
      );

      this.logger.log(
        'Response status 201:',
        `${CommentsController.name}#addComment`,
        request.id,
      );

      return response;
    } catch (error) {
      this.logger.error(
        'Error:',
        `${CommentsController.name}#addComment`,
        request.id,
        error,
      );
      throw error;
    }
  }

  @ApiOkResponse({ type: GetAllCommentsResponse })
  @ApiBadRequestResponse({ type: BadRequestResponse })
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse({ type: ErrorResponse })
  @Roles(Role.SuperAdmin, Role.Manager, Role.MerchantStaff, Role.Merchant)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':screenTrackingId')
  async getAllCommentsByScreenTrackingId(
    @Param('screenTrackingId') screenTrackingId: string,
    @Req() request: Request & { user: AdminJwtPayload },
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('perPage', new DefaultValuePipe(25), ParseIntPipe) perPage: number,
    @Query('search') search: string,
  ) {
    try {
      const response =
        await this.commentsService.getAllCommentsByScreenTrackingId(
          screenTrackingId,
          { page, perPage, search },
          request.id,
        );

      this.logger.log(
        'Response status 200:',
        `${CommentsController.name}#getAllCommentsByScreenTrackingId`,
        request.id,
      );

      return response;
    } catch (error) {
      this.logger.error(
        'Error:',
        `${CommentsController.name}#getAllCommentsByScreenTrackingId`,
        request.id,
        error,
      );
      throw error;
    }
  }
}
