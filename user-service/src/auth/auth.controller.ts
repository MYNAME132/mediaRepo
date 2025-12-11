import { Controller, Post, Body, } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from '../user/dto/signup.dto';
import { LoginDto } from '../user/dto/logIn.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')    
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @ApiOperation({ summary: 'User signup' })
    @Post('signup')
    async signUp(@Body() createUserDto: SignupDto) {
        return this.authService.signUp(createUserDto);
    }

    @ApiOperation({ summary: 'User login' })
    @Post('login')
    signIn(@Body()  loginDto: LoginDto) {
        return this.authService.signIn(loginDto);
    }
}