import { forwardRef, Module } from '@nestjs/common';
import { HistoriasService } from './historias.service';
import { HistoriasController } from './historias.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { HistoriasSchema } from './interfaces/historia.schema';
import { CategoriaSchema } from 'src/categorias/interfaces/categorias.schema';
import { CategoriasService } from 'src/categorias/categorias.service';
import { PublicoAlvoSchema } from 'src/publicos_alvo/interfaces/publicos_alvos.schema';
import { PublicosAlvoService } from 'src/publicos_alvo/publicos_alvo.service';
import { IdiomasSchema } from 'src/idiomas/interfaces/idiomas.schema';
import { IdiomasService } from 'src/idiomas/idiomas.service';
import { DireitosAutoraisSchema } from 'src/direitos_autorais/interfaces/diretos_autoriais.schema';
import { DireitosAutoraisService } from 'src/direitos_autorais/direitos_autorais.service';
import { UsuariosSchema } from 'src/usuarios/interfaces/usuario.schema';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { StatusSchema } from 'src/status/interfaces/status.schema';
import { StatusService } from 'src/status/status.service';
import { CapitulosSchema } from 'src/capitulos/interfaces/capitulo.schema';
import { CapitulosService } from 'src/capitulos/capitulos.service';
import { TagsSchema } from 'src/tags/interfaces/tags.schema';
import { TagsService } from 'src/tags/tags.service';
import { CapitulosModule } from 'src/capitulos/capitulos.module';
import { CapitulosVotadosSchema } from 'src/capitulos_votados/interfaces/capitulos_votados.schema';
import { CapitulosVotadosService } from 'src/capitulos_votados/capitulos_votados.service';
import { ComentariosSchema } from 'src/comentarios/interfaces/comentarios.schema';
import { ComentariosService } from 'src/comentarios/comentarios.service';
import { ProjetosSchema } from 'src/projetos/interfaces/projetos.schema';
import { ProjetosService } from 'src/projetos/projetos.service';
import { ProjetosModule } from 'src/projetos/projetos.module';
import { CompeticaoVotosSchema } from 'src/competicao_votos/interfaces/competicao_votos.schema';
import { CompeticaoVotosService } from 'src/competicao_votos/competicao_votos.service';
import { NotificacoesSchema } from 'src/notificacoes/interfaces/noticacoes.schema';
import { NotificacoesService } from 'src/notificacoes/notificacoes.service';

@Module({
  imports: [ 
    forwardRef(() => CapitulosModule),
    forwardRef(() => ProjetosModule),
    MongooseModule.forFeature([
      { name: 'Historia', schema: HistoriasSchema },
      { name: 'Categoria', schema: CategoriaSchema },
      { name: 'PublicoAlvo', schema: PublicoAlvoSchema },
      { name: 'Idioma', schema: IdiomasSchema },
      { name: 'DireitoAutoral', schema: DireitosAutoraisSchema },
      { name: 'Usuarios', schema: UsuariosSchema },
      { name: 'Status', schema: StatusSchema },
      { name: 'Capitulo', schema: CapitulosSchema },
      { name: 'Tag', schema: TagsSchema },
      { name: 'CapituloVotado', schema: CapitulosVotadosSchema },
      { name: 'Comentario', schema: ComentariosSchema },
      { name: 'Projeto', schema: ProjetosSchema },
      { name: 'CompeticaoVoto', schema: CompeticaoVotosSchema },
      { name: 'Notificacao', schema: NotificacoesSchema },
    ]),
  ],
  controllers: [HistoriasController],
  providers: [
    HistoriasService,
    CategoriasService,
    PublicosAlvoService,
    IdiomasService,
    DireitosAutoraisService,
    UsuariosService,
    StatusService,
    CapitulosService,
    TagsService,
    CapitulosVotadosService,
    ComentariosService,
    ProjetosService,
    CompeticaoVotosService,
    NotificacoesService
  ],
})
export class HistoriasModule {}
