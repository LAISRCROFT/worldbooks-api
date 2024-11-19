import { Test, TestingModule } from '@nestjs/testing';
import { DireitosAutoraisService } from './direitos_autorais.service';

describe('DireitosAutoraisService', () => {
  let service: DireitosAutoraisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DireitosAutoraisService],
    }).compile();

    service = module.get<DireitosAutoraisService>(DireitosAutoraisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
