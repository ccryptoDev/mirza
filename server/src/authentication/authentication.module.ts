import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthenticationService } from './services/authentication.service';
import { AuthenticationController } from './controllers/authentication.controller';
import { RolesController } from './roles/controllers/roles.controller';
import { RolesService } from './roles/services/roles.service';
import { secret } from './authentication.config';
import { UserModule } from '../user/user.module';
import { AdminModule } from '../admin/admin.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Roles } from './roles/entities/roles.entity';
import { AppService } from '../app.service';
import { LoggerModule } from '../logger/logger.module';
import { HtmlParserModule } from '../html-parser/html-parser.module';
import { EmailModule } from '../email/email.module';
import { LocalStrategy } from './strategies/local.strategy';
import { AdminLocalStrategy } from './strategies/admin-local-strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret,
      signOptions: { expiresIn: '1d' },
    }),
    TypeOrmModule.forFeature([Roles]),
    forwardRef(() => UserModule),
    AdminModule,
    LoggerModule,
    HtmlParserModule,
    EmailModule,
  ],
  providers: [
    AuthenticationService,
    RolesService,
    AppService,
    LocalStrategy,
    AdminLocalStrategy,
    JwtStrategy,
  ],
  controllers: [AuthenticationController, RolesController],
  exports: [TypeOrmModule, AuthenticationService],
})
export class AuthenticationModule {}
