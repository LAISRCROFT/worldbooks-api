import { Module } from '@nestjs/common';
import { IdiomasService } from './idiomas.service';
import { IdiomasController } from './idiomas.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { IdiomasSchema } from './interfaces/idiomas.schema';

@Module({
  imports: [ 
    MongooseModule.forFeature([
      {name: 'Idioma', schema: IdiomasSchema},
    ]),
  ],
  controllers: [IdiomasController],
  providers: [IdiomasService],
})
export class IdiomasModule {}
