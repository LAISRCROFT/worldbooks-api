import currentDate from "src/commom/dateFormat"

const mongoose = require("mongoose")
const Schema = mongoose.Schema

export const CapitulosVotadosSchema  = new mongoose.Schema({
    capitulo: {
        type: Schema.Types.ObjectId,
        ref: 'Capitulo'
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuarios'
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
},{ timestamps: true, collection: 'capitulos_votados'})