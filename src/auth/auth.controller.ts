import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }
    @Post('signup')
    signup(@Body() dto: SignUpDto) {
        return this.authService.signup(dto)
    }
    
    @HttpCode(200)
    @Post('signin')
    signin(@Body() dto: SignInDto) {
        return this.authService.signin(dto)
    }
}
