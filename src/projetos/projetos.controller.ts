import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query, UploadedFile, UseInterceptors, Res } from '@nestjs/common';
import { ProjetosService } from './projetos.service';
import { CreateProjetoDto } from './dto/create-projeto.dto';
import { UpdateProjetoDto } from './dto/update-projeto.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Public } from 'src/auth/public.decorator';
import { diskStorage } from 'multer';
import path = require('path');
import { v4 as uuidv4 } from 'uuid';
import { FileInterceptor } from '@nestjs/platform-express';
import { Observable, of } from 'rxjs';

export const storage = {
  storage: diskStorage({
    destination: './uploads/projetos',
    filename: (req, file, cb) => {
      const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4()
      const extension: string = path.parse(file.originalname).ext;

      cb(null, `${filename}${extension}`)
    }
  })
}

@Controller('v1/projetos')
export class ProjetosController {
  constructor(private readonly projetosService: ProjetosService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createProjetoDto: CreateProjetoDto,
    @Request() req,
  ) {
    return this.projetosService.create(createProjetoDto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('apuracao-votos/:projetoId')
  apuracaoVotos(
    @Param('projetoId') projetoId: string
  ) {
    return this.projetosService.apuracaoVotos(projetoId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @Public()
  findAll(
    @Query('_id') _id,
    @Query('nome') nome,
    @Query('numero_participantes') numero_participantes,
    @Query('numero_min_participantes') numero_min_participantes,
    @Query('numero_max_participantes') numero_max_participantes,
    @Query('gestor') gestor,
    @Query('status') status,
    @Query('tipo') tipo,
    @Query('data') data,
    @Query('limit') limit,
    @Query('page') page,
    @Request() req
  ) {
    return this.projetosService.findAll(_id, nome, numero_participantes, numero_min_participantes, numero_max_participantes, gestor, status, tipo, data, limit, page);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':_id')
  @Public()
  findOne(
    @Query('sort') sort,
    @Param('_id') _id: string
  ) {
    return this.projetosService.findOne(_id, sort);
  }

  @UseGuards(JwtAuthGuard)
  @Get('dashboard/historias-mais-votadas/:_id')
  dashboardHistoriasMaisVotadas(
    @Param('_id') _id: string,
    @Request() req
  ) {
    return this.projetosService.dashboardHistoriasMaisVotadas(_id, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':_id')
  update(@Param('_id') _id: string, @Body() updateProjetoDto: UpdateProjetoDto) {
    return this.projetosService.update(_id, updateProjetoDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('avancar-projeto/:_id')
  avancarProjeto(@Param('_id') _id: string, @Body() updateProjetoDto: UpdateProjetoDto) {
    return this.projetosService.avancarProjeto(_id, updateProjetoDto);
  }
  
  @UseGuards(JwtAuthGuard)
  @Post('votar/:projetoId/:historiaId')
  votar(
    @Param('projetoId') projetoId: string,
    @Param('historiaId') historiaId: string,
    @Request() req
  ) {
    return this.projetosService.votar(projetoId, historiaId, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':_id')
  remove(@Param('_id') _id: string) {
    return this.projetosService.remove(_id);
  }
  
  @Post('teste/:projetoId')
  countNumeroParticipantes(
    @Param('projetoId') projetoId: string,
  ) {
    return this.projetosService.countNumeroParticipantes(projetoId);
  }
  
  @UseGuards(JwtAuthGuard)
  @Post('comentar/:_id')
  comentar(@Body() body, @Param('_id') _id: string, @Request() req) {
    return this.projetosService.comentar(body, _id, req.user);
  }
  
  @UseGuards(JwtAuthGuard)
  @Post('responder-comentario/:_id')
  responderComentario(@Body() body, @Param('_id') _id: string, @Request() req) {
    return this.projetosService.responderComentario(body, _id, req.user);
  }
  
  @UseGuards(JwtAuthGuard)
  @Post('upload/capa/:_id')
  @UseInterceptors(FileInterceptor('file', storage))
  async uploadFile(
    @UploadedFile() file, 
    @Request() req,
    @Param('_id') _id: string
  ): Promise<Observable<Object>> {
    
    let projeto = await this.projetosService.findOne(_id, null)
    projeto['capa'] = file.filename
    return await this.projetosService.update(_id, projeto)
  }

  @Get('capa-image/:imagename')
  @Public()
  async profileProfileImage(@Param('imagename') imagename, @Res() res): Promise<any> {
    return of(res.sendFile(path.join(process.cwd(), 'uploads/projetos/' + imagename)));
  }
}
