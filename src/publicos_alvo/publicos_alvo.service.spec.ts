import { Test, TestingModule } from '@nestjs/testing';
import { PublicosAlvoService } from './publicos_alvo.service';

describe('PublicosAlvoService', () => {
  let service: PublicosAlvoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PublicosAlvoService],
    }).compile();

    service = module.get<PublicosAlvoService>(PublicosAlvoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
