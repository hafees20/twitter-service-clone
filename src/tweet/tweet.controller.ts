import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { TweetService } from './tweet.service';
import { TweetDto, EditTweetDto } from './dto';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { getUser } from 'src/auth/decorator/get-user.decorator';


@UseGuards(JwtGuard)
@Controller('tweet')
export class TweetController {
    constructor(private tweetService: TweetService
    ) { }

    @Post('create')
    createTweet(@getUser('id') userId: number,@getUser('username') username:string, @Body() dto: TweetDto) {
        return this.tweetService.createTweet(userId, username,dto)
    }

    @Get('all')
    getAllTweets(){
        return this.tweetService.getAllTweets()
    }

    @Get(':id')
    getTweetById(@getUser('id') userId: number, @Param('id', ParseIntPipe) tweetId: number) {
        return this.tweetService.getTweetById(tweetId)
    }

    @HttpCode(204)
    @Delete('delete/:id')
    deleteTweet(@getUser('id') userId: number, @Param('id', ParseIntPipe) tweetId: number) {
        return this.tweetService.deleteTweet(userId, tweetId)
    }

    @Patch('edit/:id')
    editTweet(@getUser('id') userId: number, @Param('id', ParseIntPipe) tweetId: number, @Body() dto: EditTweetDto) {
        return this.tweetService.editTweet(userId, tweetId, dto)
    }
}
