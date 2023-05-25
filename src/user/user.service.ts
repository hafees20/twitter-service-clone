import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    // Get users info with username
    async getUser(username: string) {
        // finding user
        const user = await this.prisma.user.findUnique({
            where: {
                username
            },
            include:{
                tweets:true
            }
        })

        // if not user
        if(!user){
            throw new ForbiddenException("User Not Found")
        }

        // return user
        delete user.password
        delete user.email
        return user
    }
}
