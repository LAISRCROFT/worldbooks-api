export class UpdateNotificacaoDto {
    corpo?: string
    remetente: string
    destinatario: string
    tipo: string
    projeto?: string
    historia?: string
    lido: boolean
    updatedAt: Date
}
