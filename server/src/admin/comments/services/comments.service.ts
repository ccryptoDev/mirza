import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Brackets,
  getRepository,
  Repository,
  WhereExpressionBuilder,
} from 'typeorm';

import { LoggerService } from '../../../logger/services/logger.service';
import { Comments } from '../entities/comments.entity';
import { AddCommentDto } from '../validation/add-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comments)
    private readonly commentsRepository: Repository<Comments>,
    private readonly logger: LoggerService,
  ) {}

  async addComment(addCommentDto: AddCommentDto, requestId: string) {
    const { subject, comment, createdBy, screenTrackingId } = addCommentDto;
    this.logger.log(
      'Adding comments with arguments',
      `${CommentsService.name}#addComment`,
      requestId,
      addCommentDto,
    );

    let createdComment = this.commentsRepository.create({
      subject,
      comment,
      createdBy,
      screenTracking: screenTrackingId,
    });
    createdComment = await this.commentsRepository.save(createdComment);

    const response = {
      commentId: createdComment.id,
    };
    this.logger.log(
      'Comment added:',
      `${CommentsService.name}#addComment`,
      requestId,
      createdComment,
    );

    return response;
  }

  async getAllCommentsByScreenTrackingId(
    screenTrackingId: string,
    queryParams: { page: number; perPage: number; search: string },
    requestId: string,
  ) {
    this.logger.log(
      'Getting all comments by screen tracking id with arguments',
      `${CommentsService.name}#getAllLogActivities`,
      requestId,
      { screenTrackingId, queryParams },
    );
    const { page, perPage, search } = queryParams;
    const commentsResponse: [Comments[], number] = await getRepository(Comments)
      .createQueryBuilder('comments')
      .where(
        new Brackets((whereExpressionBuilder: WhereExpressionBuilder) => {
          if (search) {
            whereExpressionBuilder
              .where(`comments.subject ILIKE '%${search}%'`)
              .orWhere(`comments.comment ILIKE '%${search}%'`)
              .orWhere(`comments.createdBy ILIKE '%${search}%'`);
          }
        }),
      )
      .take(perPage)
      .skip((page - 1) * perPage)
      .orderBy('comments.createdAt', 'DESC')
      .getManyAndCount();

    const comments = commentsResponse[0].map(
      ({ id, createdAt, createdBy, subject, comment }: any) => {
        return {
          id,
          createdDate: createdAt,
          subject,
          createdBy,
          comment,
        };
      },
    );
    const response = { items: comments, total: commentsResponse[1] };
    this.logger.log(
      'Got comments by screen tracking id:',
      `${CommentsService.name}#getAllCommentsByScreenTrackingId`,
      requestId,
      response,
    );

    return response;
  }
}
