import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get<string>('JWT_SECRET') || 'e9d3fbb9c6a57a3e5d8e9b4ffdc3e5b1f7b9a03e1e5d4c3fa7b3c4f1d8e9b4d6',
        });
    }

    async validate(payload: any) {
        console.log('JWT Payload:', payload);
        return {
            userId: payload.sub,
            username: payload.username,
            role: payload.role,
            organizationId: payload.organizationId,
        };
    }
}