import {Document} from "mongoose";

export interface Grupo extends Document{
    nome: string
    createdAt: Date
    updatedAt: Date
}
    
    
    
