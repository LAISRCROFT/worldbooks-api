import {Document} from "mongoose";

export interface Tag extends Document{
    nome: string
    createdAt: Date
    updatedAt: Date
}
    
    
    
