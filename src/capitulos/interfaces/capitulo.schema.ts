const mongoose = require("mongoose")
import currentDate from 'src/commom/dateFormat'
const Schema = mongoose.Schema

export const CapitulosSchema  = new mongoose.Schema({
    titulo: {
        type: String,
        require: true
    },
    capitulo: {
        type: String,
        require: true
    },
    historia: {
        type: Schema.Types.ObjectId,
        ref: 'Historia'
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuarios'
    },
    quantidade_visualizacao: {
        type: Number,
        require: true
    },
    votacao: {
        type: Number,
        require: true
    },
    caminho_capa: {
        type: String,
        require: true
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
},{ timestamps: true, collection: 'capitulos'})