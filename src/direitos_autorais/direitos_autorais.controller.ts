import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { DireitosAutoraisService } from './direitos_autorais.service';
import { CreateDireitoAutoralDto } from './dto/create-direito_autoral.dto';
import { UpdateDireitoAutoralDto } from './dto/update-direito_autoral.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('v1/direitos-autorais')
export class DireitosAutoraisController {
  constructor(private readonly direitosAutoraisService: DireitosAutoraisService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createDireitoAutoralDto: CreateDireitoAutoralDto) {
    return this.direitosAutoraisService.create(createDireitoAutoralDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.direitosAutoraisService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':_id')
  findOne(@Param('_id') _id: string) {
    return this.direitosAutoraisService.findOne(_id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':_id')
  update(@Param('_id') _id: string, @Body() updateDireitoAutoralDto: UpdateDireitoAutoralDto) {
    return this.direitosAutoraisService.update(_id, updateDireitoAutoralDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':_id')
  remove(@Param('_id') _id: string) {
    return this.direitosAutoraisService.remove(_id);
  }
}
