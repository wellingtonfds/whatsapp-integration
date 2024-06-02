import { Test, TestingModule } from '@nestjs/testing';
import { SicoobService } from './sicoob.service';

describe('SicoobService', () => {
  let service: SicoobService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SicoobService],
    }).compile();

    service = module.get<SicoobService>(SicoobService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
