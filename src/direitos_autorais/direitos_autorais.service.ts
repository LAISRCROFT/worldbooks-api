import { Injectable, Logger } from '@nestjs/common';
import { CreateDireitoAutoralDto } from './dto/create-direito_autoral.dto';
import { UpdateDireitoAutoralDto } from './dto/update-direito_autoral.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DireitoAutoral } from './interfaces/diretos_autoriais.interfaces';

@Injectable()
export class DireitosAutoraisService {
  constructor(
    @InjectModel('DireitoAutoral') private readonly direitoAutoralModel: Model<DireitoAutoral>
  ) {}
  private readonly logger = new Logger(DireitosAutoraisService.name)

  async create(createDireitosAutoraisDto:any):Promise<any> {
    try {
      let direito_autoral = await this.direitoAutoralModel.create(createDireitosAutoraisDto)
      return direito_autoral
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async findAll() {
    try {
      return this.direitoAutoralModel.find()
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async findOne(_id) {
    try {
      let direito_autoral = await this.direitoAutoralModel.findById(_id)
      return direito_autoral
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async update(_id, updateDireitosAutoraisDto:any) {
    try {
      let direito_autoral = await this.direitoAutoralModel.findByIdAndUpdate(_id, updateDireitosAutoraisDto, {new: true})
      return direito_autoral
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async remove(_id) {
    try {
      let direito_autoral = await this.direitoAutoralModel.findByIdAndDelete(_id)
      return direito_autoral
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }
}
