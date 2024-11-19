import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CapitulosVotadosService } from './capitulos_votados.service';
import { CapitulosVotadosController } from './capitulos_votados.controller';
import { CapitulosVotadosSchema } from './interfaces/capitulos_votados.schema';
import { NotificacoesSchema } from 'src/notificacoes/interfaces/noticacoes.schema';
import { NotificacoesService } from 'src/notificacoes/notificacoes.service';
import { ProjetosSchema } from 'src/projetos/interfaces/projetos.schema';
import { ProjetosService } from 'src/projetos/projetos.service';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { UsuariosSchema } from 'src/usuarios/interfaces/usuario.schema';
import { HistoriasSchema } from 'src/historias/interfaces/historia.schema';
import { HistoriasService } from 'src/historias/historias.service';
import { CompeticaoVotosService } from 'src/competicao_votos/competicao_votos.service';
import { CompeticaoVotosSchema } from 'src/competicao_votos/interfaces/competicao_votos.schema';
import { ComentariosSchema } from 'src/comentarios/interfaces/comentarios.schema';
import { ComentariosService } from 'src/comentarios/comentarios.service';
import { CapitulosSchema } from 'src/capitulos/interfaces/capitulo.schema';
import { CapitulosService } from 'src/capitulos/capitulos.service';
import { CategoriaSchema } from 'src/categorias/interfaces/categorias.schema';
import { TagsSchema } from 'src/tags/interfaces/tags.schema';
import { TagsService } from 'src/tags/tags.service';
import { CategoriasService } from 'src/categorias/categorias.service';

@Module({
  imports: [ 
    MongooseModule.forFeature([
      { name: 'CapituloVotado', schema: CapitulosVotadosSchema },
      { name: 'Notificacao', schema: NotificacoesSchema },
      { name: 'Projeto', schema: ProjetosSchema },
      { name: 'Usuarios', schema: UsuariosSchema },
      { name: 'Historia', schema: HistoriasSchema },
      { name: 'CompeticaoVoto', schema: CompeticaoVotosSchema },
      { name: 'Comentario', schema: ComentariosSchema },
      { name: 'Capitulo', schema: CapitulosSchema },
      { name: 'Tag', schema: TagsSchema },
      { name: 'Categoria', schema: CategoriaSchema },
    ]),
  ],
  controllers: [CapitulosVotadosController],
  providers: [
    CapitulosVotadosService,
    NotificacoesService,
    ProjetosService,
    UsuariosService,
    HistoriasService,
    CompeticaoVotosService,
    ComentariosService,
    CapitulosService,
    TagsService,
    CategoriasService
  ],
})
export class CapitulosVotadosModule {}
