import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, RefreshTokenDto } from './dto/auth.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
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
    refresh(dto: RefreshTokenDto): Promise<{
        success: boolean;
        data: {
            accessToken: string;
            refreshToken: string;
        };
        message: string;
    }>;
    getProfile(req: any): Promise<{
        success: boolean;
        data: {
            id: string;
            createdAt: Date;
            name: string;
            email: string;
        };
        message: string;
    }>;
}
