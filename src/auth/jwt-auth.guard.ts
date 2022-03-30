
import { ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

    constructor(private jwtService: JwtService) {
        super();
    }
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        // Add your custom authentication logic here
        const currentAccessToken = context.switchToHttp().getRequest().headers.authorization.split(' ')[1];
        const currentRefreshToken = context.switchToHttp().getRequest().headers.cookie.split(';')[0].split('=')[1];
        
        //verify current token
        const currentToken = this.jwtService.decode(currentAccessToken);

        //check if token is valid
        return super.canActivate(context);
    }
}
