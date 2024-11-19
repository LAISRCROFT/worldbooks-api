import {Document} from "mongoose";

export interface Idioma extends Document{
    nome: string
    createdAt: Date
    updatedAt: Date
}
    
    
    
