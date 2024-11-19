import {Document} from "mongoose";

export interface PublicoAlvo extends Document{
    publico: string
    idade_min: number
    idade_max: number
    updatedAt: Date
}
    
    
    
