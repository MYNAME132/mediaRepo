import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { User } from '../user/entity/user.entity';
import { SignupDto } from '../user/dto/signup.dto';
import { LoginDto } from '../user/dto/logIn.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) { }
    async signUp(createUserDto: SignupDto): Promise<User> {
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const existingEmail = await this.userService.findByEmail(createUserDto.email);

        if (existingEmail) {
            throw new BadRequestException('Email already in use');
        }
        return this.userService.create({
            ...createUserDto,
            password: hashedPassword
        });
    }

    public async signIn(loginDto: LoginDto): Promise<{ accessToken: string }> {
        const user = await this.userService.findByEmail(loginDto.email);
        if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const payload = {
            sub: user.id,
            username: user.name,
            role: user.role,
            organizationId: user.organization,
        };

        return { accessToken: this.jwtService.sign(payload) };
    }

    async validateToken(token: string) {
        try {
            const decoded = this.jwtService.verify(token);
            return { isValid: true, user: decoded };
        } catch {
            return { isValid: false, user: null };
        }
    }
}
