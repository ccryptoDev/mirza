import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ScreenTracking } from '../entities/screen-tracking.entity';
import { LoggerService } from '../../../logger/services/logger.service';
import { User } from '../../entities/user.entity';

@Injectable()
export class ScreenTrackingService {
  constructor(
    @InjectRepository(ScreenTracking)
    private readonly screenTrackingRepository: Repository<ScreenTracking>,
    private readonly logger: LoggerService,
  ) {}

  async createNewScreenTracking(
    user: User,
    applicationReference: string,
    isBackendApplication: boolean,
    requestId: string,
  ): Promise<ScreenTracking> {
    this.logger.log(
      'Creating new screen tracking with arguments',
      `${ScreenTrackingService.name}#createNewScreenTracking`,
      requestId,
      user,
    );
    let screenTracking: ScreenTracking = this.screenTrackingRepository.create({
      user: user.id,
      applicationReference,
      lastLevel: 'apply',
      merchant: user.merchant,
      isCompleted: false,
      isBackendApplication: isBackendApplication,
    });
    screenTracking = await this.screenTrackingRepository.save(screenTracking);

    this.logger.log(
      'Screen tracking created',
      `${ScreenTrackingService.name}#createNewScreenTracking`,
      requestId,
      user,
    );

    return screenTracking;
  }

  async setApplicationCompleted(
    screenTrackingId: string,
    requestId: string,
  ): Promise<void> {
    this.logger.log(
      'Setting application as completed with arguments:',
      `${ScreenTrackingService.name}#setCompleted`,
      requestId,
      { screenTrackingId },
    );
    const screenTracking: ScreenTracking =
      await this.screenTrackingRepository.findOne({
        id: screenTrackingId,
      });
    if (!screenTracking) {
      const errorMessage = `Screen tracking id ${screenTrackingId} not found`;
      this.logger.error(
        errorMessage,
        `${ScreenTrackingService.name}#setCompleted`,
        requestId,
      );
      throw new NotFoundException(undefined, errorMessage);
    }
    if (screenTracking.isCompleted) {
      const errorMessage = `Application already completed`;
      this.logger.error(
        errorMessage,
        `${ScreenTrackingService.name}#setCompleted`,
        requestId,
      );
      throw new BadRequestException(undefined, errorMessage);
    }

    await this.screenTrackingRepository.update(
      { id: screenTrackingId },
      { isCompleted: true },
    );
    this.logger.log(
      'Set application as completed:',
      `${ScreenTrackingService.name}#setCompleted`,
      requestId,
      { screenTrackingId },
    );
  }
}
