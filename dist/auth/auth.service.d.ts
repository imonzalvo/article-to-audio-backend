import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private userService;
    private jwtService;
    private google;
    constructor(userService: UserService, jwtService: JwtService);
    validateGoogleToken(token: string): Promise<import("../user/user.schema").User>;
    generateJwt(user: any): string;
}
