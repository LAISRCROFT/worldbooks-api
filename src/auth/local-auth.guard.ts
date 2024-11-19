import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
// import { Injectable, ExecutionContext } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';
// import { Reflector } from '@nestjs/core';
// import { IS_PUBLIC_KEY } from './public.decorator';

// @Injectable()
// export class LocalAuthGuard extends AuthGuard('local') {
//     constructor(private reflector: Reflector) {
//         super();
//     }
    
//     canActivate(context: ExecutionContext) {
//         const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
//             context.getHandler(),
//             context.getClass(),
//         ]);
//         if (isPublic) {
//             return true;
//         }
//         return super.canActivate(context);
//     }
// }
