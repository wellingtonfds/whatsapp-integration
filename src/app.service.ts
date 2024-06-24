import { Injectable } from '@nestjs/common';
import fs from 'fs';

@Injectable()
export class AppService {
  getHello(): string {
    return fs.readFileSync('./policy.html', 'utf-8')
  }

  getPolicyEcc(): string {
    return fs.readFileSync('./policy-ecc.html', 'utf-8')
  }
}
