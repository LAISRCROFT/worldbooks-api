import { Injectable, Logger } from '@nestjs/common';
import { CreatePublicoAlvoDto } from './dto/create-publico_alvo.dto';
import { UpdatePublicoAlvoDto } from './dto/update-publico_alvo.dto';
import { InjectModel } from '@nestjs/mongoose';
import { PublicoAlvo } from './interfaces/publicos_alvos.interfaces';
import { Model } from 'mongoose';

@Injectable()
export class PublicosAlvoService {
  constructor(
    @InjectModel('PublicoAlvo') private readonly publicoAlvoModel: Model<PublicoAlvo>
  ) {}
  private readonly logger = new Logger(PublicosAlvoService.name)

  async create(createPublicoAlvoDto:any):Promise<any> {
    try {
      let publico_alvo = await this.publicoAlvoModel.create(createPublicoAlvoDto)
      return publico_alvo
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async findAll() {
    try {
      return this.publicoAlvoModel.find()
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async findOne(_id) {
    try {
      let publico_alvo = await this.publicoAlvoModel.findById(_id)
      return publico_alvo
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async update(_id, updatePublicoAlvoDto:any) {
    try {
      let publico_alvo = await this.publicoAlvoModel.findByIdAndUpdate(_id, updatePublicoAlvoDto, {new: true})
      return publico_alvo
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async remove(_id) {
    try {
      let publico_alvo = await this.publicoAlvoModel.findByIdAndDelete(_id)
      return publico_alvo
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }
}
