export class CreateProjetoDto {
    nome: string
    sobre: string
    numero_participantes: number
    numero_min_participantes: number
    numero_max_participantes: number
    status: string // se está acontecendo
    tipo: string // se competicao
    gestor: string 
    parceiro: string
    capa: string
    aberto_publico: boolean
    ranking?: [{
        colocacao: number
        historia: string
        total_votos: number
    }]
    createdAt: Date
    updatedAt: Date
}
