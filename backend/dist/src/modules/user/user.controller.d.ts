import { UserService } from './user.service';
import { UpdateUserDto } from './dto/user.dto';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    getMe(req: any): Promise<{
        success: boolean;
        data: {
            id: string;
            createdAt: Date;
            name: string;
            email: string;
        };
        message: string;
    }>;
    updateProfile(req: any, dto: UpdateUserDto): Promise<{
        success: boolean;
        data: {
            id: string;
            name: string;
            email: string;
        };
        message: string;
    }>;
}
