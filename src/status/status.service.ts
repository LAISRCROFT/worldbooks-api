import { Inject, Injectable, Logger, BadRequestException } from '@nestjs/common';
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { Status } from './interfaces/status.interfaces';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class StatusService {
  constructor(
      @InjectModel('Status') private readonly statusModel: Model<Status>
  ) {}
  private readonly logger = new Logger(StatusService.name)

  async create(createStatusDto:any):Promise<any> {
    try {
      let status = await this.statusModel.create(createStatusDto)
      return status
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async findAll() {
    try {
      return this.statusModel.find()
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async findOne(_id) {
    try {
      let status = await this.statusModel.findById(_id)
      return status
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async update(_id, updateStatusDto:any) {
    try {
      let status = await this.statusModel.findByIdAndUpdate(_id, updateStatusDto, {new: true})
      return status
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async remove(_id) {
    try {
      let status = await this.statusModel.findByIdAndDelete(_id)
      return status
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }
}
