import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, UseInterceptors, UploadedFile, Request, Res } from '@nestjs/common';
import { HistoriasService } from './historias.service';
import { CreateHistoriaDto } from './dto/create-historia.dto';
import { UpdateHistoriaDto } from './dto/update-historia.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { diskStorage } from 'multer';
import path = require('path');
import { v4 as uuidv4 } from 'uuid';
import { FileInterceptor } from '@nestjs/platform-express';
import { Observable, of } from 'rxjs';
import { Historia } from './interfaces/historia.interfaces';
import { Public } from 'src/auth/public.decorator';

export const storage = {
  storage: diskStorage({
    destination: './uploads/capas',
    filename: (req, file, cb) => {
      const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4()
      const extension: string = path.parse(file.originalname).ext;

      cb(null, `${filename}${extension}`)
    }
  })
}

@Controller('v1/historias')
export class HistoriasController {
  constructor(private readonly historiasService: HistoriasService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createHistoriaDto: CreateHistoriaDto) {
    return this.historiasService.create(createHistoriaDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('rascunho')
  createRascunho(
    @Body() createHistoriaDto: CreateHistoriaDto,
    @Request() req
  ) {
    return this.historiasService.createHistoriaRascunho(createHistoriaDto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Public()
  @Get()
  findAll(
    @Query('_id') _id,
    @Query('categoria') categoria,
    @Query('titulo') titulo,
    @Query('publico_alvo') publico_alvo,
    @Query('idioma') idioma,
    @Query('direitos_autorais') direitos_autorais,
    @Query('conteudo_adulto') conteudo_adulto,
    @Query('usuario') usuario, 
    @Query('historia_finalizada') historia_finalizada,
    @Query('projeto') projeto,
    @Query('data') data,
    @Query('mode') mode,
    @Query('pesquisa') pesquisa,
    @Query('limit') limit,
    @Query('page') page,
    @Query('user') user,
  ) {
    return this.historiasService.findAll(_id, categoria, titulo, publico_alvo, idioma, direitos_autorais, conteudo_adulto, usuario, historia_finalizada, projeto, data, mode, pesquisa, limit, page, user);
  }

  @UseGuards(JwtAuthGuard)
  @Public()
  @Get(':_id')
  findOne(@Param('_id') _id: string) {
    return this.historiasService.findOne(_id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':_id')
  update(@Param('_id') _id: string, @Body() updateHistoriaDto: UpdateHistoriaDto) {
    return this.historiasService.update(_id, updateHistoriaDto);
  }
  
  @UseGuards(JwtAuthGuard)
  @Patch('remove-projeto/:historiaId/:projetoId')
  removerHistoriaDoProjeto(
    @Param('historiaId') historiaId: string, 
    @Param('projetoId') projetoId: string, 
  ) {
    return this.historiasService.removerHistoriaDoProjeto(historiaId, projetoId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('finalizar-criacao/:_id')
  createHistoria(@Param('_id') _id: string, @Body() updateHistoriaDto: UpdateHistoriaDto) {
    return this.historiasService.createHistoria(_id, updateHistoriaDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':_id')
  remove(@Param('_id') _id: string) {
    return this.historiasService.remove(_id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload/capa/:_id')
  @UseInterceptors(FileInterceptor('file', storage))
  async uploadFile(
    @UploadedFile() file, 
    @Request() req,
    @Param('_id') _id: string
  ): Promise<Observable<Object>> {
    
    let historia = await this.historiasService.findOne(_id)
    historia['caminho_capa'] = file.filename
    return await this.historiasService.update(_id, historia)
  }

  @Get('capa-image/:imagename')
  @Public()
  async profileProfileImage(@Param('imagename') imagename, @Res() res): Promise<any> {
    return of(res.sendFile(path.join(process.cwd(), 'uploads/capas/' + imagename)));
  }
}