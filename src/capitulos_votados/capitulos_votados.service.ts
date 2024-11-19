import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateCapitulosVotadoDto } from './dto/create-capitulos_votado.dto';
import { UpdateCapitulosVotadoDto } from './dto/update-capitulos_votado.dto';
import { InjectModel } from '@nestjs/mongoose';
import { CapituloVotado } from './interfaces/capitulos_votados.interfaces';
import { Model } from 'mongoose';
const mongoose = require("mongoose");

@Injectable()
export class CapitulosVotadosService {
  constructor(
    @InjectModel('CapituloVotado') private readonly capituloVotadoModel: Model<CapituloVotado>
  ) {}
  private readonly logger = new Logger(CapitulosVotadosService.name)

  async create(createCapituloVotadoDto:any, user?):Promise<any> {
    try {
      let voto = {
        usuario: new mongoose.Types.ObjectId(user._id),
        capitulo: new mongoose.Types.ObjectId(createCapituloVotadoDto.capitulo)
      }

      let capitulo_votado = await this.capituloVotadoModel.create(voto)
      return capitulo_votado
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async votar(capitulo, user?):Promise<any> {
    try {
      
      let vot = await this.findAll(null, user._id, capitulo.capitulo, user)
      if (vot.count > 0) {
        throw new BadRequestException(`O Usuário já votou neste capítulo!`)
      }

      let voto = {
        usuario: new mongoose.Types.ObjectId(user._id),
        capitulo: new mongoose.Types.ObjectId(capitulo.capitulo)
      }

      let capitulo_votado = await this.capituloVotadoModel.create(voto)
      return capitulo_votado
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async findAll(_id, usuario, capitulo, user?) {
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
      }

      let count = await this.capituloVotadoModel.countDocuments(query)
      let votos = await this.capituloVotadoModel.find(query)
      .populate([
        { path: 'usuario' },
        { path: 'capitulo' }, 
      ]).exec()

      return {
        votos: votos,
        count: count
      }
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async findOne(_id) {
    try {
      
      const buscaCapituloVotado:any = await this.capituloVotadoModel.findById({_id})
      if(!buscaCapituloVotado){
          throw new BadRequestException(`Votação com o ID ${_id} não encontrado`)
      }

      let capitulo_votado = await this.capituloVotadoModel.findById(_id)
      return capitulo_votado
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async update(_id, updateCapituloVotadoDto:any) {
    try {
      
      const buscaCapituloVotado:any = await this.capituloVotadoModel.findById({_id})
      if(!buscaCapituloVotado){
          throw new BadRequestException(`Votação com o ID ${_id} não encontrado`)
      }

      let capitulo_votado = await this.capituloVotadoModel.findByIdAndUpdate(_id, updateCapituloVotadoDto, {new: true})
      return capitulo_votado
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async removeVoto(capitulo, user?) {
    try {

      let buscaCapituloVotado:any = await this.capituloVotadoModel.findOne({
        capitulo: new mongoose.Types.ObjectId(capitulo),
        usuario: new mongoose.Types.ObjectId(user._id),
      })
      if(!buscaCapituloVotado){
          throw new BadRequestException(`Votação não encontrada`)
      }

      let capitulo_votado = await this.capituloVotadoModel.findByIdAndDelete(buscaCapituloVotado._id)
      return capitulo_votado
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async remove(_id) {
    try {

      const buscaCapituloVotado:any = await this.capituloVotadoModel.findById({_id})
      if(!buscaCapituloVotado){
          throw new BadRequestException(`Votação com o ID ${_id} não encontrado`)
      }

      let capitulo_votado = await this.capituloVotadoModel.findByIdAndDelete(_id)
      return capitulo_votado
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }
}
