import {Document} from "mongoose";

export interface CapituloVotado extends Document {
    capitulo: string
    usuario: string
    createdAt: Date
    updatedAt: Date
}
    
    
    
