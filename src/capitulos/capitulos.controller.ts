import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { CapitulosService } from './capitulos.service';
import { CreateCapituloDto } from './dto/create-capitulo.dto';
import { UpdateCapituloDto } from './dto/update-capitulo.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Public } from 'src/auth/public.decorator';

@Controller('v1/capitulos')
export class CapitulosController {
  constructor(private readonly capitulosService: CapitulosService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createCapituloDto: CreateCapituloDto,
    @Request() req,
  ) {
    return this.capitulosService.create(createCapituloDto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Public()
  @Get()
  async findAll(
    @Query('_id') _id,
    @Query('titulo') titulo,
    @Query('historia') historia,
    @Query('usuario') usuario,
    @Query('status') status,
    @Query('data') data,
    @Query('limit') limit,
    @Query('page') page,
    @Request() req,
  ) {
    return await this.capitulosService.findAll(_id, titulo, historia, usuario, status, data, limit, page, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Public()
  @Get(':_id')
  findOne(
    @Param('_id') _id: string, 
    @Query('usuario') usuario
  ) {
    return this.capitulosService.findOne(_id, usuario);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':_id')
  update(@Param('_id') _id: string, @Body() updateCapituloDto: UpdateCapituloDto) {
    return this.capitulosService.update(_id, updateCapituloDto);
  }

  @UseGuards(JwtAuthGuard)
  @Public()
  @Patch('visualizador/:_id')
  visualizador(@Param('_id') _id: string, @Body() updateCapituloDto: UpdateCapituloDto) {
    return this.capitulosService.visualizador(_id, updateCapituloDto);
  }
  
  @UseGuards(JwtAuthGuard)
  @Post('votar/:_id')
  votar(@Body() body, @Param('_id') _id: string, @Request() req) {
    return this.capitulosService.votar(body, _id, req.user);
  }
  
  @UseGuards(JwtAuthGuard)
  @Post('comentar/:_id')
  comentar(@Body() body, @Param('_id') _id: string, @Request() req) {
    return this.capitulosService.comentar(body, _id, req.user);
  }
  
  @UseGuards(JwtAuthGuard)
  @Post('responder-comentario/:_id')
  responderComentario(@Body() body, @Param('_id') _id: string, @Request() req) {
    return this.capitulosService.responderComentario(body, _id, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':_id')
  remove(@Param('_id') _id: string) {
    return this.capitulosService.remove(_id);
  }
}
