import { Injectable } from '@nestjs/common';
import fs from 'fs';

@Injectable()
export class AppService {
  getHello(): string {
    return fs.readFileSync('./policy.html', 'utf-8')
  }

  getPolicyEec(): string {
    return fs.readFileSync('./policy-eec.html', 'utf-8')
  }
}
