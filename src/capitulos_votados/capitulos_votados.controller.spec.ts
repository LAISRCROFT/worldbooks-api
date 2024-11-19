import { Test, TestingModule } from '@nestjs/testing';
import { CapitulosVotadosController } from './capitulos_votados.controller';
import { CapitulosVotadosService } from './capitulos_votados.service';

describe('CapitulosVotadosController', () => {
  let controller: CapitulosVotadosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CapitulosVotadosController],
      providers: [CapitulosVotadosService],
    }).compile();

    controller = module.get<CapitulosVotadosController>(CapitulosVotadosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
