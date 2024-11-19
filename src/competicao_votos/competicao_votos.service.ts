import { BadRequestException, forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { CreateCompeticaoVotoDto } from './dto/create-competicao_voto.dto';
import { UpdateCompeticaoVotoDto } from './dto/update-competicao_voto.dto';
import { CompeticaoVoto } from './interfaces/competicao_votos.interfaces';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { endOfDay, subHours } from 'date-fns';
import { HistoriasService } from 'src/historias/historias.service';
import { ProjetosService } from 'src/projetos/projetos.service';
const mongoose = require("mongoose");

@Injectable()
export class CompeticaoVotosService {
  constructor(
    @InjectModel('CompeticaoVoto') private readonly competicaoVotoModel: Model<CompeticaoVoto>,
    @Inject(forwardRef(() => ProjetosService)) private readonly projetosService: ProjetosService,
    private readonly historiasService: HistoriasService,
  ) {}
  private readonly logger = new Logger(CompeticaoVotosService.name)

  async create(createCompeticaoVotoDto:any, user?):Promise<any> {
    try {

      createCompeticaoVotoDto.usuario = user._id

      let projeto = await this.projetosService.findOne(createCompeticaoVotoDto.projeto)
      if (!projeto.status._id.equals(new mongoose.Types.ObjectId('672462b7d7ee7f7570218e71'))) { // fase de votações
        return {
          code: 3,
          message: `O projeto ${projeto.nome} não está em fase de votações`
        }
      }

      let usuarioExiste:any = await this.competicaoVotoModel.findOne({ 
        usuario: new mongoose.Types.ObjectId(createCompeticaoVotoDto.usuario),
        projeto: new mongoose.Types.ObjectId(createCompeticaoVotoDto.projeto),
      }).populate([
        { path: 'usuario' },
        { path: 'historia_votada' },
        { path: 'projeto' },
      ]).exec()

      if (usuarioExiste) {
        this.logger.warn(`O usuário ${usuarioExiste?.usuario?.name} já votou nesse projeto`)
        return {
          message: `O usuário ${usuarioExiste?.usuario?.name} já votou nesse projeto`,
          code: 2
        }
      }

      this.logger.log(`usuario ${user._id} votou em ${createCompeticaoVotoDto?.historia_votada} do projeto ${createCompeticaoVotoDto?.projeto}`)

      let competicao_voto = await this.competicaoVotoModel.create(createCompeticaoVotoDto)
      return competicao_voto
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async findAll(_id, historia_votada, usuario, projeto, data, page?, limit?, user?) {
    try {
      let query = {}

      if(_id){
        query['_id'] = new mongoose.Types.ObjectId(_id)
      }

      if(historia_votada){
        query['historia_votada'] = new mongoose.Types.ObjectId(historia_votada)
      }

      if(usuario){
        query['usuario'] = new mongoose.Types.ObjectId(usuario)
      }
      
      if(projeto) {
        query['projeto'] =  projeto
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

      let competicao_votos:any = await this.competicaoVotoModel.find(query)
      .populate([
        { path: 'usuario' },
        { path: 'historia_votada' },
        { path: 'projeto' },
      ])
      .limit(limit)
      .skip(page)
      .sort({ createdAt: -1 })
      .exec()

      let count = await this.competicaoVotoModel.countDocuments(query)

      return {
        competicao_votos: competicao_votos,
        count: count 
      }

    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async findOne(_id) {
    try {
      const competicao_voto:any = await this.competicaoVotoModel.findById({_id})
      .populate([
        { path: 'usuario' },
        { path: 'historia_votada' },
        { path: 'projeto' },
      ]).exec()
      if(!competicao_voto){
          throw new BadRequestException(`História com o ID ${_id} não encontrado`)
      }

      return competicao_voto
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async findHistoriasMaisVotadasDeUmProjeto(historias, projeto, usuario) {
    try {
      let total_votos = []
      let labels = []
      let legends = []
      let ids = []

      let votos = await this.competicaoVotoModel.aggregate([
        {
          $match: {
            projeto: new mongoose.Types.ObjectId(projeto)
          }
        },
        {
          $group: {
            _id: "$historia_votada",
            total: { $sum: 1 }
          }
        },
        { 
          $lookup: { 
            from: "historias", 
            localField: "_id", 
            foreignField: "_id", 
            as: "historia" 
          } 
        },
        { 
          $unwind: { 
            path: "$historia" 
          } 
        },
        {
          $sort: {
            total: -1
          }
        }
      ])

      let buscaHistorias = await this.historiasService.findAll(null, null, null, null, null, null, null, null, null, projeto, null, null, null, null, null)
      
      for (let i = 0; i < votos.length; i++) {
        total_votos.push(votos[i]?.total)
        labels.push(votos[i]?.historia?.titulo)
        legends.push(votos[i]?.historia?.titulo.slice(0, 10))
        ids.push(String(votos[i]?.historia?._id))
      }

      for (let i = 0; i < buscaHistorias.historias.length; i++) {
        if (!ids.includes(String(buscaHistorias.historias[i]._id))) {
          total_votos.push(0)
          labels.push(buscaHistorias.historias[i]?.titulo)
          legends.push(buscaHistorias.historias[i]?.titulo.slice(0, 10))
          ids.push(String(buscaHistorias.historias[i]._id))
        }
      }
      
      return {
        labels: labels,
        legends: legends,
        total_votos: total_votos,
        ids: ids
      }
      
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async update(_id, updateCompeticaoVotoDto:any) {
    try {
      
      const search = await this.competicaoVotoModel.findById({_id})
      if(!search){
          throw new BadRequestException(`História com o ID ${_id} não encontrado`)
      }

      let competicao_voto = await this.competicaoVotoModel.findByIdAndUpdate(_id, updateCompeticaoVotoDto, {new: true})
      return competicao_voto
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async remove(_id) {
    try {

      const buscaCompeticaoVoto:any = await this.competicaoVotoModel.findById({_id})
      if(!buscaCompeticaoVoto){
          throw new BadRequestException(`História com o ID ${_id} não encontrado`)
      }
      return await this.competicaoVotoModel.findByIdAndDelete(_id)

    } catch (error) {
      this.logger.error(error)
      return error
    }
  }
}
