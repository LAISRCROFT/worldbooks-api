import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tipo } from './interfaces/tipos.interfaces';
const mongoose = require("mongoose");

@Injectable()
export class TiposService {
  constructor(
    @InjectModel('Tipo') private readonly tipoModel: Model<Tipo>
  ) {}
  private readonly logger = new Logger(TiposService.name)

  async create(createTipoDto:any):Promise<any> {
    try {
      let tipo = await this.tipoModel.create(createTipoDto)
      return tipo
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async findAll(_id, nome, grupo, status, limit, page, user?) {
    try {
      let query = {                                         // deletado
        status: { $nin: [ new mongoose.Types.ObjectId('672010bdbbbbaf055fa525a0') ] }
      }
      
      if(_id){
        query['_id'] = new mongoose.Types.ObjectId(_id)
      }
      
      if(nome) {
        query['nome'] =  { $regex: new RegExp(nome), $options:'i' }
      }
      
      if(grupo){
        query['grupo'] = new mongoose.Types.ObjectId(grupo)
      }
      
      if(status){
        query['status'] = new mongoose.Types.ObjectId(status)
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

      let tipos = await this.tipoModel.find(query)
      .populate([
        { path: 'status' },
        { path: 'grupo' }
      ])
      .limit(limit)
      .skip(page)
      .sort({ nome: 1 })
      .exec()
      
      let count = await this.tipoModel.countDocuments(query)
      
      return {
        tipos: tipos,
        count: count 
      }

    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async findOne(_id) {
    try {
      let tipo = await this.tipoModel.findById(_id)
      return tipo
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async update(_id, updateTipoDto:any) {
    try {
      let tipo = await this.tipoModel.findByIdAndUpdate(_id, updateTipoDto, {new: true})
      return tipo
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async remove(_id) {
    try {
      let tipo = await this.tipoModel.findByIdAndDelete(_id)
      return tipo
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }
}
