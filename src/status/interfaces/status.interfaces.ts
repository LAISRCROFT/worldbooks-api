import {Document} from "mongoose";

export interface Status extends Document{
    nome: string
    color: string
    grupo: string
    createdAt: Date
    updatedAt: Date
}
    
    
    
