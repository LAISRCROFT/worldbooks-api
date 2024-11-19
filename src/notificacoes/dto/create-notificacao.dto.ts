export class CreateNotificacaoDto {
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
