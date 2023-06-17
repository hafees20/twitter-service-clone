import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TweetDto, EditTweetDto } from './dto';

@Injectable()
export class TweetService {
    constructor(private prisma: PrismaService) { }

    // Create Tweet
    async createTweet(userId: number, username:string,dto: TweetDto) {

        // store to db
        try {
            const tweet = await this.prisma.tweet.create({
                data: {
                    userId,
                    ...dto
                }
            })

            const newTweet={...tweet,username}
            
            return newTweet
        } catch (error) {
            return new BadRequestException("Tweet Failed")
        }

    }

    // get all tweets
    async getAllTweets() {
        // get all tweets from db
        const tweets = await this.prisma.tweet.findMany({
            orderBy: {
                createdAt: 'desc',
            }
        })
        const userIds = tweets.map(tweet => tweet.userId);

        const users = await this.prisma.user.findMany({
            where: { id: { in: userIds } },
            select: { id: true, username: true },
        });

        // Create a map of userId to username for easy lookup
        const userMap = {};
        users.forEach(user => {
            userMap[user.id] = user.username;
        });

        // Add the username to each tweet object
        const tweetsWithUsername = tweets.map(tweet => ({
            id: tweet.id,
            content: tweet.content,
            createdAt: tweet.createdAt,
            userId: tweet.userId,
            username: userMap[tweet.userId], // Get the username from the userMap
        }));

        return tweetsWithUsername

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
