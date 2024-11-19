const mongoose = require("mongoose")
const Schema = mongoose.Schema
import currentDate from 'src/commom/dateFormat'

export const ParceirosSchema  = new mongoose.Schema({
    nome: {
        type: String,
        require: true
    },
    sobre: {
        type: String,
        require: true
    },
    foto: {
        type: String,
        require: false
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
},{ timestamps: true, collection: 'parceiros'})