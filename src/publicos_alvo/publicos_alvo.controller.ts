import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PublicosAlvoService } from './publicos_alvo.service';
import { CreatePublicoAlvoDto } from './dto/create-publico_alvo.dto';
import { UpdatePublicoAlvoDto } from './dto/update-publico_alvo.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('v1/publicos-alvos')
export class PublicosAlvoController {
  constructor(private readonly publicosAlvoService: PublicosAlvoService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createPublicoAlvoDto: CreatePublicoAlvoDto) {
    return this.publicosAlvoService.create(createPublicoAlvoDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.publicosAlvoService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':_id')
  findOne(@Param('_id') _id: string) {
    return this.publicosAlvoService.findOne(_id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':_id')
  update(@Param('_id') _id: string, @Body() updatePublicoAlvoDto: UpdatePublicoAlvoDto) {
    return this.publicosAlvoService.update(_id, updatePublicoAlvoDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':_id')
  remove(@Param('_id') _id: string) {
    return this.publicosAlvoService.remove(_id);
  }
}
