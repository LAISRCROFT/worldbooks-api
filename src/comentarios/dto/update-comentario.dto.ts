export class UpdateComentarioDto {
    capitulo: string
    projeto: string
    comentario: string
    tipo: string
    usuario: string
    respostas: [string]
    updatedAt: Date
}
