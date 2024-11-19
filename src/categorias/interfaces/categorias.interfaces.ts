import {Document} from "mongoose";

export interface Categoria extends Document{
    nome: string
    bg_path_mobile: string
    createdAt: Date
    updatedAt: Date
}
    
    
    
