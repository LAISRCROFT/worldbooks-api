import { Controller, UseGuards, Request, Post, UseInterceptors, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard'
import { Public } from './public.decorator';

// @UseInterceptors(UserInterceptor)
@Controller('v1/auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Post('login')
    @UseGuards(LocalAuthGuard)
    @Public()
    async login(@Request() req: any){
        return await this.authService.login(req.body)
    }
}