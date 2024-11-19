import { forwardRef, Module } from '@nestjs/common';
import { ProjetosService } from './projetos.service';
import { ProjetosController } from './projetos.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjetosSchema } from './interfaces/projetos.schema';
import { UsuariosSchema } from 'src/usuarios/interfaces/usuario.schema';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { UsuariosModule } from 'src/usuarios/usuarios.module';
import { HistoriasSchema } from 'src/historias/interfaces/historia.schema';
import { HistoriasService } from 'src/historias/historias.service';
import { HistoriasModule } from 'src/historias/historias.module';
import { CapitulosService } from 'src/capitulos/capitulos.service';
import { CapitulosSchema } from 'src/capitulos/interfaces/capitulo.schema';
import { TagsSchema } from 'src/tags/interfaces/tags.schema';
import { CategoriaSchema } from 'src/categorias/interfaces/categorias.schema';
import { CapitulosVotadosSchema } from 'src/capitulos_votados/interfaces/capitulos_votados.schema';
import { ComentariosSchema } from 'src/comentarios/interfaces/comentarios.schema';
import { TagsService } from 'src/tags/tags.service';
import { CategoriasService } from 'src/categorias/categorias.service';
import { CapitulosVotadosService } from 'src/capitulos_votados/capitulos_votados.service';
import { ComentariosService } from 'src/comentarios/comentarios.service';
import { CompeticaoVotosSchema } from 'src/competicao_votos/interfaces/competicao_votos.schema';
import { CompeticaoVotosService } from 'src/competicao_votos/competicao_votos.service';
import { CompeticaoVotosModule } from 'src/competicao_votos/competicao_votos.module';
import { NotificacoesSchema } from 'src/notificacoes/interfaces/noticacoes.schema';
import { NotificacoesService } from 'src/notificacoes/notificacoes.service';
import { NotificacoesModule } from 'src/notificacoes/notificacoes.module';

@Module({
  imports: [ 
    forwardRef(() => UsuariosModule),
    forwardRef(() => HistoriasModule),
    forwardRef(() => CompeticaoVotosModule),
    forwardRef(() => NotificacoesModule),
    MongooseModule.forFeature([
      { name: 'Projeto', schema: ProjetosSchema },
      { name: 'Usuarios', schema: UsuariosSchema },
      { name: 'Historia', schema: HistoriasSchema },
      { name: 'Capitulo', schema: CapitulosSchema },
      { name: 'Capitulo', schema: CapitulosSchema },
      { name: 'Tag', schema: TagsSchema },
      { name: 'Categoria', schema: CategoriaSchema },
      { name: 'CapituloVotado', schema: CapitulosVotadosSchema },
      { name: 'Comentario', schema: ComentariosSchema },
      { name: 'CompeticaoVoto', schema: CompeticaoVotosSchema },
      { name: 'Notificacao', schema: NotificacoesSchema },
    ]),
  ],
  controllers: [ProjetosController],
  providers: [
    ProjetosService,
    UsuariosService,
    HistoriasService,
    CapitulosService,
    TagsService,
    CategoriasService,
    CapitulosVotadosService,
    ComentariosService,
    CompeticaoVotosService,
    NotificacoesService
  ],
})
export class ProjetosModule {}
