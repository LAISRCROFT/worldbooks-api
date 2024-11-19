import { Module } from '@nestjs/common';
import { StatusService } from './status.service';
import { StatusController } from './status.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { StatusSchema } from './interfaces/status.schema';
import { GruposSchema } from 'src/grupos/interfaces/grupos.schema';
import { GruposService } from 'src/grupos/grupos.service';

@Module({
  imports: [ 
    MongooseModule.forFeature([
      { name: 'Status', schema: StatusSchema },
      { name: 'Grupo', schema: GruposSchema },
    ]),
  ],
  controllers: [StatusController],
  providers: [StatusService, GruposService]
})
export class StatusModule {}
