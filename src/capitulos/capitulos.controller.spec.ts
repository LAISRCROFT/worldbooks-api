import { Test, TestingModule } from '@nestjs/testing';
import { CapitulosController } from './capitulos.controller';
import { CapitulosService } from './capitulos.service';

describe('CapitulosController', () => {
  let controller: CapitulosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CapitulosController],
      providers: [CapitulosService],
    }).compile();

    controller = module.get<CapitulosController>(CapitulosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
