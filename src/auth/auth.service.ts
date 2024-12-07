import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuariosService} from './../usuarios/usuarios.service'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsuariosService,
        private jwtService: JwtService,
    ){}
    private readonly logger = new Logger(AuthService.name)

    async validadeUser(email: string, password: string){
        const usuario = await this.usersService.consultarUserEmail(email)
        const isMatch = await bcrypt.compare(password, usuario.password)
        
        if(usuario && isMatch === true){
            const { _id, name, email } = usuario
            return { _id, name, email }

        }
        return null
    }
 
    async login(usuario: any){
        console.log(usuario)
        let userExistente:any = await this.usersService.consultarUserEmail(usuario.email)
        if (!userExistente) {
            throw new BadRequestException(`Usuário não localizado`)
        }

        const payload = { email: userExistente.email, sub: userExistente._id }

        delete userExistente.password
        if (userExistente.status._id.equals('65528dada837dfb959cdf98e')) {
            throw new BadRequestException({ code: 1, message: `Usuário está desativado` })
        }

        this.logger.warn(`Login realizado: ${JSON.stringify(userExistente)}`)

        return {
            usuario: userExistente,
            access_token: this.jwtService.sign(payload)
        }  
    }

    async descriptografar(jwt){
        return await this.jwtService.decode(jwt)
    }        
}