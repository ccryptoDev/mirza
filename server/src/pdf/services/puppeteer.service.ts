import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';

import { LoggerService } from '../../logger/services/logger.service';

@Injectable()
export class PuppeteerService {
  constructor(private readonly logger: LoggerService) {}

  async generatePDF(
    html: string,
    filePath: string,
    requestId: string,
  ): Promise<void> {
    this.logger.log(
      'Generating PDF with arguments',
      `${PuppeteerService.name}#generatePDF`,
      requestId,
      { html, filePath },
    );

    const browser = await puppeteer.launch({
      pipe: true,
      args: [
        '--headless',
        '--disable-gpu',
        '--full-memory-crash-report',
        '--unlimited-storage',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
      ],
    });
    const page = await browser.newPage();
    const loaded = page.waitForNavigation({
      waitUntil: 'load',
    });
    await page.setContent(html, {
      waitUntil: ['load', 'domcontentloaded', 'networkidle0', 'networkidle2'],
    });

    await loaded;
    await page.pdf({
      format: 'letter',
      path: filePath,
      margin: { top: '50px', right: '10px', bottom: '50px', left: '10px' },
    });
    await browser.close();
    this.logger.log(
      'PDF generated at filepath:',
      `${PuppeteerService.name}#generatePDF`,
      requestId,
      filePath,
    );
  }
}
