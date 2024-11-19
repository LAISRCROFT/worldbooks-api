import {Document} from "mongoose";

export interface DireitoAutoral extends Document{
    tipo_autoral: string
    createdAt: Date
    updatedAt: Date
}
    
    
    
