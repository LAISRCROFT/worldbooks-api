import { Module } from '@nestjs/common';
import { PublicosAlvoService } from './publicos_alvo.service';
import { PublicosAlvoController } from './publicos_alvo.controller';
import { PublicoAlvoSchema } from './interfaces/publicos_alvos.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [ 
    MongooseModule.forFeature([
      {name: 'PublicoAlvo', schema: PublicoAlvoSchema},
    ]),
  ],
  controllers: [PublicosAlvoController],
  providers: [PublicosAlvoService],
})
export class PublicosAlvoModule {}
