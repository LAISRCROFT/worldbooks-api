const mongoose = require("mongoose")
const Schema = mongoose.Schema
import currentDate from 'src/commom/dateFormat'

export const NotificacoesSchema  = new mongoose.Schema({
    corpo: {
        type: String,
        require: false
    },
    remetente: {
        type: Schema.Types.ObjectId,
        ref: 'Usuarios'
    },
    destinatario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuarios'
    },
    tipo: {
        type: Schema.Types.ObjectId,
        ref: 'Tipo'
    },
    projeto: {
        type: Schema.Types.ObjectId,
        ref: 'Projeto'
    },
    historia: {
        type: Schema.Types.ObjectId,
        ref: 'Historia'
    },
    lido: {
        type: Boolean,
        require: false,
        default: false
    },
    createdAt: {
        type: Date,
        require: true,
        default: currentDate
    },
    updatedAt: {
        type: Date,
        require: true,
        default: currentDate
    }
},{ timestamps: true, collection: 'notificacoes'})