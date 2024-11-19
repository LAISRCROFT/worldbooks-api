import { Module } from '@nestjs/common';
import { ParceirosService } from './parceiros.service';
import { ParceirosController } from './parceiros.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ParceirosSchema } from './interfaces/parceiros.schema';

@Module({
  imports: [ 
    MongooseModule.forFeature([
      { name: 'Parceiro', schema: ParceirosSchema },
    ]),
  ],
  controllers: [ParceirosController],
  providers: [ParceirosService],
})
export class ParceirosModule {}
