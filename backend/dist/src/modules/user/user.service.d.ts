import { PrismaService } from '../../config/prisma.service';
import { UpdateUserDto } from './dto/user.dto';
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    getUser(userId: string): Promise<{
        success: boolean;
        data: {
            id: string;
            createdAt: Date;
            name: string;
            email: string;
        };
        message: string;
    }>;
    updateUser(userId: string, dto: UpdateUserDto): Promise<{
        success: boolean;
        data: {
            id: string;
            name: string;
            email: string;
        };
        message: string;
    }>;
}
