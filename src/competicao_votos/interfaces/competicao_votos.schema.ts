const mongoose = require("mongoose")
import currentDate from 'src/commom/dateFormat'
const Schema = mongoose.Schema

export const CompeticaoVotosSchema  = new mongoose.Schema({
    historia_votada: {
        type: Schema.Types.ObjectId,
        ref: 'Historia'
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuarios'
    },
    projeto: {
        type: Schema.Types.ObjectId,
        ref: 'Projeto'
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
},{ timestamps: true, collection: 'competicao_votos'})