import { Test, TestingModule } from '@nestjs/testing';
import { CapitulosService } from './capitulos.service';

describe('CapitulosService', () => {
  let service: CapitulosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CapitulosService],
    }).compile();

    service = module.get<CapitulosService>(CapitulosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
