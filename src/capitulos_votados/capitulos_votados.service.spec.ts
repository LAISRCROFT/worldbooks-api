import { Test, TestingModule } from '@nestjs/testing';
import { CapitulosVotadosService } from './capitulos_votados.service';

describe('CapitulosVotadosService', () => {
  let service: CapitulosVotadosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CapitulosVotadosService],
    }).compile();

    service = module.get<CapitulosVotadosService>(CapitulosVotadosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
