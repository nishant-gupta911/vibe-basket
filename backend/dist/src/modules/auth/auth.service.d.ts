import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../config/prisma.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(dto: RegisterDto): Promise<{
        success: boolean;
        data: {
            accessToken: string;
            refreshToken: string;
            user: {
                id: string;
                email: string;
                name: string;
            };
        };
        message: string;
    }>;
    login(dto: LoginDto): Promise<{
        success: boolean;
        data: {
            accessToken: string;
            refreshToken: string;
            user: {
                id: string;
                email: string;
                name: string;
            };
        };
        message: string;
    }>;
    refreshToken(refreshToken: string): Promise<{
        success: boolean;
        data: {
            accessToken: string;
            refreshToken: string;
        };
        message: string;
    }>;
    getProfile(userId: string): Promise<{
        success: boolean;
        data: {
            id: string;
            createdAt: Date;
            name: string;
            email: string;
        };
        message: string;
    }>;
    private generateTokens;
}
