import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { IdiomasService } from './idiomas.service';
import { CreateIdiomaDto } from './dto/create-idioma.dto';
import { UpdateIdiomaDto } from './dto/update-idioma.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('v1/idiomas')
export class IdiomasController {
  constructor(private readonly idiomasService: IdiomasService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createIdiomaDto: CreateIdiomaDto) {
    return this.idiomasService.create(createIdiomaDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.idiomasService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':_id')
  findOne(@Param('_id') _id: string) {
    return this.idiomasService.findOne(_id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':_id')
  update(@Param('_id') _id: string, @Body() updateIdiomaDto: UpdateIdiomaDto) {
    return this.idiomasService.update(_id, updateIdiomaDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':_id')
  remove(@Param('_id') _id: string) {
    return this.idiomasService.remove(_id);
  }
}
