import { BadRequestException, forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { CreateProjetoDto } from './dto/create-projeto.dto';
import { UpdateProjetoDto } from './dto/update-projeto.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Projeto } from './interfaces/projetos.interfaces';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { HistoriasService } from 'src/historias/historias.service';
import { endOfDay, subHours } from 'date-fns';
import { CompeticaoVotosService } from 'src/competicao_votos/competicao_votos.service';
import { ComentariosService } from 'src/comentarios/comentarios.service';
import { NotificacoesService } from 'src/notificacoes/notificacoes.service';
const mongoose = require("mongoose");

@Injectable()
export class ProjetosService {
  constructor(
    @InjectModel('Projeto') private readonly projetoModel: Model<Projeto>,
    @Inject(forwardRef(() => UsuariosService)) private readonly usuariosService: UsuariosService,
    @Inject(forwardRef(() => HistoriasService)) private readonly historiasService: HistoriasService,
    @Inject(forwardRef(() => CompeticaoVotosService)) private readonly competicaoVotosService: CompeticaoVotosService,
    @Inject(forwardRef(() => NotificacoesService)) private readonly notificacoesService: NotificacoesService,
    private readonly comentariosService: ComentariosService,
  ) {}
  private readonly logger = new Logger(ProjetosService.name)

  async create(createProjetoDto:any, user?):Promise<any> {
    try {

      createProjetoDto.gestor = new mongoose.Types.ObjectId(user._id)
      createProjetoDto.numero_participantes = 0
      createProjetoDto.status = new mongoose.Types.ObjectId('67246270d7ee7f7570218e6d') // inscrições abertas
      if (createProjetoDto.parceiro == '') delete createProjetoDto.parceiro

      let projeto = await this.projetoModel.create(createProjetoDto)

      this.logger.log(`projeto ${projeto._id} criado com sucesso`)

      return projeto
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async countNumeroParticipantes(projetoId) {
    try {
        
      const projetoExistente = await this.projetoModel.findOne({ _id: projetoId })
      if (!projetoExistente) {
        throw new BadRequestException(`Projeto não encontrado`)
      }                 
                                                                                      // comum / participante
      let countParticipantes = await this.usuariosService.findAll(null, null, null, '671947ef39d9b6b7a03407ef', projetoId, null, null, null, null)

      projetoExistente.numero_participantes = countParticipantes.count
      return await this.update(projetoId, projetoExistente)      

    } catch (error) {
      this.logger.error(error)
    }
  }

  async findAll(_id, nome, numero_participantes, numero_min_participantes, numero_max_participantes, gestor, status, tipo, data, limit, page) {
    try {
      let query = {}

      if(_id){
        query['_id'] = new mongoose.Types.ObjectId(_id)
      }

      if(nome) {
        query['nome'] =  { $regex: new RegExp(nome), $options:'i' }
      }

      if(numero_participantes){
        query['numero_participantes'] = numero_participantes
      }

      if(numero_min_participantes){
        query['numero_min_participantes'] = numero_min_participantes
      }

      if(numero_max_participantes){
        query['numero_max_participantes'] = numero_max_participantes
      }

      if(tipo){
        query['tipo'] = new mongoose.Types.ObjectId(tipo)
      }

      if(gestor){
        query['gestor'] = new mongoose.Types.ObjectId(gestor)
      }

      if(status){
        query['status'] = new mongoose.Types.ObjectId(status)
      }

      if (data) {
        let dataRange = data.split(',')

        query['createdAt'] = {
          $gte: subHours(new Date(dataRange[0]), 3), 
          $lte: subHours(endOfDay(new Date(dataRange[1])), 3)
        }
      }

      if(limit){
        limit = parseInt(limit)
      }else{
          limit = 10
      }

      if (page){
        if (page != 1) {
            page = limit*(page-1)
        } else {
            page = 0
        }
      } else {
          page = 0
      }
      
      let projetos = await this.projetoModel.find(query)
      .populate([
        { path: 'tipo' },
        { path: 'status' },
        { path: 'parceiro' },
        { path: 'gestor' },
      ])
      .limit(limit)
      .skip(page)
      .sort({ createdAt: -1 })
      .exec()
      
      let count = await this.projetoModel.countDocuments(query)
      
      return {
        projetos: projetos,
        count: count 
      }

    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async findOne(_id, sort?) {
    try {
      
      const projetoExistente:any = await this.projetoModel.findOne({ _id: _id })
        .populate([
          { path: 'tipo' },
          { path: 'status' },
          { path: 'parceiro' },
          { path: 'gestor' },
          { 
            path: 'ranking',
            populate: {
              path: 'historia',
              populate: {
                path: 'usuario'
              }
            }
          },
        ]).exec()
      if (!projetoExistente) {
        throw new BadRequestException(`Projeto não encontrado`)
      }

      let historias = await this.historiasService.findAll(null, null, null, null, null, null, null, null, null, projetoExistente._id, null, null, null, 30, 0, null, sort)
      
      return {
        ... projetoExistente._doc,
        historias: historias
      }
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async dashboardHistoriasMaisVotadas(_id, user?) {
    try {
      
      const projetoExistente:any = await this.projetoModel.findOne({ _id: _id })
        .populate([
          { path: 'tipo' },
          { path: 'status' },
          { path: 'parceiro' },
          { path: 'gestor' },
          { 
            path: 'ranking',
            populate: {
              path: 'historia',
              populate: {
                path: 'usuario'
              }
            }
          },
        ])
        .exec()
      if (!projetoExistente) {
        throw new BadRequestException(`Projeto não encontrado`)
      }

      if (!projetoExistente.gestor._id.equals(new mongoose.Types.ObjectId(user._id))) {
        return {
          code: 4,
          message: 'Somente o gestor do projeto pode visualizar os resultados'
        }
      }
      
      let historias = await this.historiasService.findAll(null, null, null, null, null, null, null, null, null, projetoExistente._id, null, null, null, 30, null)
      
      let votos = await this.competicaoVotosService.findHistoriasMaisVotadasDeUmProjeto(null, projetoExistente._id, null)
      delete votos.ids

      let dashboard = {
        ... votos,
        ... projetoExistente._doc,
        historias: historias.historias,
        quantidade_historias_participando: historias.count
      }

      return dashboard
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async update(_id, updateProjetoDto:any) {
    try {
      const projetoExistente:any = await this.projetoModel.findOne({ _id: _id }).exec()
      if (!projetoExistente) {
        throw new BadRequestException(`Projeto não encontrado`)
      }

      this.logger.log(JSON.stringify(updateProjetoDto))

      let projeto = await this.projetoModel.findByIdAndUpdate(_id, updateProjetoDto, { new: true })
      return projeto
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async verificarLimiteParticipantes(_id, user?) {
    try {
      const projetoExistente:any = await this.projetoModel.findOne({ _id: _id })
        .populate([
          { path: 'tipo' },
          { path: 'status' },
          { path: 'parceiro' },
          { path: 'gestor' },
          { 
            path: 'ranking',
            populate: {
              path: 'historia',
              populate: {
                path: 'usuario'
              }
            }
          },
        ]).exec()
      if (!projetoExistente) {
        throw new BadRequestException(`Projeto não encontrado`)
      }

      let historias = await this.historiasService.findAll(null, null, null, null, null, null, null, null, null, projetoExistente._id, null, null, null, 30, 0, null)

      return historias.count >= projetoExistente.numero_max_participantes

    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async avancarProjeto(_id, updateProjetoDto:any) {
    try {

      const projetoExistente:any = await this.projetoModel.findOne({ _id: _id })
      if (!projetoExistente) {
        throw new BadRequestException(`Projeto não encontrado`)
      }

      let status = ''

      if (projetoExistente.status.equals('67246270d7ee7f7570218e6d')) { // inscricoes abertas
          status = '67246274d7ee7f7570218e6f'

      } else if (projetoExistente.status.equals('67246274d7ee7f7570218e6f')) { // inscrições fechadas
          status = '672462b7d7ee7f7570218e71'

      } else if (projetoExistente.status.equals('672462b7d7ee7f7570218e71')) { // fase de votacoes
          status = '672462c3d7ee7f7570218e73'

      } else if (projetoExistente.status.equals('672462c3d7ee7f7570218e73')) { // encerramento das votações
          await this.apuracaoVotos(projetoExistente._id)
          return false
          status = '672462cbd7ee7f7570218e75' // > apuracao dos votos

      } else if (projetoExistente.status.equals('672462cbd7ee7f7570218e75')) { // apuracao dos votos
          status = '672462dad7ee7f7570218e79' // > projeto encerrado

      } else {
        throw new BadRequestException(`Projeto já encerrado`)
      }

      projetoExistente.status = new mongoose.Types.ObjectId(status)

      let projeto = await this.projetoModel.findByIdAndUpdate(_id, projetoExistente, { new: true })
      return projeto

    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async votar(projetoId, historiaId, user?) {
    try {

      const projetoExistente:any = await this.projetoModel.findOne({ _id: projetoId })
      if (!projetoExistente) {
        throw new BadRequestException(`Projeto não encontrado`)
      }

      let competicaoVoto = {
        historia_votada: new mongoose.Types.ObjectId(historiaId),
        usuario: new mongoose.Types.ObjectId(user._id),
        projeto: new mongoose.Types.ObjectId(projetoId)
      }
      
      let voto = await this.competicaoVotosService.create(competicaoVoto)

      let projeto = await this.projetoModel.findByIdAndUpdate(projetoId, projetoExistente, { new: true })
      return projeto

    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async apuracaoVotos(projetoId, user?) {
    try {
      const projetoExistente:any = await this.projetoModel.findOne({ _id: projetoId })
        .populate([
          { path: 'tipo' },
          { path: 'status' },
          { path: 'parceiro' },
          { path: 'gestor' },
        ])
        .exec()
      if (!projetoExistente) {
        throw new BadRequestException(`Projeto não encontrado`)
      }
      
      let votos = await this.competicaoVotosService.findHistoriasMaisVotadasDeUmProjeto(null, projetoExistente._id, null)

      for (let i = 0; i < votos.ids.length; i++) {
        projetoExistente.ranking[i] = {
          colocacao: i + 1,
          historia: votos.ids[i],
          total_votos: votos.total_votos[i],
        }
      }

      projetoExistente.status = new mongoose.Types.ObjectId('672462dad7ee7f7570218e79') // > projeto encerrado

      this.logger.warn(`O projeto ${projetoExistente._id} teve os votos apurados`)

      let projeto = await this.projetoModel.findByIdAndUpdate(projetoId, projetoExistente, { new: true })
      return projeto

    } catch (error) {
      this.logger.error(error)
    }
  }
  
  async comentar(comentario, projeto, user?) {
    try {
      let proj = await this.projetoModel.findById(projeto)
      
      if (proj) {
        this.logger.log(`encontrou o projeto`)
        let createComment = await this.comentariosService.comentar(comentario.comentario, null, projeto, user)
        let comment = await this.comentariosService.findOne(createComment._id)
        this.logger.warn(`comentou: ${JSON.stringify(comment)}`)
        
        return comment
      }

    } catch (error) {
      this.logger.error(error)
      return error
    }
  }
  
  async responderComentario(comentario, projeto, user?) {
    try {
      let proj = await this.projetoModel.findById(projeto)
      
      if (proj) {
        this.logger.log(`encontrou o projeto`)
        let createComment = await this.comentariosService.responderComentario(comentario.comentarioId, projeto, null, comentario.comentario, user)
        let comment = await this.comentariosService.findOne(createComment._id)
        this.logger.warn(`respondeu: ${JSON.stringify(comment)}`)
        
        return comment
      }

    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async remove(_id) {
    try {
      let projeto = await this.projetoModel.findByIdAndDelete(_id)
      return projeto
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }
}