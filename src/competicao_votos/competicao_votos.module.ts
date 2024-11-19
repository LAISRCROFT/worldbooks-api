import { forwardRef, Module } from '@nestjs/common';
import { CompeticaoVotosService } from './competicao_votos.service';
import { CompeticaoVotosController } from './competicao_votos.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CompeticaoVotosSchema } from './interfaces/competicao_votos.schema';
import { HistoriasSchema } from 'src/historias/interfaces/historia.schema';
import { HistoriasService } from 'src/historias/historias.service';
import { CapitulosService } from 'src/capitulos/capitulos.service';
import { CapitulosSchema } from 'src/capitulos/interfaces/capitulo.schema';
import { ProjetosSchema } from 'src/projetos/interfaces/projetos.schema';
import { ProjetosService } from 'src/projetos/projetos.service';
import { TagsSchema } from 'src/tags/interfaces/tags.schema';
import { CategoriaSchema } from 'src/categorias/interfaces/categorias.schema';
import { TagsService } from 'src/tags/tags.service';
import { CategoriasService } from 'src/categorias/categorias.service';
import { CapitulosVotadosSchema } from 'src/capitulos_votados/interfaces/capitulos_votados.schema';
import { ComentariosSchema } from 'src/comentarios/interfaces/comentarios.schema';
import { UsuariosSchema } from 'src/usuarios/interfaces/usuario.schema';
import { CapitulosVotadosService } from 'src/capitulos_votados/capitulos_votados.service';
import { ComentariosService } from 'src/comentarios/comentarios.service';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { ProjetosModule } from 'src/projetos/projetos.module';
import { NotificacoesSchema } from 'src/notificacoes/interfaces/noticacoes.schema';
import { NotificacoesService } from 'src/notificacoes/notificacoes.service';

@Module({
  imports: [ 
    forwardRef(() => ProjetosModule),
    MongooseModule.forFeature([
      { name: 'CompeticaoVoto', schema: CompeticaoVotosSchema },
      { name: 'Historia', schema: HistoriasSchema },
      { name: 'Capitulo', schema: CapitulosSchema },
      { name: 'Projeto', schema: ProjetosSchema },
      { name: 'Tag', schema: TagsSchema },
      { name: 'Categoria', schema: CategoriaSchema },
      { name: 'CapituloVotado', schema: CapitulosVotadosSchema },
      { name: 'Comentario', schema: ComentariosSchema },
      { name: 'Usuarios', schema: UsuariosSchema },
      { name: 'Notificacao', schema: NotificacoesSchema },
    ]),
  ],
  controllers: [CompeticaoVotosController],
  providers: [
    CompeticaoVotosService,
    HistoriasService,
    CapitulosService,
    ProjetosService,
    TagsService,
    CategoriasService,
    CapitulosVotadosService,
    ComentariosService,
    UsuariosService,
    NotificacoesService
  ],
})
export class CompeticaoVotosModule {}
