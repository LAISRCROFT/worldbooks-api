import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { GruposService } from './grupos.service';
import { CreateGrupoDto } from './dto/create-grupo.dto';
import { UpdateGrupoDto } from './dto/update-grupo.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('v1/grupos')
export class GruposController {
  constructor(private readonly gruposService: GruposService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createGrupoDto: CreateGrupoDto) {
    return this.gruposService.create(createGrupoDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.gruposService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':_id')
  findOne(@Param('_id') _id: string) {
    return this.gruposService.findOne(_id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':_id')
  update(@Param('_id') _id: string, @Body() updateGrupoDto: UpdateGrupoDto) {
    return this.gruposService.update(_id, updateGrupoDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':_id')
  remove(@Param('_id') _id: string) {
    return this.gruposService.remove(_id);
  }
}
