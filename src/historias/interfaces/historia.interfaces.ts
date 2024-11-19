import {Document} from "mongoose";

export interface Historia extends Document {
    titulo: string
    descricao: string
    categoria: string
    publico_alvo: string
    idioma: string
    direitos_autorais: string
    tags: [string]
    conteudo_adulto: boolean
    caminho_capa: string
    usuario: string
    projetos?: [string]
    status: string
    historia_finalizada: boolean
    createdAt: Date
    updatedAt: Date
}
    
    
    
