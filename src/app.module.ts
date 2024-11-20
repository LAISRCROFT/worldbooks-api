import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { StatusModule } from './status/status.module';
import { CategoriasModule } from './categorias/categorias.module';
import { HistoriasModule } from './historias/historias.module';
import { TagsModule } from './tags/tags.module';
import { DireitosAutoraisModule } from './direitos_autorais/direitos_autorais.module';
import { PublicosAlvoModule } from './publicos_alvo/publicos_alvo.module';
import { ComentariosModule } from './comentarios/comentarios.module';
import { IdiomasModule } from './idiomas/idiomas.module';
import { TiposModule } from './tipos/tipos.module';
import { GruposModule } from './grupos/grupos.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { CapitulosModule } from './capitulos/capitulos.module';
import { ConfigModule } from '@nestjs/config';
import { CapitulosVotadosModule } from './capitulos_votados/capitulos_votados.module';
import { ProjetosModule } from './projetos/projetos.module';
import { NotificacoesModule } from './notificacoes/notificacoes.module';
import { ParceirosModule } from './parceiros/parceiros.module';
import { CompeticaoVotosModule } from './competicao_votos/competicao_votos.module';

console.log(`.env.${process.env.NODE_ENV}`)
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.NODE_ENV}`],
    }),

    // MongooseModule.forRoot(`mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}`),
    MongooseModule.forRoot(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}/${process.env.MONGO_DATABASE}`),
    UsuariosModule,
    AuthModule,
    StatusModule,
    CategoriasModule,
    HistoriasModule,
    TagsModule,
    DireitosAutoraisModule,
    PublicosAlvoModule,
    ComentariosModule,
    IdiomasModule,
    TiposModule,
    GruposModule,
    CapitulosModule,
    CapitulosVotadosModule,
    ProjetosModule,
    NotificacoesModule,
    ParceirosModule,
    CompeticaoVotosModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    }
  ],
})
export class AppModule {}
