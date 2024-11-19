const mongoose = require("mongoose")
const Schema = mongoose.Schema
import currentDate from 'src/commom/dateFormat'

export const CategoriaSchema  = new mongoose.Schema({
    nome: {
        type: String,
        require: true
    },
    bg_path_mobile: {
        type: String,
        require: false
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
},{ timestamps: true, collection: 'categorias'})