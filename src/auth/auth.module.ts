import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsuariosModule } from 'src/usuarios/usuarios.module';
import { UsuariosSchema } from 'src/usuarios/interfaces/usuario.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { PassportModule } from '@nestjs/passport'
import { LocalStrategy } from './local.strategy';
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy';
import { JwtModule } from '@nestjs/jwt'
import { ProjetosSchema } from 'src/projetos/interfaces/projetos.schema';
import { ProjetosService } from 'src/projetos/projetos.service';
import { HistoriasSchema } from 'src/historias/interfaces/historia.schema';
import { HistoriasService } from 'src/historias/historias.service';
import { CapitulosSchema } from 'src/capitulos/interfaces/capitulo.schema';
import { TagsSchema } from 'src/tags/interfaces/tags.schema';
import { CapitulosVotadosSchema } from 'src/capitulos_votados/interfaces/capitulos_votados.schema';
import { ComentariosSchema } from 'src/comentarios/interfaces/comentarios.schema';
import { CapitulosService } from 'src/capitulos/capitulos.service';
import { TagsService } from 'src/tags/tags.service';
import { CapitulosVotadosService } from 'src/capitulos_votados/capitulos_votados.service';
import { ComentariosService } from 'src/comentarios/comentarios.service';
import { CategoriaSchema } from 'src/categorias/interfaces/categorias.schema';
import { CategoriasService } from 'src/categorias/categorias.service';
import { CompeticaoVotosService } from 'src/competicao_votos/competicao_votos.service';
import { CompeticaoVotosSchema } from 'src/competicao_votos/interfaces/competicao_votos.schema';
import { NotificacoesSchema } from 'src/notificacoes/interfaces/noticacoes.schema';
import { NotificacoesService } from 'src/notificacoes/notificacoes.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Usuarios', schema: UsuariosSchema },
            { name: 'Projeto', schema: ProjetosSchema },
            { name: 'Historia', schema: HistoriasSchema },
            { name: 'Capitulo', schema: CapitulosSchema },
            { name: 'Tag', schema: TagsSchema },
            { name: 'CapituloVotado', schema: CapitulosVotadosSchema },
            { name: 'Comentario', schema: ComentariosSchema },
            { name: 'Categoria', schema: CategoriaSchema },
            { name: 'CompeticaoVoto', schema: CompeticaoVotosSchema },
            { name: 'Notificacao', schema: NotificacoesSchema },
        ]),
        UsuariosModule,
        PassportModule,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '43200s' }
        })
    ],
    providers: [
        LocalStrategy,
        JwtStrategy,
        AuthService,
        UsuariosService,
        ProjetosService,
        HistoriasService,
        CapitulosService,
        TagsService,
        CapitulosVotadosService,
        ComentariosService,
        CategoriasService,
        CompeticaoVotosService,
        NotificacoesService
    ],
    controllers: [
        AuthController,
    ],
    exports: [AuthService],
})
export class AuthModule {}
