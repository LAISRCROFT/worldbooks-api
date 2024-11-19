const mongoose = require("mongoose")
const Schema = mongoose.Schema
import currentDate from 'src/commom/dateFormat'

export const UsuariosSchema  = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email:{
        type: String,
        require: true,
        unique: true
    },
    email_verified_at:{
        type: Boolean,
        require: true
    },
    usar_apelido:{
        type: Boolean,
        require: true,
    },
    apelido:{
        type: String,
        require: true,
    },
    password:{
        type: String,
        require: true
    },
    telefone:{
        type: String,
        require: false
    },
    data_nascimento:{
        type: Date,
        require: true
    },
    sobre:{
        type: String,
        require: false
    },
    foto_perfil:{
        type: String,
        require: false
    },
    tipo:{
        type: Schema.Types.ObjectId,
        ref: 'Tipo'
    },
    projetos: [{
        type: Schema.Types.ObjectId,
        ref: 'Projeto'
    }],
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
},{ timestamps: true, collection: 'usuarios' })