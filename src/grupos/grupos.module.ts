import { Module } from '@nestjs/common';
import { GruposService } from './grupos.service';
import { GruposController } from './grupos.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { GruposSchema } from './interfaces/grupos.schema';

@Module({
  imports: [ 
    MongooseModule.forFeature([
      {name: 'Grupo', schema: GruposSchema},
    ]),
  ],
  controllers: [GruposController],
  providers: [GruposService],
})
export class GruposModule {}
