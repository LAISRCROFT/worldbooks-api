import { Module } from '@nestjs/common';
import { ComentariosService } from './comentarios.service';
import { ComentariosController } from './comentarios.controller';
import { ComentariosSchema } from './interfaces/comentarios.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [ 
    MongooseModule.forFeature([
      {name: 'Comentario', schema: ComentariosSchema},
    ]),
  ],
  controllers: [ComentariosController],
  providers: [ComentariosService],
})
export class ComentariosModule {}
