import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from 'src/auth/guard';
import { SearchExpressionDto } from './dto/search-expression-dto';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
    constructor(private userService:UserService){}

    @Get(':username')
    getUser(@Param('username') username:string){
        return this.userService.getUser(username)
    }

    @Post('search')
    searchUsernames(@Body() dto:SearchExpressionDto){
        return this.userService.searchUsernames(dto)
    }
}