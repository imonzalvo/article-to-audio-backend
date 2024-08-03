import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    googleAuthCallback(body: {
        id_token: string;
        access_token: string;
    }): Promise<{
        success: boolean;
        user: import("../user/user.schema").User;
        token: string;
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        user?: undefined;
        token?: undefined;
    }>;
}
