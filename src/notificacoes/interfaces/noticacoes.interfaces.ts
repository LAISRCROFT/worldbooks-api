import {Document} from "mongoose";

export interface Notificacao extends Document {
    corpo?: string
    remetente: string
    destinatario: string
    tipo: string
    projeto?: string
    historia?: string
    lido: boolean
    createdAt: Date
    updatedAt: Date
}
    
    
    
