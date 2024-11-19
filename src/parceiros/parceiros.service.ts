import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateParceiroDto } from './dto/create-parceiro.dto';
import { UpdateParceiroDto } from './dto/update-parceiro.dto';
import { Parceiro } from './interfaces/parceiros.interfaces';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { endOfDay, subHours } from 'date-fns';
const mongoose = require("mongoose");

@Injectable()
export class ParceirosService {
  constructor(
    @InjectModel('Parceiro') private readonly parceiroModel: Model<Parceiro>,
  ) {}
  private readonly logger = new Logger(ParceirosService.name)

  async create(createParceiroDto:any):Promise<any> {
    try {
      let parceiro = await this.parceiroModel.create(createParceiroDto)
      return parceiro
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async findAll(_id, nome, status, data, limit, page) {
    try {
      let query = {}

      if(_id){
        query['_id'] = new mongoose.Types.ObjectId(_id)
      }

      if(nome) {
        query['nome'] =  { $regex: new RegExp(nome), $options:'i' }
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
      
      let parceiros = await this.parceiroModel.find(query)
      .populate([
        { path: 'status' },
      ])
      .limit(limit)
      .skip(page)
      .sort({ createdAt: -1 })
      .exec()
      
      let count = await this.parceiroModel.countDocuments(query)
      
      return {
        parceiros: parceiros,
        count: count 
      }

    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async findOne(_id) {
    try {
      
      const parceiroExistente = await this.parceiroModel.findOne({ _id: _id })
      if (!parceiroExistente) {
        throw new BadRequestException(`Parceiro não encontrado`)
      }
      
      return parceiroExistente
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async update(_id, updateParceiroDto:any) {
    try {
      let parceiro = await this.parceiroModel.findByIdAndUpdate(_id, updateParceiroDto, {new: true})
      return parceiro
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async remove(_id) {
    try {
      let parceiro = await this.parceiroModel.findByIdAndDelete(_id)
      return parceiro
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }
}
