import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Request } from '@nestjs/common';
import { ComentariosService } from './comentarios.service';
import { CreateComentarioDto } from './dto/create-comentario.dto';
import { UpdateComentarioDto } from './dto/update-comentario.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Public } from 'src/auth/public.decorator';

@Controller('v1/comentarios')
export class ComentariosController {
  constructor(private readonly comentariosService: ComentariosService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createComentarioDto: CreateComentarioDto) {
    return this.comentariosService.create(createComentarioDto);
  }

  @UseGuards(JwtAuthGuard)
  @Public()
  @Get()
  findAll(
    @Query('_id') _id,
    @Query('capitulo') capitulo,
    @Query('projeto') projeto,
    @Query('usuario') usuario,
    @Request() req
  ) {
    return this.comentariosService.findAll(_id, capitulo, projeto, usuario, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':_id')
  findOne(@Param('_id') _id: string) {
    return this.comentariosService.findOne(_id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':_id')
  update(@Param('_id') _id: string, @Body() updateComentarioDto: UpdateComentarioDto) {
    return this.comentariosService.update(_id, updateComentarioDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':_id')
  remove(@Param('_id') _id: string) {
    return this.comentariosService.remove(_id);
  }
}
