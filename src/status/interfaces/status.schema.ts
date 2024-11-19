const mongoose = require("mongoose")
const Schema = mongoose.Schema
import currentDate from 'src/commom/dateFormat'

export const StatusSchema  = new mongoose.Schema({
    nome: {
        type: String,
        require: true
    },
    color: {
        type: String,
        require: false
    },
    grupo: {
        type: Schema.Types.ObjectId,
        ref: 'Grupo'
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
},{ timestamps: true, collection: 'status'})