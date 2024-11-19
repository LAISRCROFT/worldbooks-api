import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { CapitulosVotadosService } from './capitulos_votados.service';
import { CreateCapitulosVotadoDto } from './dto/create-capitulos_votado.dto';
import { UpdateCapitulosVotadoDto } from './dto/update-capitulos_votado.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('capitulos-votados')
export class CapitulosVotadosController {
  constructor(private readonly capitulosVotadosService: CapitulosVotadosService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createCapitulosVotadoDto: CreateCapitulosVotadoDto,
    @Request() req
  ) {
    return this.capitulosVotadosService.create(createCapitulosVotadoDto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @Query('_id') _id,
    @Query('capitulo') capitulo,
    @Query('usuario') usuario,
    @Request() req
  ) {
    return this.capitulosVotadosService.findAll(_id, capitulo, usuario, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':_id')
  findOne(@Param('_id') _id: string) {
    return this.capitulosVotadosService.findOne(_id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':_id')
  update(@Param('_id') _id: string, @Body() updateCapitulosVotadoDto: UpdateCapitulosVotadoDto) {
    return this.capitulosVotadosService.update(_id, updateCapitulosVotadoDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':_id')
  remove(@Param('_id') _id: string) {
    return this.capitulosVotadosService.remove(_id);
  }
}
