const mongoose = require("mongoose")
const Schema = mongoose.Schema
import currentDate from 'src/commom/dateFormat'

export const ProjetosSchema  = new mongoose.Schema({
    nome: {
        type: String,
        require: true
    },
    sobre: {
        type: String,
        require: true
    },
    capa: {
        type: String,
        require: true
    },
    numero_participantes: {
        type: Number,
        require: true
    },
    numero_min_participantes: {
        type: Number,
        require: false,
        default: 3
    },
    numero_max_participantes: {
        type: Number,
        require: false,
        default: 30
    },
    tipo: {
        type: Schema.Types.ObjectId,
        ref: 'Tipo'
    },
    ranking: [{
        colocacao: {
            type: Number,
            require: false
        },
        historia: {
            type: Schema.Types.ObjectId,
            ref: 'Historia',
            require: false
        },
        total_votos: {
            type: Number,
            require: false
        },
    }],
    aberto_publico: {
        type: Boolean,
        require: true,
        default: true
    },
    parceiro: {
        type: Schema.Types.ObjectId,
        ref: 'Usuarios'
    },
    gestor: {
        type: Schema.Types.ObjectId,
        ref: 'Usuarios'
    },
    status: {
        type: Schema.Types.ObjectId,
        ref: 'Status'
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
},{ timestamps: true, collection: 'projetos'})