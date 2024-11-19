import { Injectable, Logger } from '@nestjs/common';
import { CreateIdiomaDto } from './dto/create-idioma.dto';
import { UpdateIdiomaDto } from './dto/update-idioma.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Idioma } from './interfaces/idiomas.interfaces';
import { Model } from 'mongoose';

@Injectable()
export class IdiomasService {
  constructor(
    @InjectModel('Idioma') private readonly idiomaModel: Model<Idioma>
  ) {}
  private readonly logger = new Logger(IdiomasService.name)

  async create(createIdiomaDto:any):Promise<any> {
    try {
      let idioma = await this.idiomaModel.create(createIdiomaDto)
      return idioma
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async findAll() {
    try {
      return this.idiomaModel.find()
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async findOne(_id) {
    try {
      let idioma = await this.idiomaModel.findById(_id)
      return idioma
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async update(_id, updateIdiomaDto:any) {
    try {
      let idioma = await this.idiomaModel.findByIdAndUpdate(_id, updateIdiomaDto, {new: true})
      return idioma
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async remove(_id) {
    try {
      let idioma = await this.idiomaModel.findByIdAndDelete(_id)
      return idioma
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }
}
