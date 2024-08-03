import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "./user.schema";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findOne(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }

  async findOrCreate(userData: Partial<User>): Promise<User> {
    let user = await this.userModel.findOne({ email: userData.email });
    console.log("holaaaa 2", user)
    if (!user) {
      user = new this.userModel(userData);
      await user.save();
    } else {
      // Update user information
      user.firstName = userData.firstName;
      user.lastName = userData.lastName;
      user.picture = userData.picture;
      await user.save();
    }
    return user;
  }
}
