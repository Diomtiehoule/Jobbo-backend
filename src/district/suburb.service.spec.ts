import { Test, TestingModule } from '@nestjs/testing';
import { SuburbService } from './suburb.service';

describe('SuburbService', () => {
  let service: SuburbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SuburbService],
    }).compile();

    service = module.get<SuburbService>(SuburbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
