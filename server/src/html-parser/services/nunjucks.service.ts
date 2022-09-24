import { Injectable } from '@nestjs/common';
import nunjucks from 'nunjucks';

@Injectable()
export class NunjucksService {
  htmlToString(
    htmlPath: string,
    context?: Record<string, unknown>,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      nunjucks.render(htmlPath, context, (error, html) => {
        if (error) {
          reject(error);
        }
        resolve(html);
      });
    });
  }
}
