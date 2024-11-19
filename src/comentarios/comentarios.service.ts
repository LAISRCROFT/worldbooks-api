import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comentario } from './interfaces/comentarios.interfaces';
import { Model, mongo } from 'mongoose';
const mongoose = require("mongoose");

@Injectable()
export class ComentariosService {
  constructor(
    @InjectModel('Comentario') private readonly comentarioModel: Model<Comentario>
  ) {}
  private readonly logger = new Logger(ComentariosService.name)

  async create(createComentarioDto:any):Promise<any> {
    try {
      let comentario = await this.comentarioModel.create(createComentarioDto)
      return comentario
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async comentar(comentario, capitulo, projeto, user?) {
    try {

      let comment = {
        usuario: new mongoose.Types.ObjectId(user._id),
        comentario: comentario
      }

      if (capitulo) {
        comment['capitulo'] = new mongoose.Types.ObjectId(capitulo)
        comment['tipo'] = new mongoose.Types.ObjectId('6733ffe9a0bc579d3e59b012')
      }

      if (projeto) {
        comment['projeto'] = new mongoose.Types.ObjectId(projeto)
        comment['tipo'] = new mongoose.Types.ObjectId('6733fff0a0bc579d3e59b014')
      }

      let capitulo_comentado = await this.comentarioModel.create(comment)
      return capitulo_comentado
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async responderComentario(comentarioId, projetoId, capituloId, comentario, user?) {
    try {

      const comentarioExistente:any = await this.comentarioModel.findOne({ _id: comentarioId })
      if (!comentarioExistente) {
        throw new BadRequestException(`Comentário não encontrado`)
      }

      let createRespostaDto = {
        tipo: new mongoose.Types.ObjectId('673628b30f02049e8e8025ac'), // tipo resposta
        usuario: new mongoose.Types.ObjectId(user._id),
        comentario: comentario
      }

      if (projetoId) {
        createRespostaDto['projeto'] = new mongoose.Types.ObjectId(projetoId)
      }

      if (capituloId) {
        createRespostaDto['capitulo'] = new mongoose.Types.ObjectId(capituloId)
      }

      let createResposta = await this.create(createRespostaDto)

      comentarioExistente.respostas.push(createResposta)
      return await this.update(comentarioExistente._id, comentarioExistente)

    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async findAll(_id, capitulo, projeto, usuario, user?) {
    try {
      
      let query = {}
      
      if(_id){
        query['_id'] = new mongoose.Types.ObjectId(_id)
      }
      
      if(usuario){
        query['usuario'] = new mongoose.Types.ObjectId(usuario)
      }
      
      if(capitulo){
        query['capitulo'] = new mongoose.Types.ObjectId(capitulo)
        query['tipo'] = new mongoose.Types.ObjectId('6733ffe9a0bc579d3e59b012')
      }
      
      if (projeto) {
        query['projeto'] = new mongoose.Types.ObjectId(projeto)
        query['tipo'] = new mongoose.Types.ObjectId('6733fff0a0bc579d3e59b014')
      }

      console.log(query)

      let count = await this.comentarioModel.countDocuments(query)
      let comentarios = await this.comentarioModel.find(query)
      .populate([
        { path: 'usuario' },
        { path: 'capitulo' }, 
        { path: 'projeto' },
        { path: 'respostas',
          populate: [
            { path: 'projeto' },
            { path: 'usuario' },
            { path: 'capitulo' },
            { path: 'respostas' },
        ]}, 
      ])
      .sort({ createdAt: -1 })
      .exec()

      return {
        comentarios: comentarios,
        count: count
      }

    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async findOne(_id) {
    try {
      let comentario = await this.comentarioModel.findById(_id)
      .populate([
        { path: 'usuario' },
        { path: 'capitulo' }, 
        { path: 'projeto' },
        { path: 'respostas',
          populate: [
            { path: 'projeto' },
            { path: 'usuario' },
            { path: 'capitulo' },
            { path: 'respostas' },
        ]}, 
      ]).exec()
      return comentario
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async update(_id, updateComentarioDto:any) {
    try {
      
      const comentarioExistente:any = await this.comentarioModel.findOne({ _id: _id })
      if (!comentarioExistente) {
        throw new BadRequestException(`Comentário não encontrado`)
      }

      let comentario = await this.comentarioModel.findByIdAndUpdate(_id, updateComentarioDto, {new: true})
      return comentario
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async remove(_id) {
    try {
      let comentario = await this.comentarioModel.findByIdAndDelete(_id)
      return comentario
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }
}