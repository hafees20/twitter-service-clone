import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from 'src/auth/guard';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
    constructor(private userService:UserService){}

    @Get(':username')
    getUser(@Param('username') username:string){
        return this.userService.getUser(username)
    }
}