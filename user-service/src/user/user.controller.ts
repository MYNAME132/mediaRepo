import { Body, Controller, Put, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { AuthGuard } from "@nestjs/passport";
import { CurrentUser } from "../auth/decorators/current.user.decoretor";
import { UserUpadteDto } from "./dto/userUpadte.dto";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags('users')
@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Put()
    @ApiOperation({ summary: 'Update current user profile' })
    async update(@CurrentUser() user: any, @Body() updateUserDto: UserUpadteDto) {
    return this.userService.update(user.sub, updateUserDto)
    }
}