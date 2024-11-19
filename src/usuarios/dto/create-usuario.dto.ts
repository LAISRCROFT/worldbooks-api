export class CreateUsuarioDto {
    name: string
    apelido: string
    email: string
    email_verified_at: boolean
    usar_apelido: boolean
    password: string
    telefone?: string
    data_nascimento: Date
    tipo: string
    projetos?: [string]
    status: string
    foto_perfil?: string
    sobre?: string
    createdAt: Date
    updatedAt: Date
}