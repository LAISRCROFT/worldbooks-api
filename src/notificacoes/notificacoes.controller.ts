import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { NotificacoesService } from './notificacoes.service';
import { CreateNotificacaoDto } from './dto/create-notificacao.dto';
import { UpdateNotificacaoDto } from './dto/update-notificacao.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('v1/notificacoes')
export class NotificacoesController {
  constructor(private readonly notificacoesService: NotificacoesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createNotificacoeDto: CreateNotificacaoDto) {
    return this.notificacoesService.create(createNotificacoeDto);
  }
  
  @UseGuards(JwtAuthGuard)
  @Post('enviar-notificacao')
  enviarNotificacaoAutor(
    @Body() body,
    @Request() req,
  ) {
    return this.notificacoesService.enviarNotificacaoAutor(body, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @Query('_id') _id,
    @Query('rementente') rementente,
    @Query('destinatario') destinatario,
    @Query('lido') lido,
    @Request() req
  ) {
    return this.notificacoesService.findAll(_id, rementente, destinatario, lido, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':_id')
  findOne(@Param('_id') _id: string) {
    return this.notificacoesService.findOne(_id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':_id')
  update(@Param('_id') _id: string, @Body() updateNotificacoeDto: UpdateNotificacaoDto) {
    return this.notificacoesService.update(_id, updateNotificacoeDto);
  }
  
  @UseGuards(JwtAuthGuard)
  @Patch('ler-notificacao/:_id')
  lerNotificacao(@Param('_id') _id: string, @Body() updateNotificacoeDto: UpdateNotificacaoDto) {
    return this.notificacoesService.lerNotificacao(_id, updateNotificacoeDto);
  }
  
  @UseGuards(JwtAuthGuard)
  @Patch('aceitar-convite/:_id')
  aceitarConvite(
    @Param('_id') _id: string, 
    @Body() updateNotificacoeDto: UpdateNotificacaoDto,
    @Request() req
  ) {
    return this.notificacoesService.aceitarConvite(_id, updateNotificacoeDto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':_id')
  remove(@Param('_id') _id: string) {
    return this.notificacoesService.remove(_id);
  }
}
