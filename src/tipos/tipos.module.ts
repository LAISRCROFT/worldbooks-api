import { Module } from '@nestjs/common';
import { TiposService } from './tipos.service';
import { TiposController } from './tipos.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TiposSchema } from './interfaces/tipos.schema';
import { StatusSchema } from 'src/status/interfaces/status.schema';
import { GruposSchema } from 'src/grupos/interfaces/grupos.schema';
import { StatusService } from 'src/status/status.service';
import { GruposService } from 'src/grupos/grupos.service';

@Module({
  imports: [ 
    MongooseModule.forFeature([
      {name: 'Tipo', schema: TiposSchema},
      {name: 'Status', schema: StatusSchema},
      {name: 'Grupo', schema: GruposSchema},
    ]),
  ],
  controllers: [TiposController],
  providers: [
    TiposService,
    StatusService,
    GruposService
  ],
})
export class TiposModule {}
