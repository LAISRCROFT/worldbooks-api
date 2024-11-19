import { Injectable, Logger } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tag } from './interfaces/tags.interfaces';

@Injectable()
export class TagsService {
  constructor(
    @InjectModel('Tag') private readonly tagModel: Model<Tag>
  ) {}
  private readonly logger = new Logger(TagsService.name)

  async create(createTagDto:any):Promise<any> {
    try {
      createTagDto.nome = createTagDto.nome.charAt(0).toUpperCase() + createTagDto.nome.slice(1).toLowerCase();
      let tag = await this.tagModel.create(createTagDto)
      return tag
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async criarVariasTags(tags) {
    try {
      return await this.tagModel.insertMany(tags)
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async findTagPorNome(nome?) {
    try {
      let tag = await this.tagModel.findOne({
        nome: { $regex: new RegExp(`^${nome}$`), $options:'i' }
      })
      return tag
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async findAll(nome) {
    try {
      let query = {}

      if (nome) {
        query['nome'] = { $regex: new RegExp(nome), $options:'i' }
      }

      return await this.tagModel.find(query).exec()
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async findOne(_id) {
    try {
      let tag = await this.tagModel.findById(_id)
      return tag
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async update(_id, updateTagDto:any) {
    try {
      let tag = await this.tagModel.findByIdAndUpdate(_id, updateTagDto, {new: true})
      return tag
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async remove(_id) {
    try {
      let tag = await this.tagModel.findByIdAndDelete(_id)
      return tag
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }
}
