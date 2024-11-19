const mongoose = require("mongoose")
const Schema = mongoose.Schema
import currentDate from 'src/commom/dateFormat'

export const DireitosAutoraisSchema  = new mongoose.Schema({
    tipo_autoral: {
        type: String,
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
},{ timestamps: true, collection: 'direitos_autorais'})