import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { StatusService } from './status.service';
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';

@Controller('v1/status')
export class StatusController {
  constructor(private readonly statusService: StatusService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createStatusDto: CreateStatusDto,
    @Request() req: any
  ) {
    return this.statusService.create(createStatusDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.statusService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':_id')
  findOne(@Param('_id') _id: string) {
    return this.statusService.findOne(_id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':_id')
  update(@Param('_id') _id: string, @Body() updateStatusDto: UpdateStatusDto) {
    return this.statusService.update(_id, updateStatusDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':_id')
  remove(@Param('_id') _id: string) {
    return this.statusService.remove(_id);
  }
}
