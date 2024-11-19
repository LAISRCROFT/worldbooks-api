import { Test, TestingModule } from '@nestjs/testing';
import { CompeticaoVotosController } from './competicao_votos.controller';
import { CompeticaoVotosService } from './competicao_votos.service';

describe('CompeticaoVotosController', () => {
  let controller: CompeticaoVotosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompeticaoVotosController],
      providers: [CompeticaoVotosService],
    }).compile();

    controller = module.get<CompeticaoVotosController>(CompeticaoVotosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
