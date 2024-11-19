export class CreateComentarioDto {
    capitulo: string
    projeto: string
    comentario: string
    usuario: string
    tipo: string
    respostas: [string]
    createdAt: Date
    updatedAt: Date
}
