import { forwardRef, Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { UsuariosSchema } from './interfaces/usuario.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { StatusSchema } from 'src/status/interfaces/status.schema';
import { StatusService } from 'src/status/status.service';
import { TiposSchema } from 'src/tipos/interfaces/tipos.schema';
import { TiposService } from 'src/tipos/tipos.service';
import { ProjetosSchema } from 'src/projetos/interfaces/projetos.schema';
import { ProjetosService } from 'src/projetos/projetos.service';
import { ProjetosModule } from 'src/projetos/projetos.module';
import { HistoriasSchema } from 'src/historias/interfaces/historia.schema';
import { HistoriasService } from 'src/historias/historias.service';
import { CapitulosSchema } from 'src/capitulos/interfaces/capitulo.schema';
import { CapitulosService } from 'src/capitulos/capitulos.service';
import { TagsSchema } from 'src/tags/interfaces/tags.schema';
import { TagsService } from 'src/tags/tags.service';
import { CategoriaSchema } from 'src/categorias/interfaces/categorias.schema';
import { CategoriasService } from 'src/categorias/categorias.service';
import { CapitulosVotadosService } from 'src/capitulos_votados/capitulos_votados.service';
import { CapitulosVotadosSchema } from 'src/capitulos_votados/interfaces/capitulos_votados.schema';
import { ComentariosService } from 'src/comentarios/comentarios.service';
import { ComentariosSchema } from 'src/comentarios/interfaces/comentarios.schema';
import { CompeticaoVotosService } from 'src/competicao_votos/competicao_votos.service';
import { CompeticaoVotosSchema } from 'src/competicao_votos/interfaces/competicao_votos.schema';
import { NotificacoesModule } from 'src/notificacoes/notificacoes.module';
import { NotificacoesSchema } from 'src/notificacoes/interfaces/noticacoes.schema';
import { NotificacoesService } from 'src/notificacoes/notificacoes.service';

@Module({
  imports: [ 
    forwardRef(() => ProjetosModule),
    forwardRef(() => NotificacoesModule),
    MongooseModule.forFeature([
      { name: 'Usuarios', schema: UsuariosSchema },
      { name: 'Status', schema: StatusSchema },
      { name: 'Tipo', schema: TiposSchema },
      { name: 'Projeto', schema: ProjetosSchema },
      { name: 'Historia', schema: HistoriasSchema },
      { name: 'Capitulo', schema: CapitulosSchema },
      { name: 'Tag', schema: TagsSchema },
      { name: 'Categoria', schema: CategoriaSchema },
      { name: 'CapituloVotado', schema: CapitulosVotadosSchema },
      { name: 'Comentario', schema: ComentariosSchema },
      { name: 'CompeticaoVoto', schema: CompeticaoVotosSchema },
      { name: 'Notificacao', schema: NotificacoesSchema },
    ]),
  ],
  controllers: [UsuariosController],
  providers: [
    UsuariosService, 
    StatusService, 
    TiposService,
    ProjetosService,
    HistoriasService,
    CapitulosService,
    TagsService,
    CategoriasService,
    CapitulosVotadosService,
    ComentariosService,
    CompeticaoVotosService,
    NotificacoesService
  ]
})
export class UsuariosModule {}
