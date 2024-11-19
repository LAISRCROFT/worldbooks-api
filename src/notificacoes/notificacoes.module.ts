import { forwardRef, Module } from '@nestjs/common';
import { NotificacoesService } from './notificacoes.service';
import { NotificacoesController } from './notificacoes.controller';
import { NotificacoesSchema } from './interfaces/noticacoes.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UsuariosSchema } from 'src/usuarios/interfaces/usuario.schema';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { HistoriasSchema } from 'src/historias/interfaces/historia.schema';
import { HistoriasService } from 'src/historias/historias.service';
import { CapitulosSchema } from 'src/capitulos/interfaces/capitulo.schema';
import { CapitulosService } from 'src/capitulos/capitulos.service';
import { TagsSchema } from 'src/tags/interfaces/tags.schema';
import { TagsService } from 'src/tags/tags.service';
import { CategoriaSchema } from 'src/categorias/interfaces/categorias.schema';
import { CategoriasService } from 'src/categorias/categorias.service';
import { CapitulosVotadosSchema } from 'src/capitulos_votados/interfaces/capitulos_votados.schema';
import { CapitulosVotadosService } from 'src/capitulos_votados/capitulos_votados.service';
import { ComentariosSchema } from 'src/comentarios/interfaces/comentarios.schema';
import { ComentariosService } from 'src/comentarios/comentarios.service';
import { ProjetosSchema } from 'src/projetos/interfaces/projetos.schema';
import { ProjetosService } from 'src/projetos/projetos.service';
import { CompeticaoVotosSchema } from 'src/competicao_votos/interfaces/competicao_votos.schema';
import { CompeticaoVotosService } from 'src/competicao_votos/competicao_votos.service';
import { ProjetosModule } from 'src/projetos/projetos.module';
import { UsuariosModule } from 'src/usuarios/usuarios.module';

@Module({
  imports: [ 
    forwardRef(() => ProjetosModule),
    forwardRef(() => UsuariosModule),
    MongooseModule.forFeature([
      { name: 'Notificacao', schema: NotificacoesSchema },
      { name: 'Usuarios', schema: UsuariosSchema },
      { name: 'Historia', schema: HistoriasSchema },
      { name: 'Capitulo', schema: CapitulosSchema },
      { name: 'Tag', schema: TagsSchema },
      { name: 'Categoria', schema: CategoriaSchema },
      { name: 'CapituloVotado', schema: CapitulosVotadosSchema },
      { name: 'Comentario', schema: ComentariosSchema },
      { name: 'Projeto', schema: ProjetosSchema },
      { name: 'CompeticaoVoto', schema: CompeticaoVotosSchema },
    ]),
  ],
  controllers: [NotificacoesController],
  providers: [
    NotificacoesService,
    UsuariosService,
    HistoriasService,
    CapitulosService,
    TagsService,
    CategoriasService,
    CapitulosVotadosService,
    ComentariosService,
    ProjetosService,
    CompeticaoVotosService
  ],
})
export class NotificacoesModule {}