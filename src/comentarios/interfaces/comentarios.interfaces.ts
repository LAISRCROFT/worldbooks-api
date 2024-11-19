import {Document} from "mongoose";

export interface Comentario extends Document{
    capitulo: string
    projeto: string
    comentario: string
    tipo: string
    usuario: string
    respostas: [string]
    createdAt: Date
    updatedAt: Date
}
    
    
    
