import { BadRequestException, forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Usuario } from './interfaces/usuarios.interfaces';

import * as bcrypt from 'bcrypt'
import { endOfDay, subHours } from 'date-fns';
import { isArray } from 'class-validator';
import { ProjetosService } from 'src/projetos/projetos.service';
import { NotificacoesService } from 'src/notificacoes/notificacoes.service';
const mongoose = require("mongoose")

@Injectable()
export class UsuariosService {
  constructor(
      @InjectModel('Usuarios') private readonly usuariosModel: Model<Usuario>,
      @Inject(forwardRef(() => ProjetosService)) private readonly projetosService: ProjetosService,
      @Inject(forwardRef(() => NotificacoesService)) private readonly notificacoesService: NotificacoesService,
  ) {}
  private readonly logger = new Logger(UsuariosService.name)

  async login() {

  } 
  
  async create(createUsuariosDto:any):Promise<any>{
    if (!createUsuariosDto.name) throw new BadRequestException(`Insira o usuário!`)
    if (!createUsuariosDto.email) throw new BadRequestException(`Insira o e-mail!`)
    if (!createUsuariosDto.password) throw new BadRequestException(`Insira a senha!`)
    if (!createUsuariosDto.apelido) throw new BadRequestException(`Insira o apelido!`)
    if (!createUsuariosDto.data_nascimento) throw new BadRequestException(`Insira a data de nascimento!`)
    try {
      const saltOrRounds = 10
      const hash = await bcrypt.hash(createUsuariosDto.password, saltOrRounds)
      createUsuariosDto.password = hash
      this.logger.log(createUsuariosDto)
  
      createUsuariosDto.status = new mongoose.Types.ObjectId("67185fb005706df8e09bf339")
      createUsuariosDto.tipo = new mongoose.Types.ObjectId("671947ef39d9b6b7a03407ef")
      let user = await this.usuariosModel.create(createUsuariosDto)
      return user
    } catch (error) {
      return this.logger.error(error)
    }
  }
  
  async findAll(_id, name, email, tipo, projeto, status, data, limit, page, user?) {
    try {
      
      let query = {}
      
      if(_id){
        query['_id'] = new mongoose.Types.ObjectId(_id)
      }
      
      if(name) {
        query['name'] =  { $regex: new RegExp(name), $options:'i' }
      }
      
      if(email) {
        query['email'] =  { $regex: new RegExp(email), $options:'i' }
      }
      
      if (data) {
        let dataRange = data.split(',')

        query['createdAt'] = {
          $gte: subHours(new Date(dataRange[0]), 3), 
          $lte: subHours(endOfDay(new Date(dataRange[1])), 3)
        }
      }
      
      if(tipo){
        query['tipo'] = new mongoose.Types.ObjectId(tipo)
      }
      
      if(projeto){
        let projetos = isArray(projeto) ? new mongoose.Types.ObjectId(projeto) : [new mongoose.Types.ObjectId(projeto)]
        query['projetos'] = { $in: projetos }
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

      let usuarios = await this.usuariosModel.find(query)
      .populate([
        { path: 'tipo' },
        { path: 'projetos' },
        { path: 'status' },
      ])
      .select('-password')
      .limit(limit)
      .skip(page)
      .exec()

      let count = await this.usuariosModel.countDocuments(query)

      return {
        usuarios: usuarios,
        count: count
      }

    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async findOne(_id) {
    try {
      const usuario = await this.usuariosModel.findById(_id)
      .populate([
        { path: 'status' },
        { path: 'tipo' },
        { path: 'projetos' },
      ])
      .select('-password')
      .exec()

      if (!usuario) {
        throw new BadRequestException(`Usuário não encontrado`)
      }
      return usuario
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async update(_id, updateUsuarioDto:any) {
    try {
      if (!updateUsuarioDto.name) throw new BadRequestException(`Insira o usuário!`)
      if (!updateUsuarioDto.email) throw new BadRequestException(`Insira o e-mail!`)
      if (!updateUsuarioDto.apelido) throw new BadRequestException(`Insira o apelido!`)

      const usuarioExistente = await this.usuariosModel.findOne({ _id: _id })
      if (!usuarioExistente) {
        throw new BadRequestException(`Usuário não encontrado`)
      }

      let usuario = await this.usuariosModel.findByIdAndUpdate(_id, updateUsuarioDto, { new: true })
      .populate([
        { path: 'tipo' },
        { path: 'projetos' },
        { path: 'status' },
      ]).exec()
      return usuario
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async remove(_id) {
      const usuarioExistente = await this.usuariosModel.findById(_id)

      if (!usuarioExistente) {
        throw new BadRequestException(`Usuário não encontrado`)
      }

      try {
        let usuario = await this.usuariosModel.findByIdAndDelete(_id)
        return usuario
      } catch (error) {
        console.log(`error: ${error}`)
        throw new BadRequestException(`Aconteceu algum erro: ${error}`)
      }
  }

  async consultarUserEmail(email):Promise<Usuario>{ 
    try {
      const useremail = await this.usuariosModel.findOne({email})
      .populate([
        { path: 'status' },
        { path: 'tipo' },
        { path: 'projetos' },
      ])
      .exec()

      if(!useremail){
          throw new BadRequestException(`E-mail não localizado`)
      }
      
      return useremail
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async incluirProjeto(usuarioId, projetoId) {
    try {
      const usuarioExistente:any = await this.usuariosModel.findOne({ _id: usuarioId })
      if (!usuarioExistente) {
        throw new BadRequestException(`Usuário não encontrado`)
      }

      if (usuarioExistente.projetos.length > 0) {
        let existe = await usuarioExistente.projetos.findIndex((item) => item.equals(projetoId))
        if (existe === -1) {
          usuarioExistente.projetos.push(projetoId)
          return await this.update(usuarioExistente._id, usuarioExistente)
        } else {
          return {
            message: `o projeto já existe nesse usuário`,
            code: 1,
          }
        }
      } else {
        usuarioExistente.projetos.push(projetoId)
        return await this.update(usuarioExistente._id, usuarioExistente)
      }
    } catch (error) {
      this.logger.error(error)
    }
  }
}