import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entity/user.entity";
import { DataSource, Repository } from "typeorm";
import { SignupDto } from "./dto/signup.dto";
import { UserUpadteDto } from "./dto/userUpadte.dto";

@Injectable()
export class UserService 
{
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>) {}

    async findByEmail(email: string) {
      return this.userRepository.findOne({ where: { email } });
    }

    async create(signUpData: SignupDto): Promise<User> {
      return this.userRepository.save(signUpData);
    }

    async update(userId:string, updateUser: UserUpadteDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      Object.assign(user, updateUser);
      return this.userRepository.save(user);
    }
}