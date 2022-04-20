
import { ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { UserService } from '../../user/user.service';
import { AuthService } from '../auth.service';
import { jwtConstants } from '../constants';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

    constructor(private jwtService: JwtService, private userService: UserService, private authService: AuthService) {
        super();
    }
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        //Add your custom authentication logic here
        const currentAccessToken = context.switchToHttp().getRequest().headers['access-token'];
        const currentRefreshToken = context.switchToHttp().getRequest().headers['refresh-token'];

        if (currentAccessToken) {
            try {
                this.jwtService.verify(currentAccessToken, { secret: jwtConstants.secret });
                //check if token is valid

            } catch (error) {
                //if token is invalid, return false
                try {
                    if (!currentRefreshToken) {
                        return false;
                    }

                    const payload: {} = this.jwtService.decode(currentRefreshToken);

                    const user = this.userService.findOne(payload['sub']);

                    user.then(user => {
                        //check if refresh token is valid
                        const refreshToken = this.jwtService.verify(currentRefreshToken, { secret: Buffer.from(jwtConstants.refreshTokenSecret + user.password).toString('base64') });
                        //if refresh token is valid, return a new pair of tokens
                        if (refreshToken) {
                            context.switchToHttp().getResponse().setHeader('refresh-token', this.authService.createRefreshToken(user));
                            context.switchToHttp().getResponse().setHeader('access-token', this.authService.createAccessToken(user));
                        }
                    }).catch(error => {
                        //if refresh token is invalid, return false
                        return false;
                    });

                } catch (error) {
                    return false;
                }

            }

        }

        return super.canActivate(context);

    }
}
