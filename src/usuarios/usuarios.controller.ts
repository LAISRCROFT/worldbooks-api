import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile, Request, Res, Query } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { diskStorage } from 'multer';
import path = require('path');
import { v4 as uuidv4 } from 'uuid';
import { FileInterceptor } from '@nestjs/platform-express';
import { Observable, of } from 'rxjs';
import { Usuario } from './interfaces/usuarios.interfaces';
import { Public } from 'src/auth/public.decorator';

export const storage = {
  storage: diskStorage({
    destination: './uploads/profiles',
    filename: (req, file, cb) => {
      const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4()
      const extension: string = path.parse(file.originalname).ext;

      cb(null, `${filename}${extension}`)
    }
  })
}

@Controller('v1/usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  @Public()
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.create(createUsuarioDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @Query('_id') _id,
    @Query('name') name,
    @Query('email') email,
    @Query('tipo') tipo,
    @Query('projeto') projeto,
    @Query('status') status,
    @Query('data') data,
    @Query('limit') limit,
    @Query('page') page,
    @Request() req
  ) {
    return this.usuariosService.findAll(_id, name, email, tipo, projeto, status, data, limit, page, req.user);
  }
  
  @UseGuards(JwtAuthGuard)
  @Public()
  @Get(':_id')
  findOne(@Param('_id') _id: string) {
    return this.usuariosService.findOne(_id);
  }
  
  @UseGuards(JwtAuthGuard)
  @Patch(':_id')
  update(@Param('_id') _id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuariosService.update(_id, updateUsuarioDto);
  }
  
  @UseGuards(JwtAuthGuard)
  @Patch('alterar-senha/:_id')
  alterarSenha(@Param('_id') _id: string, @Body() body) {
    return this.usuariosService.alterarSenha(_id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':_id')
  remove(@Param('_id') _id: string) {
    return this.usuariosService.remove(_id);
  }
  
  @UseGuards(JwtAuthGuard)
  @Post('upload/foto')
  @UseInterceptors(FileInterceptor('file', storage))
  async uploadFile(@UploadedFile() file, @Request() req): Promise<Observable<Object>> {
    const user: Usuario = req.user;
    
    let usuario = await this.usuariosService.consultarUserEmail(user.email)
    usuario['foto_perfil'] = file.filename
    return await this.usuariosService.update(usuario._id, usuario)
  }

  @Get('profile-image/:imagename')
  @Public()
  async profileProfileImage(@Param('imagename') imagename, @Res() res): Promise<any> {
    return of(res.sendFile(path.join(process.cwd(), 'uploads/profiles/' + imagename)));
  }
}
