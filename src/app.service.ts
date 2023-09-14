import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return 'API Blog V: 1.0';
  }
}
