import { BadRequestException, forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { CreateCapituloDto } from './dto/create-capitulo.dto';
import { UpdateCapituloDto } from './dto/update-capitulo.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Capitulo } from './interfaces/capitulo.interfaces';
import { endOfDay, subHours } from 'date-fns';
import { HistoriasService } from 'src/historias/historias.service';
import { CapitulosVotadosService } from 'src/capitulos_votados/capitulos_votados.service';
import { ComentariosService } from 'src/comentarios/comentarios.service';
const mongoose = require("mongoose");

@Injectable()
export class CapitulosService {
  constructor(
    @InjectModel('Capitulo') private readonly capituloModel: Model<Capitulo>,
    @Inject(forwardRef(() => HistoriasService)) private readonly historiasService: HistoriasService,
    private readonly capitulosVotadosService: CapitulosVotadosService,
    private readonly comentariosService: ComentariosService,
  ) {}
  private readonly logger = new Logger(CapitulosService.name)

  async create(createCapituloDto: any, user?):Promise<any> {
    try {

      createCapituloDto.usuario = user._id

      let capitulo = await this.capituloModel.create(createCapituloDto)
      return capitulo
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async findAll(_id, titulo, historia, usuario, status, data, limit, page, user?) {
    try {

      let query = {}

      if(_id){
        query['_id'] = new mongoose.Types.ObjectId(_id)
      }

      if(titulo) {
        query['titulo'] =  { $regex: new RegExp(titulo), $options:'i' }
      }

      if(historia){
        query['historia'] = new mongoose.Types.ObjectId(historia)
      }

      if(status){
        query['status'] = new mongoose.Types.ObjectId(status)
      }

      if(usuario){
        query['usuario'] = new mongoose.Types.ObjectId(usuario)
      }

      if (data) {
        let dataRange = data.split(',')

        query['createdAt'] = {
          $gte: subHours(new Date(dataRange[0]), 3), 
          $lte: subHours(endOfDay(new Date(dataRange[1])), 3)
        }
      }

      return this.capituloModel.find(query)
      .populate([
        { path: 'historia' },
        { path: 'usuario' },
      ]).exec()
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async findOne(_id, usuario, user?) {
    try {
      const buscaCapitulo = await this.capituloModel.findById({_id})
      if(!buscaCapitulo){
          throw new BadRequestException(`Capítulo com o ID ${_id} não encontrado`)
      }

      let capitulo:any = await this.capituloModel.findById(_id)
      .populate([
        { path: 'historia' },
        { path: 'usuario' },
      ])

      let historia = await this.historiasService.findOne(capitulo.historia._id)
      let proximo_capitulo = null
      let votado = false

      if (historia.capitulos) {
        let next = historia.capitulos.findIndex((item) => item._id.equals(capitulo._id))
        if ((next + 1) == historia.capitulos.length) {
          proximo_capitulo = null
        } else {
          proximo_capitulo = historia.capitulos[next+1]._id
        }
      }

      if (usuario) {
        let voto = await this.capitulosVotadosService.findAll(null, usuario, capitulo._id)
        votado = voto.count > 0 ? true : false
      }

      let comentarios = await this.comentariosService.findAll(null, capitulo._id, null, null)

      capitulo = {
        ... capitulo._doc,
        proximo_capitulo: proximo_capitulo,
        comentarios: comentarios.comentarios,
        votado: votado
      }

      return capitulo
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async findCapitulosHistoria(historia, sort?, ordem?) {
    try {
      let capitulos = await this.capituloModel.find({
        historia: new mongoose.Types.ObjectId(historia)
      })
      .populate([
        { path: 'historia' },
        { path: 'usuario' },
      ]).exec()

      let totais = await this.capituloModel.aggregate([
        { 
          $match: {
            historia: new mongoose.Types.ObjectId(historia)
          } 
        },
        { 
          $group: { 
              _id: null,
              total_capitulos: { $sum: 1 },
              total_visualizacoes: { $sum: "$quantidade_visualizacao" },
              quantidade_comentarios: { $sum: "$quantidade_comentarios" },
              total_votos: { $sum: "$votacao" }
          },
        },
        {
          $project: {
            _id: 0,
            total_capitulos: { $ifNull: ["$total_capitulos", 0] },
            total_visualizacoes: { $ifNull: ["$total_visualizacoes", 0] },
            quantidade_comentarios: { $ifNull: ["$quantidade_comentarios", 0] },
            total_votos: { $ifNull: ["$total_votos", 0] }
          }
        }
      ])

      return {
        capitulos: capitulos,
        total_capitulos: totais.length > 0 ? (totais[0].total_capitulos ? totais[0].total_capitulos : 0) : 0,
        total_visualizacoes: totais.length > 0 ? (totais[0].total_visualizacoes ? totais[0].total_visualizacoes : 0) : 0,
        quantidade_comentarios: totais.length > 0 ? (totais[0].quantidade_comentarios ? totais[0].quantidade_comentarios : 0) : 0,
        total_votos: totais.length > 0 ? (totais[0].total_votos ? totais[0].total_votos : 0) : 0
      }

    } catch (error) {
      this.logger.error(error)
      return error
    }
  }
  
  async findHistoriasMaisVotadas(historias?) {
    try {
      let total_votos = []
      let quantidade_comentarios = []
      let total_visualizacoes = []
      let labels = []

      let totais = await this.capituloModel.aggregate([
        { 
          $match: {
            historia: { 
              $in: historias 
            }
          } 
        },
        {
          $group: {
            _id: "$historia",
            total_visualizacoes: { $sum: "$quantidade_visualizacao" },
            quantidade_comentarios: { $sum: "$quantidade_comentarios" },
            total_votos: { $sum: "$votacao" }
          }
        },
        {
          $project: {
            _id: "$_id",
            total_capitulos: { $ifNull: ["$total_capitulos", 0] },
            total_visualizacoes: { $ifNull: ["$total_visualizacoes", 0] },
            quantidade_comentarios: { $ifNull: ["$quantidade_comentarios", 0] },
            total_votos: { $ifNull: ["$total_votos", 0] }
          }
        },
        { 
          $lookup: { 
            from: "historias", 
            localField: "_id", 
            foreignField: "_id", 
            as: "historia" 
          } 
        },
        { 
          $unwind: { 
            path: "$historia" 
          } 
        },
        {
          $sort: {
            total_votos: -1
          }
        }
      ])

      for (let i = 0; i < totais.length; i++) {
        labels.push(totais[i].historia.titulo)
        total_votos.push(totais[i].total_votos)
        quantidade_comentarios.push(totais[i].quantidade_comentarios)
        total_visualizacoes.push(totais[i].total_visualizacoes)
      }

      return {
        labels: labels,
        total_votos: total_votos,
        quantidade_comentarios: quantidade_comentarios,
        total_visualizacoes: total_visualizacoes,
      }

    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async update(_id, updateCapituloDto:any, user?) {
    try {
      
      const buscaCapitulo = await this.capituloModel.findById({_id})
      if(!buscaCapitulo){
          throw new BadRequestException(`Capítulo com o ID ${_id} não encontrado`)
      }
      
      let capitulo = await this.capituloModel.findByIdAndUpdate(_id, updateCapituloDto, {new: true})
      return capitulo
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async visualizador(_id, updateCapituloDto:any, user?) {
    try {
      
      const buscaCapitulo = await this.capituloModel.findById({_id})
      if(!buscaCapitulo){
          throw new BadRequestException(`Capítulo com o ID ${_id} não encontrado`)
      }

      buscaCapitulo.quantidade_visualizacao += 1

      let capitulo = await this.capituloModel.findByIdAndUpdate(_id, buscaCapitulo, { new: true })
      return capitulo
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async votar(votado, capitulo, user?) {
    try {
      let cap = await this.capituloModel.findById(capitulo)

      if (cap) {
        if (!votado.votado) {
          await this.capitulosVotadosService.votar({ capitulo: capitulo }, user)
        }  else {
          await this.capitulosVotadosService.removeVoto(capitulo, user)
        }

        let vot = await this.capitulosVotadosService.findAll(null, null, cap._id, user)

        cap.votacao = vot.count
        return await this.update(cap._id, cap)
      }

    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async comentar(comentario, capitulo, user?) {
    try {
      let cap = await this.capituloModel.findById(capitulo)
      
      if (cap) {
        this.logger.log(`encontrou o capitulo`)
        let createComment = await this.comentariosService.comentar(comentario.comentario, capitulo, null, user)
        let comment = await this.comentariosService.findOne(createComment._id)
        this.logger.warn(`comentou: ${JSON.stringify(comment)}`)
        
        return comment
      }

    } catch (error) {
      this.logger.error(error)
      return error
    }
  }
  
  async responderComentario(comentario, capitulo, user?) {
    try {
      let cap = await this.capituloModel.findById(capitulo)
      
      if (cap) {
        this.logger.log(`encontrou o capitulo`)
        let createComment = await this.comentariosService.responderComentario(comentario.comentarioId, null, cap._id, comentario.comentario, user)
        let comment = await this.comentariosService.findOne(createComment._id)
        this.logger.warn(`respondeu: ${JSON.stringify(comment)}`)
        
        return comment
      }

    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async remove(_id, user?) {
    try {
      
      const buscaCapitulo = await this.capituloModel.findById({_id})
      if(!buscaCapitulo){
          throw new BadRequestException(`Capítulo com o ID ${_id} não encontrado`)
      }

      let capitulo = await this.capituloModel.findByIdAndDelete(_id)
      return capitulo
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }
}