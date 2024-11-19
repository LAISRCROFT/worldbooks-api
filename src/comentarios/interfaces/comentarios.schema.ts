const mongoose = require("mongoose")
const Schema = mongoose.Schema
import currentDate from 'src/commom/dateFormat'

export const ComentariosSchema  = new mongoose.Schema({
    comentario: {
        type: String,
        require: true
    },
    capitulo: {
        type: Schema.Types.ObjectId,
        ref: 'Capitulo',
        require: false
    },
    projeto: {
        type: Schema.Types.ObjectId,
        ref: 'Projeto',
        require: false
    },
    tipo: {
        type: Schema.Types.ObjectId,
        ref: 'Tipo'
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuarios'
    },
    respostas: [{
        type: Schema.Types.ObjectId,
        ref: 'Comentario'
    }],
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
},{ timestamps: true, collection: 'comentarios'})