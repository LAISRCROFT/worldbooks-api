import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Categoria } from './interfaces/categorias.interfaces';
import { Model } from 'mongoose';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectModel('Categoria') private readonly categoriaModel: Model<Categoria>
  ) {}
  private readonly logger = new Logger(CategoriasService.name)

  async create(createCategoriaDto:any):Promise<any> {
    try {
      let categoria = await this.categoriaModel.create(createCategoriaDto)
      return categoria
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async findAll(nome?) {
    try {
      let query = {}

      if (nome) {
        query['nome'] = { $regex: new RegExp(nome), $options:'i' }
      }

      return await this.categoriaModel.find(query).sort({ nome: 1 }).exec()
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async findOne(_id) {
    try {
      let categoria = await this.categoriaModel.findById(_id)
      return categoria
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async update(_id, updateCategoriaDto:any) {
    try {
      let categoria = await this.categoriaModel.findByIdAndUpdate(_id, updateCategoriaDto, {new: true})
      return categoria
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async remove(_id) {
    try {
      let categoria = await this.categoriaModel.findByIdAndDelete(_id)
      return categoria
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }
}
