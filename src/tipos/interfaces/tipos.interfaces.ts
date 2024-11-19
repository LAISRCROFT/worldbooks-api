import {Document} from "mongoose";

export interface Tipo extends Document{
    nome: string
    grupo: string
    status: string
    createdAt: Date
    updatedAt: Date
}
    
    
    
