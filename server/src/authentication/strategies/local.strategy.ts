import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthenticationService } from '../services/authentication.service';
import { LoggerService } from '../../logger/services/logger.service';
import { User } from '../../user/entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthenticationService,
    private readonly logger: LoggerService,
  ) {
    super({
      usernameField: 'email',
    });
  }

  /**
   * Validate a user with email and password
   * @param email User's email
   * @param password User's password
   */
  async validate(email: string, password: string): Promise<any> {
    this.logger.log(
      `New log in from user with email: ${email}`,
      `${LocalStrategy.name}#validate`,
      undefined,
      email,
    );

    const user: User = await this.authService.validateUser(email, password);
    if (!user) {
      this.logger.error(
        'Invalid credentials for user with email:',
        `${LocalStrategy.name}#validate`,
        undefined,
        email,
      );
      throw new UnauthorizedException();
    }

    this.logger.log(
      `User ${user.firstName} is now logged in`,
      `${LocalStrategy.name}#validate`,
    );
    return user;
  }
}
