import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TweetDto, EditTweetDto } from './dto';

@Injectable()
export class TweetService {
    constructor(private prisma: PrismaService) { }

    // Create Tweet
    async createTweet(userId: number, dto: TweetDto) {

        // store to db
        try {
            const tweet = await this.prisma.tweet.create({
                data: {
                    userId,
                    ...dto
                }
            })
            return tweet
        } catch (error) {
            return new BadRequestException("Tweet Failed")
        }

    }

    // Get tweet using tweetId
    async getTweetById(tweetId: number) {
        // get tweet from db
        const tweet = await this.prisma.tweet.findUnique({
            where: {
                id: tweetId
            }
        })

        // If no tweets
        if (!tweet) {
            return new NotFoundException("No tweets found")
        }

        // return tweets
        return tweet
    }

    // Delete Tweet
    async deleteTweet(userId: number, tweetId: number) {
        // finding the tweet
        const tweet = await this.prisma.tweet.findUnique({
            where: {
                id: tweetId
            }
        })

        // if tweet check the userId
        if (!tweet || tweet.userId !== userId) {
            throw new NotFoundException(
                'No Tweets Found',
            );
        }

        await this.prisma.tweet.delete({
            where: {
                id: tweetId
            }
        })
    }

    // Edit Tweet
    async editTweet(userId: number, tweetId: number, dto: EditTweetDto) {

        // finding the tweet
        const tweet = await this.prisma.tweet.findUnique({
            where: {
                id: tweetId
            }
        })

        // if no tweet or not users tweet
        if (!tweet || tweet.userId !== userId) {
            throw new NotFoundException("No Tweets Found")
        }

        // if tweet and owned by user
        const editedTweet = await this.prisma.tweet.update(
            {
                where: {
                    id: tweetId
                },
                data: {
                    ...dto
                }
            }
        )

        // return the edited tweet to user
        return editedTweet
    }
}
