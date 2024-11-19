const mongoose = require("mongoose")
const Schema = mongoose.Schema
import currentDate from 'src/commom/dateFormat'

export const PublicoAlvoSchema  = new mongoose.Schema({
    publico: {
        type: String,
        require: true
    },
    idade_min: {
        type: Number,
        require: true
    },
    idade_max: {
        type: Number,
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
},{ timestamps: true, collection: 'publicos_alvos'})