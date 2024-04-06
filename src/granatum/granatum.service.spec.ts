import { Test, TestingModule } from '@nestjs/testing';
import { GranatumService } from './granatum.service';

describe('GranatumService', () => {
  let service: GranatumService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GranatumService],
    }).compile();

    service = module.get<GranatumService>(GranatumService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
