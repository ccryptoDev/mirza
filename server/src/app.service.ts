import { Injectable } from '@nestjs/common';
import { Request } from 'express';

import { LoggerService } from './logger/services/logger.service';

/**
 * Global functions
 */
@Injectable()
export class AppService {
  constructor(private readonly logger: LoggerService) {}

  formatPhoneNumber(value: string) {
    return `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6)}`;
  }

  capitalize(value: string) {
    const splittedValue = value.toLowerCase().split(' ');

    const result = splittedValue
      .map((value) => {
        const fistLetter = value.charAt(0);
        return `${fistLetter.toUpperCase()}${value.slice(1)}`;
      })
      .join(' ');

    return result;
  }

  currencyToString = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    })
      .format(value)
      .replace(/[$USD]/g, '');
  };

  getIPAddress(req: Request): string {
    let ip: string;

    if (req.headers['x-forwarded-for']) {
      ip = req.headers['x-forwarded-for'] as string;
    } else if (req.headers['x-real-ip']) {
      ip = req.headers['x-real-ip'] as string;
    } else if (req.socket && req.socket.remoteAddress) {
      ip = req.socket.remoteAddress;
    } else {
      ip = req.ip;
    }

    return ip.replace('::ffff:', '').replace(/^::1$/, '127.0.0.1');
  }

  isValidStateCode = (stateCode: string, requestId: string): boolean => {
    this.logger.log(
      'Checking if state code is valid with arguments',
      `${AppService.name}.createNewUser`,
      requestId,
      stateCode,
    );
    const states: string[] = [
      'AL',
      'AK',
      'AZ',
      'AR',
      'CA',
      'CO',
      'CT',
      'DE',
      'DC',
      'FL',
      'GA',
      'HI',
      'ID',
      'IL',
      'IN',
      'IA',
      'KS',
      'KY',
      'LA',
      'ME',
      'MD',
      'MA',
      'MI',
      'MN',
      'MS',
      'MO',
      'MT',
      'NE',
      'NV',
      'NH',
      'NJ',
      'NM',
      'NY',
      'NC',
      'ND',
      'OH',
      'OK',
      'OR',
      'PA',
      'RI',
      'SC',
      'SD',
      'TN',
      'TX',
      'UT',
      'VT',
      'VA',
      'WA',
      'WV',
      'WI',
      'WY',
    ];

    const stateIndex: number = states.indexOf(stateCode);
    if (stateIndex === -1) {
      this.logger.log(
        'State code invalid',
        `${AppService.name}.createNewUser`,
        requestId,
      );
      return false;
    } else {
      this.logger.log(
        'State code valid',
        `${AppService.name}.createNewUser`,
        requestId,
      );
      return true;
    }
  };
}
