const mongoose = require("mongoose")
const Schema = mongoose.Schema
import currentDate from 'src/commom/dateFormat'

export const TiposSchema  = new mongoose.Schema({
    nome: {
        type: String,
        require: true
    },
    grupo:{
        type: Schema.Types.ObjectId,
        ref: 'Grupo'
    },
    status:{
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
},{ timestamps: true, collection: 'tipos'})