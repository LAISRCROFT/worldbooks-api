import { Module } from '@nestjs/common';
import { DireitosAutoraisService } from './direitos_autorais.service';
import { DireitosAutoraisController } from './direitos_autorais.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DireitosAutoraisSchema } from './interfaces/diretos_autoriais.schema';

@Module({
  imports: [ 
    MongooseModule.forFeature([
      {name: 'DireitoAutoral', schema: DireitosAutoraisSchema},
    ]),
  ],
  controllers: [DireitosAutoraisController],
  providers: [DireitosAutoraisService],
})
export class DireitosAutoraisModule {}
