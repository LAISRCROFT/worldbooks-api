import { Test, TestingModule } from '@nestjs/testing';
import { CompeticaoVotosService } from './competicao_votos.service';

describe('CompeticaoVotosService', () => {
  let service: CompeticaoVotosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompeticaoVotosService],
    }).compile();

    service = module.get<CompeticaoVotosService>(CompeticaoVotosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
