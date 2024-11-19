import { forwardRef, Module } from '@nestjs/common';
import { CapitulosService } from './capitulos.service';
import { CapitulosController } from './capitulos.controller';
import { HistoriasSchema } from 'src/historias/interfaces/historia.schema';
import { CapitulosSchema } from './interfaces/capitulo.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { HistoriasService } from 'src/historias/historias.service';
import { TagsSchema } from 'src/tags/interfaces/tags.schema';
import { TagsService } from 'src/tags/tags.service';
import { HistoriasModule } from 'src/historias/historias.module';
import { CategoriaSchema } from 'src/categorias/interfaces/categorias.schema';
import { CategoriasService } from 'src/categorias/categorias.service';
import { CapitulosVotadosSchema } from 'src/capitulos_votados/interfaces/capitulos_votados.schema';
import { CapitulosVotadosService } from 'src/capitulos_votados/capitulos_votados.service';
import { ComentariosSchema } from 'src/comentarios/interfaces/comentarios.schema';
import { ComentariosService } from 'src/comentarios/comentarios.service';
import { ProjetosSchema } from 'src/projetos/interfaces/projetos.schema';
import { ProjetosService } from 'src/projetos/projetos.service';
import { UsuariosSchema } from 'src/usuarios/interfaces/usuario.schema';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { CompeticaoVotosSchema } from 'src/competicao_votos/interfaces/competicao_votos.schema';
import { CompeticaoVotosService } from 'src/competicao_votos/competicao_votos.service';
import { NotificacoesSchema } from 'src/notificacoes/interfaces/noticacoes.schema';
import { NotificacoesService } from 'src/notificacoes/notificacoes.service';

@Module({
  imports: [ 
    forwardRef(() => HistoriasModule),
    MongooseModule.forFeature([
      { name: 'Capitulo', schema: CapitulosSchema },
      { name: 'Historia', schema: HistoriasSchema },
      { name: 'Tag', schema: TagsSchema },
      { name: 'Categoria', schema: CategoriaSchema },
      { name: 'CapituloVotado', schema: CapitulosVotadosSchema },
      { name: 'Comentario', schema: ComentariosSchema },
      { name: 'Projeto', schema: ProjetosSchema },
      { name: 'Usuarios', schema: UsuariosSchema },
      { name: 'CompeticaoVoto', schema: CompeticaoVotosSchema },
      { name: 'Notificacao', schema: NotificacoesSchema },
    ]),
  ],
  controllers: [CapitulosController],
  providers: [
    CapitulosService,
    HistoriasService,
    TagsService,
    CategoriasService,
    CapitulosVotadosService,
    ComentariosService,
    ProjetosService,
    UsuariosService,
    CompeticaoVotosService,
    NotificacoesService
  ],
})
export class CapitulosModule {}
