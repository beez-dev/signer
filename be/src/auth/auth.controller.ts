import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    HttpException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('signup')
    @HttpCode(HttpStatus.CREATED)
    async signup(
        @Body() body: { email: string; password: string; name: string },
    ) {
        try {
            const { email, password, name } = body;
            return this.authService.signup(email, password, name);
        } catch (error) {
            if (error.message === 'User already exists') {
                throw new HttpException(
                    'User already exists',
                    HttpStatus.CONFLICT,
                );
            }
            throw new HttpException(
                'Signup failed',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Post('signin')
    @HttpCode(HttpStatus.OK)
    async signin(@Body() body: { email: string; password: string }) {
        try {
            const { email, password } = body;
            return this.authService.signin(email, password);
        } catch (error) {
            if (error.message === 'Invalid credentials') {
                throw new HttpException(
                    'Invalid credentials',
                    HttpStatus.UNAUTHORIZED,
                );
            }
            throw new HttpException(
                'Signin failed',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
