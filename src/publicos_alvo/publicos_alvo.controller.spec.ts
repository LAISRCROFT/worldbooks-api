import { Test, TestingModule } from '@nestjs/testing';
import { PublicosAlvoController } from './publicos_alvo.controller';
import { PublicosAlvoService } from './publicos_alvo.service';

describe('PublicosAlvoController', () => {
  let controller: PublicosAlvoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PublicosAlvoController],
      providers: [PublicosAlvoService],
    }).compile();

    controller = module.get<PublicosAlvoController>(PublicosAlvoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
