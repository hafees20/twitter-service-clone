import { IsNotEmpty, IsString } from "class-validator";

export class EditTweetDto {
    @IsNotEmpty()
    @IsString()
    content: string
}