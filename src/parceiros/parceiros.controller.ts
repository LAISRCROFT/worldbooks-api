import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Request, Res, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ParceirosService } from './parceiros.service';
import { CreateParceiroDto } from './dto/create-parceiro.dto';
import { UpdateParceiroDto } from './dto/update-parceiro.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Public } from 'src/auth/public.decorator';
import { diskStorage } from 'multer';
import path = require('path');
import { v4 as uuidv4 } from 'uuid';
import { FileInterceptor } from '@nestjs/platform-express';
import { Observable, of } from 'rxjs';
import { Parceiro } from './interfaces/parceiros.interfaces';

export const storage = {
  storage: diskStorage({
    destination: './uploads/parceiros',
    filename: (req, file, cb) => {
      const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4()
      const extension: string = path.parse(file.originalname).ext;

      cb(null, `${filename}${extension}`)
    }
  })
}

@Controller('v1/parceiros')
export class ParceirosController {
  constructor(private readonly parceirosService: ParceirosService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createParceiroDto: CreateParceiroDto) {
    return this.parceirosService.create(createParceiroDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @Public()
  findAll(
    @Query('_id') _id,
    @Query('nome') nome,
    @Query('status') status,
    @Query('data') data,
    @Query('limit') limit,
    @Query('page') page
  ) {
    return this.parceirosService.findAll(_id, nome, status, data, limit, page);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':_id')
  findOne(@Param('_id') _id: string) {
    return this.parceirosService.findOne(_id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':_id')
  update(@Param('_id') _id: string, @Body() updateParceiroDto: UpdateParceiroDto) {
    return this.parceirosService.update(_id, updateParceiroDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':_id')
  remove(@Param('_id') _id: string) {
    return this.parceirosService.remove(_id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload/foto/:parceiroId')
  @UseInterceptors(FileInterceptor('file', storage))
  async uploadFile(
    @Param('parceiroId') parceiroId: string,
    @UploadedFile() file, 
    @Request() req
  ): Promise<Observable<Object>> {
    let parceiro = await this.parceirosService.findOne(parceiroId)
    parceiro['foto'] = file.filename
    return await this.parceirosService.update(parceiro._id, parceiro)
  }

  @Get('parceiro-image/:imagename')
  @Public()
  async profileProfileImage(@Param('imagename') imagename, @Res() res): Promise<any> {
    return of(res.sendFile(path.join(process.cwd(), 'uploads/parceiros/' + imagename)));
  }
}
