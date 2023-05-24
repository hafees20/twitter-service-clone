import { ForbiddenException, Injectable } from '@nestjs/common';
import * as argon from 'argon2'
import { PrismaService } from 'src/prisma/prisma.service';
import { SignInDto, SignUpDto } from './dto';
import { User } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private config: ConfigService,
        private jwt: JwtService
    ) {}

    // Signup
    async signup(dto: SignUpDto) {
        // hashing
        const hash: string = await argon.hash(dto.password)

        // storing
        try {
            const user: User = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    password: hash,
                    username: dto.username
                }
            })

            // returning without pass
            delete user.password
            return user

        } catch (error) {
            // if error 
            if (error.code === 'P2002') {
                throw new ForbiddenException("User Exists")
            }
            throw new ForbiddenException("Database Error")
        }

    }

    // Signin
    async signin(dto: SignInDto) {
        // if user exist
        const user: User = await this.prisma.user.findUnique({
            where: {
                email: dto.email
            }
        })

        if (!user) {
            throw new ForbiddenException("Credentials Incorrect")
        }

        // if user compare password
        const passwordMatches: boolean = await argon.verify(user.password, dto.password)

        // if not password
        if (!passwordMatches) {
            throw new ForbiddenException("Password Incorrect")
        }

        return this.signToken(user.id, user.email)
    }

    // Access token for authenticated users
    async signToken(userId: number, email: string): Promise<{ access_token: string }> {
        const payload: {} = {
            sub: userId,
            email
        }

        const secret = this.config.get('JWT_SECRET')

        const token = await this.jwt.signAsync(payload, {
            expiresIn: '15m',
            secret: secret,
        })

        return { access_token: token }
    }
}
