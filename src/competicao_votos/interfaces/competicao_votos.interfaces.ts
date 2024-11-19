import {Document} from "mongoose";

export interface CompeticaoVoto extends Document {
    historia_votada: string
    usuario: string
    projeto: string
    createdAt: Date
    updatedAt: Date
}
    
    
    
