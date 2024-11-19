import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { TiposService } from './tipos.service';
import { CreateTipoDto } from './dto/create-tipo.dto';
import { UpdateTipoDto } from './dto/update-tipo.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('v1/tipos')
export class TiposController {
  constructor(private readonly tiposService: TiposService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createTipoDto: CreateTipoDto) {
    return this.tiposService.create(createTipoDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @Query('_id') _id,
    @Query('nome') nome,
    @Query('grupo') grupo,
    @Query('status') status,
    @Query('limit') limit,
    @Query('page') page
  ) {
    return this.tiposService.findAll(_id, nome, grupo, status, limit, page);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':_id')
  findOne(@Param('_id') _id: string) {
    return this.tiposService.findOne(_id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':_id')
  update(@Param('_id') _id: string, @Body() updateTipoDto: UpdateTipoDto) {
    return this.tiposService.update(_id, updateTipoDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':_id')
  remove(@Param('_id') _id: string) {
    return this.tiposService.remove(_id);
  }
}
