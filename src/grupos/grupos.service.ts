import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Grupo } from './interfaces/grupos.interfaces';

@Injectable()
export class GruposService {
  constructor(
    @InjectModel('Grupo') private readonly grupoModel: Model<Grupo>
  ) {}
  private readonly logger = new Logger(GruposService.name)

  async create(createGrupoDto:any):Promise<any> {
    try {
      let grupo = await this.grupoModel.create(createGrupoDto)
      return grupo
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async findAll() {
    try {
      return this.grupoModel.find()
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async findOne(_id) {
    try {
      let grupo = await this.grupoModel.findById(_id)
      return grupo
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async update(_id, updateGrupoDto:any) {
    try {
      let grupo = await this.grupoModel.findByIdAndUpdate(_id, updateGrupoDto, {new: true})
      return grupo
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async remove(_id) {
    try {
      let grupo = await this.grupoModel.findByIdAndDelete(_id)
      return grupo
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }
}
