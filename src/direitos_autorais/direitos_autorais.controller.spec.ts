import { Test, TestingModule } from '@nestjs/testing';
import { DireitosAutoraisController } from './direitos_autorais.controller';
import { DireitosAutoraisService } from './direitos_autorais.service';

describe('DireitosAutoraisController', () => {
  let controller: DireitosAutoraisController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DireitosAutoraisController],
      providers: [DireitosAutoraisService],
    }).compile();

    controller = module.get<DireitosAutoraisController>(DireitosAutoraisController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
