import { Document } from "mongoose";

export interface Parceiro extends Document {
    nome: string
    sobre: string
    foto: string
    status: string
    createdAt: Date
    updatedAt: Date
}
    
    
    
