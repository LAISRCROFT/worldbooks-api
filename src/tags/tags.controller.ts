import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Public } from 'src/auth/public.decorator';

@Controller('v1/tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createTagDto: CreateTagDto) {
    return this.tagsService.create(createTagDto);
  }

  @UseGuards(JwtAuthGuard)
  @Public()
  @Get()
  findAll(
    @Query('nome') nome
  ) {
    return this.tagsService.findAll(nome);
  }

  @UseGuards(JwtAuthGuard)
  @Public()
  @Get(':_id')
  findOne(@Param('_id') _id: string) {
    return this.tagsService.findOne(_id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':_id')
  update(@Param('_id') _id: string, @Body() updateTagDto: UpdateTagDto) {
    return this.tagsService.update(_id, updateTagDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':_id')
  remove(@Param('_id') _id: string) {
    return this.tagsService.remove(_id);
  }
}
