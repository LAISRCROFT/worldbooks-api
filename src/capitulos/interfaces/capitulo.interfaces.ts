import {Document} from "mongoose";

export interface Capitulo extends Document {
    titulo: string
    capitulo: string
    historia: string
    usuario: string
    quantidade_visualizacao: number
    votacao: number
    caminho_capa: string
    status: string
    createdAt: Date
    updatedAt: Date
}
    
    
    
