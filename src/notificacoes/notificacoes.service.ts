import { BadRequestException, forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { CreateNotificacaoDto } from './dto/create-notificacao.dto';
import { UpdateNotificacaoDto } from './dto/update-notificacao.dto';
import { Notificacao } from './interfaces/noticacoes.interfaces';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { HistoriasService } from 'src/historias/historias.service';
import { ProjetosService } from 'src/projetos/projetos.service';
const mongoose = require("mongoose");

@Injectable()
export class NotificacoesService {
  constructor(
    @InjectModel('Notificacao') private readonly notificacaoModel: Model<Notificacao>,
    @Inject(forwardRef(() => ProjetosService)) private readonly projetosService: ProjetosService,
    @Inject(forwardRef(() => UsuariosService)) private readonly usuariosService: UsuariosService,
    private readonly historiasService: HistoriasService,
  ) {}
  private readonly logger = new Logger(NotificacoesService.name)

  async create(createNotificacaoDto:any):Promise<any> {
    try {
      let notificacao = await this.notificacaoModel.create(createNotificacaoDto)
      return notificacao
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async enviarNotificacaoAutor(data, user?) {
    try {
      let remetente = await this.usuariosService.consultarUserEmail(user.email)
      let destinatario = await this.usuariosService.findOne(data.destinatario)

      let notificacao = {
        remetente: new mongoose.Types.ObjectId(remetente._id),
        destinatario: new mongoose.Types.ObjectId(destinatario._id)
      }

      if (data.tipo) {
        notificacao['tipo'] = new mongoose.Types.ObjectId(data.tipo)
      }

      if (data.projeto) {
        notificacao['projeto'] = new mongoose.Types.ObjectId(data.projeto)
      }

      if (data.historia) {
        notificacao['historia'] = new mongoose.Types.ObjectId(data.historia)
      }

      let create = await this.notificacaoModel.create(notificacao)
      return create
      
    } catch (error) {
      this.logger.error(error)
    }
  }

  async findAll(_id, remetente, destinatario, lido, user?) {
    try {
      
      let query = {}
      
      if(_id){
        query['_id'] = new mongoose.Types.ObjectId(_id)
      }
      
      if(destinatario){
        query['destinatario'] = new mongoose.Types.ObjectId(destinatario)
      }
      
      if(remetente){
        query['remetente'] = new mongoose.Types.ObjectId(remetente)
      }
      
      if(lido){
        query['lido'] = Boolean(lido)
      }

      if (user) {
        let userDestinatario = await this.usuariosService.consultarUserEmail(user.email)
        query['destinatario'] = new mongoose.Types.ObjectId(userDestinatario._id)
      }

      let notificacoesNaoLidasQuery = {
        ...query,
        lido: false
      }

      let count = await this.notificacaoModel.countDocuments(query)
      let countNaoLidas = await this.notificacaoModel.countDocuments(notificacoesNaoLidasQuery)
      let notificacoes = await this.notificacaoModel.find(query)
      .populate([
        { path: 'destinatario' },
        { path: 'remetente' }, 
        { path: 'tipo' }, 
        { path: 'projeto' }, 
        { path: 'historia' }, 
      ])
      .limit(15)
      .sort({ createdAt: -1 })
      .exec()

      return {
        notificacoes: notificacoes,
        countNaoLidas: countNaoLidas,
        count: count
      }

    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async findOne(_id) {
    try {
      let notificacao = await this.notificacaoModel.findById(_id)
      return notificacao
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async update(_id, updateNotificacaoDto:any) {
    try {
      let notificacao = await this.notificacaoModel.findByIdAndUpdate(_id, updateNotificacaoDto, {new: true})
      return notificacao
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async lerNotificacao(_id, updateNotificacaoDto:any) {
    try {
      
      const notificacaoExistente = await this.notificacaoModel.findOne({ _id: _id })
      if (!notificacaoExistente) {
        throw new BadRequestException(`Notificação não encontrada`)
      }

      notificacaoExistente.lido = true

      let notificacao = await this.notificacaoModel.findByIdAndUpdate(_id, notificacaoExistente, { new: true })
      return notificacao
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async aceitarConvite(_id, updateNotificacaoDto:any, user) {
    try {
      
      const notificacaoExistente:any = await this.notificacaoModel.findOne({ _id: _id })
      .populate([ { path: 'projeto' } ]).exec()
      if (!notificacaoExistente) {
        throw new BadRequestException(`Notificação não encontrada`)
      }

      this.logger.verbose(`notificacao: ${JSON.stringify(notificacaoExistente)}`)

      if (!notificacaoExistente.status.equals(new mongoose.Types.ObjectId('67246270d7ee7f7570218e6d'))) {
        return {
          code: 6,
          message: "O projeto não está com as inscrições abertas"
        }
      }

      let verificarLimiteParticipantes = await this.projetosService.verificarLimiteParticipantes(notificacaoExistente.projeto._id)
      console.log(verificarLimiteParticipantes)

      if (verificarLimiteParticipantes) {
        return {
          code: 5,
          message: "Projeto está no limite da quantidade de histórias"
        }
      }

      await this.historiasService.incluirProjeto(notificacaoExistente.historia, notificacaoExistente.projeto._id)

      if (notificacaoExistente.tipo.equals(new mongoose.Types.ObjectId('6732b726f5941d1308fd4029'))) {
        let incluirProjeto = await this.usuariosService.incluirProjeto(notificacaoExistente.remetente, notificacaoExistente.projeto._id)

        if (incluirProjeto) {
          let data = {
            historia: notificacaoExistente.historia,
            projeto: notificacaoExistente.projeto._id,
            destinatario: notificacaoExistente.remetente,
            tipo: new mongoose.Types.ObjectId('6733b72911c6cd33882cb282') // Pedido aceito
          }
  
          await this.enviarNotificacaoAutor(data, user)
        }
      } else {
        
        let incluirProjeto = await this.usuariosService.incluirProjeto(notificacaoExistente.destinatario, notificacaoExistente.projeto._id)

        if (incluirProjeto) {
          let data = {
            historia: notificacaoExistente.historia,
            projeto: notificacaoExistente.projeto._id,
            destinatario: notificacaoExistente.remetente,
            tipo: new mongoose.Types.ObjectId('6733b71f11c6cd33882cb281') // Convite aceito
          }
  
          await this.enviarNotificacaoAutor(data, user)
        }
      }

      await this.projetosService.countNumeroParticipantes(notificacaoExistente.projeto)

      return notificacaoExistente
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async remove(_id) {
    try {
      let notificacao = await this.notificacaoModel.findByIdAndDelete(_id)
      return notificacao
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }
}
