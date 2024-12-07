import { BadRequestException, forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Historia } from './interfaces/historia.interfaces';
import { Model, mongo } from 'mongoose';
import { endOfDay, subHours, format } from 'date-fns';
import { CapitulosService } from 'src/capitulos/capitulos.service';
import { TagsService } from 'src/tags/tags.service';
import { CategoriasService } from 'src/categorias/categorias.service';
import { ProjetosService } from 'src/projetos/projetos.service';
const mongoose = require("mongoose");

@Injectable()
export class HistoriasService {
  constructor(
    @InjectModel('Historia') private readonly historiaModel: Model<Historia>,
    @Inject(forwardRef(() => CapitulosService)) private readonly capitulosService: CapitulosService,
    @Inject(forwardRef(() => ProjetosService)) private readonly projetosService: ProjetosService,
    private readonly tagsService: TagsService,
    private readonly categoriasService: CategoriasService
  ) {}
  private readonly logger = new Logger(HistoriasService.name)

  async create(createHistoriaDto:any):Promise<any> {
    try {
      let historia = await this.historiaModel.create(createHistoriaDto)
      return historia
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async createHistoriaRascunho(createHistoriaDto: any, user?):Promise<any>  {
    try {
      createHistoriaDto.status = new mongoose.Types.ObjectId('671fc5a6a07ab0ed19f26dd1')
      createHistoriaDto.usuario = new mongoose.Types.ObjectId(user._id)
      let historia = await this.historiaModel.create(createHistoriaDto)
      return historia
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async createHistoria(_id, updateHistoriaDto:any, user?):Promise<any> {
    try {

      updateHistoriaDto.status = new mongoose.Types.ObjectId('671fc599a07ab0ed19f26dcd')

      const buscaHistoria = await this.historiaModel.findById({_id})
      if(!buscaHistoria){
          throw new BadRequestException(`História com o ID ${_id} não encontrado`)
      }

      let tags = []
      if (updateHistoriaDto.tags) {
        for (let i = 0; i < updateHistoriaDto.tags.length; i++) {
          
          let tag = updateHistoriaDto.tags[i].replace(/^\s+|\s+$/g, "")

          let tagNome = await this.tagsService.findTagPorNome(tag)
          if (!tagNome) { 
            let criarTag = await this.tagsService.create({ nome: tag })
            tags.push(criarTag._id)
          } else {
            tags.push(tagNome._id)
          }
        }
        updateHistoriaDto.tags = tags
      }

      let historia = await this.historiaModel.findByIdAndUpdate(_id, updateHistoriaDto, {new: true})
      return historia
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async findAll(_id, categoria, titulo, publico_alvo, idioma, direitos_autorais, conteudo_adulto, usuario, historia_finalizada, projeto, data, mode, pesquisa, limit, page, user?, sort?, ordem?) {
    try {
      let query = {                                         // deletado
        status: { $nin: [ new mongoose.Types.ObjectId('672010bdbbbbaf055fa525a0') ] }
      }

      if(_id){
        query['_id'] = new mongoose.Types.ObjectId(_id)
      }

      if(titulo) {
        query['titulo'] =  { $regex: new RegExp(titulo), $options:'i' }
      }

      if(categoria){
        query['categoria'] = new mongoose.Types.ObjectId(categoria)
      }

      if(publico_alvo){
        query['publico_alvo'] = new mongoose.Types.ObjectId(publico_alvo)
      }

      if(idioma){
        query['idioma'] = new mongoose.Types.ObjectId(idioma)
      }

      if(direitos_autorais){
        query['direitos_autorais'] = new mongoose.Types.ObjectId(direitos_autorais)
      }

      if(usuario){
        query['usuario'] = new mongoose.Types.ObjectId(usuario)
      }
      
      if(conteudo_adulto) {
        query['conteudo_adulto'] =  conteudo_adulto
      }
      
      if(historia_finalizada) {
        query['historia_finalizada'] =  historia_finalizada
      }

      if (projeto) {
        query['projetos'] = { $in: projeto }
      }

      if (data) {
        let dataRange = data.split(',')

        query['createdAt'] = {
          $gte: subHours(new Date(dataRange[0]), 3), 
          $lte: subHours(endOfDay(new Date(dataRange[1])), 3)
        }
      }

      if (user != usuario) {
        query.status = {
          $nin: [
            new mongoose.Types.ObjectId('672010bdbbbbaf055fa525a0'),
            new mongoose.Types.ObjectId('671fc5a6a07ab0ed19f26dd1'),
          ]
        }
      }

      if (mode) {
        query.status = { 
          $nin: [ 
            new mongoose.Types.ObjectId('672010bdbbbbaf055fa525a0'),
            new mongoose.Types.ObjectId('671fc5a6a07ab0ed19f26dd1'),
          ] 
        }
      }

      if (pesquisa) {

        let buscaTags = await this.tagsService.findAll(pesquisa)
        let tags = await buscaTags.map((item) => item._id)

        let buscaCategorias = await this.categoriasService.findAll(pesquisa)
        let categorias = await buscaCategorias.map((item) => item._id)

        query['$or'] = [
          { titulo: { $regex: new RegExp(pesquisa), $options:'i' } },
          { tags: { $in: tags } },
          { categoria: { $in: categorias } },
        ]

        query.status = { 
          $nin: [ 
            new mongoose.Types.ObjectId('672010bdbbbbaf055fa525a0'),
            new mongoose.Types.ObjectId('671fc5a6a07ab0ed19f26dd1'),
          ] 
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

      if (sort) {
        sort = { [`${sort}`]: ordem ? Number(ordem) : 1 }
      } else {
        sort = { createdAt: -1 }
      }

      console.log(query)

      let historias:any = await this.historiaModel.find(query)
      .populate([
        { path: 'usuario' },
        { path: 'categoria' },
        { path: 'publico_alvo' },
        { path: 'direitos_autorais' },
        { path: 'idioma' },
        { path: 'status' },
        { path: 'tags' },
      ])
      .limit(limit)
      .skip(page)
      .sort(sort)
      .exec()

      let count = await this.historiaModel.countDocuments(query)

      for (let i = 0; i < historias.length; i++) {
        let capitulos = await this.capitulosService.findCapitulosHistoria(historias[i]._id)
        historias[i] = {
          ... historias[i]._doc,
          ... capitulos
        }
      }

      historias.sort((a, b) => b.total_visualizacoes - a.total_visualizacoes)

      return {
        historias: historias,
        count: count 
      }

    } catch (error) {
      this.logger.error(error)
      return error
    }
  }
  
  async incluirProjeto(historiaId, projetoId) {
    try {

      const historiaExistente:any = await this.historiaModel.findOne({ _id: historiaId })
      if (!historiaExistente) {
        throw new BadRequestException(`Usuário não encontrado`)
      }

      if (historiaExistente.projetos.length > 0) {
        let existe = await historiaExistente.projetos.findIndex((item) => item.equals(projetoId))
        if (existe === -1) {
          historiaExistente.projetos.push(projetoId)
          return await this.update(historiaExistente._id, historiaExistente)
        } else {
          this.logger.warn(`O projeto ${projetoId} já existe nessa história ${historiaId}`)
          return {
            message: `o projeto já existe nessa historia`,
            code: 1,
          }
        }
      } else {
        historiaExistente.projetos.push(projetoId)
        return await this.update(historiaExistente._id, historiaExistente)
      }

    } catch (error) {
      this.logger.error(error)
    }
  }

  async historiaMaisVotadas(projetoId) {
    try {
      
      let historias = await this.historiaModel.find({
        projetos: projetoId
      })

      let historiasId = historias.map((item) => item._id)

      let historiasMaisVotadas = await this.capitulosService.findHistoriasMaisVotadas(historiasId)

      return historiasMaisVotadas
      
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async findOne(_id) {
    try {
      const historia:any = await this.historiaModel.findById({_id})
      .populate([
        { path: 'usuario' },
        { path: 'categoria' },
        { path: 'publico_alvo' },
        { path: 'direitos_autorais' },
        { path: 'idioma' },
        { path: 'status' },
        { path: 'tags' },
      ]).exec()
      if(!historia){
          throw new BadRequestException(`História com o ID ${_id} não encontrado`)
      }

      let capitulos = await this.capitulosService.findCapitulosHistoria(_id)

      let history = {
        ... historia._doc,
        ... capitulos
      }

      console.log(history._id)

      return history
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async update(_id, updateHistoriaDto:any) {
    try {
      
      const historiaExistente = await this.historiaModel.findById({_id})
      if(!historiaExistente){
          throw new BadRequestException(`História com o ID ${_id} não encontrado`)
      }

      let historia = await this.historiaModel.findByIdAndUpdate(_id, updateHistoriaDto, {new: true})
      return historia
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async removerHistoriaDoProjeto(historiaId, projetoId) {
    try {
      
      const historiaExistente:any = await this.historiaModel.findById(historiaId)
      if(!historiaExistente){
          throw new BadRequestException(`História com o ID ${historiaId} não encontrado`)
      }
      
      let index = await historiaExistente.projetos.findIndex((item) => new mongoose.Types.ObjectId(projetoId).equals(item))
      historiaExistente.projetos.splice(index, 1)

      let historia = await this.historiaModel.findByIdAndUpdate(historiaId, historiaExistente, { new: true })
      return historia
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async remove(_id) {
    try {
      const buscaHistoria:any = await this.historiaModel.findById({_id})
      if(!buscaHistoria){
        throw new BadRequestException(`História com o ID ${_id} não encontrado`)
      }
                                                                  // rascunho
      if (buscaHistoria.status.equals(new mongoose.Types.ObjectId('671fc5a6a07ab0ed19f26dd1'))) {
        return await this.historiaModel.findByIdAndDelete(_id)
      }
                                                                // deletado
      buscaHistoria.status = new mongoose.Types.ObjectId('672010bdbbbbaf055fa525a0')

      let historia = await this.historiaModel.findByIdAndUpdate(_id, buscaHistoria, {new: true})
      return historia
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }
}
