import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Request } from '@nestjs/common';
import { CompeticaoVotosService } from './competicao_votos.service';
import { CreateCompeticaoVotoDto } from './dto/create-competicao_voto.dto';
import { UpdateCompeticaoVotoDto } from './dto/update-competicao_voto.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('v1/competicao-votos')
export class CompeticaoVotosController {
  constructor(private readonly competicaoVotosService: CompeticaoVotosService) {}

  @UseGuards(JwtAuthGuard)
  @Post('votar')
  create(
    @Body() createCompeticaoVotoDto: CreateCompeticaoVotoDto,
    @Request() req
  ) {
    return this.competicaoVotosService.create(createCompeticaoVotoDto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @Query('_id') _id,
    @Query('historia_votada') historia_votada,
    @Query('usuario') usuario,
    @Query('projeto') projeto,
    @Query('data') data
  ) {
    return this.competicaoVotosService.findAll(_id, historia_votada, usuario, projeto, data);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':_id')
  findOne(@Param('_id') _id: string) {
    return this.competicaoVotosService.findOne(_id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':_id')
  update(@Param('_id') _id: string, @Body() updateCompeticaoVotoDto: UpdateCompeticaoVotoDto) {
    return this.competicaoVotosService.update(_id, updateCompeticaoVotoDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':_id')
  remove(@Param('_id') _id: string) {
    return this.competicaoVotosService.remove(_id);
  }
}
