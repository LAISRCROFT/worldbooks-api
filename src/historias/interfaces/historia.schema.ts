const mongoose = require("mongoose")
import currentDate from 'src/commom/dateFormat'
const Schema = mongoose.Schema

export const HistoriasSchema  = new mongoose.Schema({
    titulo: {
        type: String,
        require: true
    },
    descricao: {
        type: String,
        require: true
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria'
    },
    publico_alvo: {
        type: Schema.Types.ObjectId,
        ref: 'PublicoAlvo'
    },
    idioma: {
        type: Schema.Types.ObjectId,
        ref: 'Idioma'
    },
    direitos_autorais: {
        type: Schema.Types.ObjectId,
        ref: 'DireitoAutoral'
    },
    tags: [{
        type: Schema.Types.ObjectId,
        ref: 'Tag'
    }],
    conteudo_adulto: {
        type: Boolean,
        require: true
    },
    caminho_capa: {
        type: String,
        require: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuarios'
    },
    status: {
        type: Schema.Types.ObjectId,
        ref: 'Status'
    },
    projetos: [{
        type: Schema.Types.ObjectId,
        ref: 'Projeto'
    }],
    historia_finalizada: {
        type: Boolean,
        require: true
    },
    createdAt:{
        type: Date,
        require: true,
        default: currentDate
    },
    updatedAt:{
        type: Date,
        require: true,
        default: currentDate
    }
},{ timestamps: true, collection: 'historias'})