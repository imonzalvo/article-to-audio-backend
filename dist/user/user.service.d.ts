import { Model } from "mongoose";
import { User } from "./user.schema";
import { CreateUserDto } from "./dto/create-user.dto";
export declare class UserService {
    private userModel;
    constructor(userModel: Model<User>);
    create(createUserDto: CreateUserDto): Promise<User>;
    findOne(id: string): Promise<User>;
    findOrCreate(userData: Partial<User>): Promise<User>;
}
